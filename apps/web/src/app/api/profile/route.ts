import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { success, created, unauthorized, notFound } from '@grantdesk/api';
import { authOptions } from '@grantdesk/auth';

const DEMO_MODE = !process.env.DATABASE_URL;
const DEMO_COOKIE = 'demo_profile';

function parseCookie(request: NextRequest): Record<string, unknown> | null {
  try {
    const raw = request.cookies.get(DEMO_COOKIE)?.value;
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function writeCookie(
  response: NextResponse,
  profile: Record<string, unknown>
): NextResponse {
  response.cookies.set(DEMO_COOKIE, encodeURIComponent(JSON.stringify(profile)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    if (DEMO_MODE) {
      const profile = parseCookie(request);
      if (!profile) return notFound('Profile');
      return NextResponse.json({ data: profile });
    }

    const { prisma } = await import('@grantdesk/db');
    const userId = (session.user as any).id;

    const profile = await prisma.businessProfile.findFirst({ where: { userId } });
    if (!profile) return notFound('Profile');

    return success(profile);
  } catch (e) {
    const { error } = await import('@grantdesk/api');
    return error(e as any);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await request.json();

    if (DEMO_MODE) {
      const { upsertProfileSchema } = await import('@grantdesk/api');
      const data = upsertProfileSchema.parse(body);

      const existing = parseCookie(request);
      const now = new Date().toISOString();

      // Keep employees as the raw string (e.g. '1-5') so the form Select
      // restores correctly on the next load. The DB path normalises to int.
      const profile = {
        id: existing ? (existing.id as string) : `demo-profile-${Date.now()}`,
        userId: (session.user as any).id,
        ...data,
        // employees stays as string in demo mode
        createdAt: existing ? (existing.createdAt as string) : now,
        updatedAt: now,
      };

      const res = NextResponse.json({ data: profile }, { status: existing ? 200 : 201 });
      return writeCookie(res, profile);
    }

    const { prisma } = await import('@grantdesk/db');
    const { upsertProfileSchema } = await import('@grantdesk/api');

    const userId = (session.user as any).id;
    const data = upsertProfileSchema.parse(body);

    const existing = await prisma.businessProfile.findFirst({ where: { userId } });

    const normalizedEmployees = data.employees
      ? parseInt(String(data.employees).match(/(\d+)/)?.[1] ?? '0', 10)
      : undefined;

    const profileData = { ...data, employees: normalizedEmployees };

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
    const { error } = await import('@grantdesk/api');
    return error(e as any);
  }
}
