import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  success,
  created,
  paginated,
  unauthorized,
  notFound,
  conflict,
} from '@grantdesk/api';
import { authOptions } from '@grantdesk/auth';
import { DEMO_GRANTS } from '@/lib/demo-grants';

const DEMO_MODE = !process.env.DATABASE_URL;
const DEMO_COOKIE = 'demo_saved';

type PipelineStage = 'saved' | 'applied' | 'submitted' | 'awarded' | 'rejected' | 'withdrawn';

interface DemoSavedEntry {
  id: string;
  userId: string;
  grantId: string;
  stage: PipelineStage;
  notes: string | null;
  savedAt: string;
  appliedAt: string | null;
  submittedAt: string | null;
  outcomeAt: string | null;
}

function parseCookie(request: NextRequest): DemoSavedEntry[] {
  try {
    const raw = request.cookies.get(DEMO_COOKIE)?.value;
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function buildResponse(entry: DemoSavedEntry) {
  const grant = DEMO_GRANTS.find((g) => g.id === entry.grantId);
  if (!grant) return null;
  return { ...entry, grant };
}

function writeCookie(response: NextResponse, entries: DemoSavedEntry[]): NextResponse {
  response.cookies.set(DEMO_COOKIE, JSON.stringify(entries), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    if (DEMO_MODE) {
      const entries = parseCookie(request);
      const stage = new URL(request.url).searchParams.get('stage') as PipelineStage | null;
      const filtered = stage ? entries.filter((e) => e.stage === stage) : entries;
      const data = filtered.map(buildResponse).filter(Boolean);
      return NextResponse.json({
        data,
        meta: { page: 1, pageSize: 20, total: data.length, totalPages: 1 },
      });
    }

    const { prisma } = await import('@grantdesk/db');
    const { savedQuerySchema } = await import('@grantdesk/api');

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const params = savedQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = { userId };
    if (params.stage) where.stage = params.stage;

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
    const { error } = await import('@grantdesk/api');
    return error(e as any);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await request.json();

    if (DEMO_MODE) {
      const grantId = String(body?.grantId ?? '');
      if (!grantId) {
        return NextResponse.json(
          { error: { code: 'BAD_REQUEST', message: 'grantId is required' } },
          { status: 400 }
        );
      }
      const grant = DEMO_GRANTS.find((g) => g.id === grantId);
      if (!grant) return notFound('Grant');

      const entries = parseCookie(request);
      if (entries.some((e) => e.grantId === grantId)) {
        return conflict('Grant already saved');
      }

      const userId = (session.user as any).id ?? 'demo-1';
      const newEntry: DemoSavedEntry = {
        id: `demo-${Date.now()}`,
        userId,
        grantId,
        stage: 'saved',
        notes: null,
        savedAt: new Date().toISOString(),
        appliedAt: null,
        submittedAt: null,
        outcomeAt: null,
      };
      entries.push(newEntry);

      const res = NextResponse.json({ data: { ...newEntry, grant } }, { status: 201 });
      return writeCookie(res, entries);
    }

    const { prisma } = await import('@grantdesk/db');
    const { saveGrantSchema } = await import('@grantdesk/api');

    const userId = (session.user as any).id;
    const { grantId } = saveGrantSchema.parse(body);

    const grant = await prisma.grant.findUnique({ where: { id: grantId } });
    if (!grant) return notFound('Grant');

    const existing = await prisma.savedGrant.findUnique({
      where: { userId_grantId: { userId, grantId } },
    });
    if (existing) return conflict('Grant already saved');

    const savedGrant = await prisma.savedGrant.create({
      data: { userId, grantId },
      include: { grant: true },
    });

    return created(savedGrant);
  } catch (e) {
    const { error } = await import('@grantdesk/api');
    return error(e as any);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await request.json();

    if (DEMO_MODE) {
      const grantId = String(body?.grantId ?? '');
      const stage = body?.stage as PipelineStage;
      const notes: string | undefined = body?.notes;

      if (!grantId || !stage) {
        return NextResponse.json(
          { error: { code: 'BAD_REQUEST', message: 'grantId and stage are required' } },
          { status: 400 }
        );
      }

      const entries = parseCookie(request);
      const idx = entries.findIndex((e) => e.grantId === grantId);
      if (idx === -1) return notFound('Saved grant');

      const entry = { ...entries[idx] };
      entry.stage = stage;
      if (notes !== undefined) entry.notes = notes;

      const now = new Date().toISOString();
      if (stage === 'applied' && !entry.appliedAt) entry.appliedAt = now;
      if (stage === 'submitted') {
        if (!entry.submittedAt) entry.submittedAt = now;
        if (!entry.appliedAt) entry.appliedAt = now;
      }
      if (['awarded', 'rejected', 'withdrawn'].includes(stage) && !entry.outcomeAt) {
        entry.outcomeAt = now;
      }

      entries[idx] = entry;
      const grant = DEMO_GRANTS.find((g) => g.id === grantId);
      const res = NextResponse.json({ data: { ...entry, grant } });
      return writeCookie(res, entries);
    }

    const { prisma } = await import('@grantdesk/db');
    const { updateSavedStageSchema } = await import('@grantdesk/api');

    const userId = (session.user as any).id;
    const { grantId, stage, notes } = updateSavedStageSchema.parse(body);

    const existing = await prisma.savedGrant.findUnique({
      where: { userId_grantId: { userId, grantId } },
    });
    if (!existing) return notFound('Saved grant');

    const updateData: Record<string, unknown> = { stage };
    if (notes !== undefined) updateData.notes = notes;

    const now = new Date();
    if (stage === 'applied' && !existing.appliedAt) updateData.appliedAt = now;
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
    const { error } = await import('@grantdesk/api');
    return error(e as any);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const grantId = searchParams.get('grantId');
    if (!grantId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'grantId is required' } },
        { status: 400 }
      );
    }

    if (DEMO_MODE) {
      const entries = parseCookie(request);
      const next = entries.filter((e) => e.grantId !== grantId);
      const res = NextResponse.json({ data: null });
      return writeCookie(res, next);
    }

    const { prisma } = await import('@grantdesk/db');
    const userId = (session.user as any).id;

    await prisma.savedGrant.delete({
      where: { userId_grantId: { userId, grantId } },
    });

    return success(null);
  } catch (e: any) {
    if (e.code === 'P2025') return notFound('Saved grant');
    const { error } = await import('@grantdesk/api');
    return error(e);
  }
}
