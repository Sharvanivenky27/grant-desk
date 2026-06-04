import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@grantdesk/db';
import { upsertProfileSchema } from '@grantdesk/api';
import { success, error, created, unauthorized, notFound } from '@grantdesk/api';
import { authOptions } from '@grantdesk/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorized();
    }

    const userId = (session.user as any).id;

    const profile = await prisma.businessProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      return notFound('Profile');
    }

    return success(profile);
  } catch (e) {
    return error(e as any);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return unauthorized();
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const data = upsertProfileSchema.parse(body);

    const existing = await prisma.businessProfile.findFirst({
      where: { userId },
    });

    const normalizedEmployees = data.employees
      ? parseInt(String(data.employees).match(/(\d+)/)?.[1] ?? '0', 10)
      : undefined;

    const profileData = {
      ...data,
      employees: normalizedEmployees,
    };

    const profile = existing
      ? await prisma.businessProfile.update({
          where: { id: existing.id },
          data: profileData,
        })
      : await prisma.businessProfile.create({
          data: { ...profileData, userId },
        });

    return existing ? success(profile) : created(profile);
  } catch (e) {
    return error(e as any);
  }
}
