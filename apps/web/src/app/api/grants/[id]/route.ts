import { NextRequest, NextResponse } from 'next/server';
import { success, notFound } from '@grantdesk/api';
import { DEMO_GRANTS } from '@/lib/demo-grants';

const DEMO_MODE = !process.env.DATABASE_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (DEMO_MODE) {
      const grant = DEMO_GRANTS.find((g) => g.id === id);
      if (!grant) return notFound('Grant');
      return success(grant);
    }

    const { prisma } = await import('@grantdesk/db');
    const { grantIdSchema } = await import('@grantdesk/api');
    const parsed = grantIdSchema.parse({ id });

    const grant = await prisma.grant.findUnique({
      where: { id: parsed.id },
    });

    if (!grant) return notFound('Grant');

    return success(grant);
  } catch (e) {
    const { error } = await import('@grantdesk/api');
    return error(e as any);
  }
}
