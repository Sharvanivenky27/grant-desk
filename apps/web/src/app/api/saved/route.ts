import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@grantdesk/db';
import {
  saveGrantSchema,
  updateSavedStageSchema,
  savedQuerySchema,
} from '@grantdesk/api';
import {
  success,
  error,
  paginated,
  created,
  unauthorized,
  notFound,
  conflict,
} from '@grantdesk/api';
import { authOptions } from '@grantdesk/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorized();
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const params = savedQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = { userId };
    if (params.stage) {
      where.stage = params.stage;
    }

    const [savedGrants, total] = await Promise.all([
      prisma.savedGrant.findMany({
        where,
        include: { grant: true },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: { savedAt: 'desc' },
      }),
      prisma.savedGrant.count({ where }),
    ]);

    return paginated(savedGrants, {
      page: params.page,
      pageSize: params.pageSize,
      total,
    });
  } catch (e) {
    return error(e as any);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorized();
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { grantId } = saveGrantSchema.parse(body);

    const grant = await prisma.grant.findUnique({ where: { id: grantId } });
    if (!grant) {
      return notFound('Grant');
    }

    const existing = await prisma.savedGrant.findUnique({
      where: { userId_grantId: { userId, grantId } },
    });
    if (existing) {
      return conflict('Grant already saved');
    }

    const savedGrant = await prisma.savedGrant.create({
      data: { userId, grantId },
      include: { grant: true },
    });

    return created(savedGrant);
  } catch (e) {
    return error(e as any);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorized();
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { grantId, stage, notes } = updateSavedStageSchema.parse(body);

    const existing = await prisma.savedGrant.findUnique({
      where: { userId_grantId: { userId, grantId } },
    });
    if (!existing) {
      return notFound('Saved grant');
    }

    const updateData: any = { stage };
    if (notes !== undefined) updateData.notes = notes;

    const now = new Date();
    if (stage === 'applied' && !existing.appliedAt) {
      updateData.appliedAt = now;
    }
    if (stage === 'submitted' && !existing.submittedAt) {
      updateData.submittedAt = now;
      updateData.appliedAt = existing.appliedAt ?? now;
    }
    if (['awarded', 'rejected', 'withdrawn'].includes(stage) && !existing.outcomeAt) {
      updateData.outcomeAt = now;
    }

    const savedGrant = await prisma.savedGrant.update({
      where: { id: existing.id },
      data: updateData,
      include: { grant: true },
    });

    return success(savedGrant);
  } catch (e) {
    return error(e as any);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorized();
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const grantId = searchParams.get('grantId');
    if (!grantId) {
      return error({ statusCode: 400, message: 'grantId is required', code: 'BAD_REQUEST' } as any);
    }

    await prisma.savedGrant.delete({
      where: { userId_grantId: { userId, grantId } },
    });

    return success(null);
  } catch (e: any) {
    if (e.code === 'P2025') {
      return notFound('Saved grant');
    }
    return error(e);
  }
}
