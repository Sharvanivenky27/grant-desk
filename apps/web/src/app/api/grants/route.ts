import { NextRequest } from 'next/server';
import { grantsQuerySchema } from '@grantdesk/api';
import { success, paginated, error } from '@grantdesk/api';
import { DEMO_GRANTS } from '@/lib/demo-grants';

const DEMO_MODE = !process.env.DATABASE_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = grantsQuerySchema.parse(Object.fromEntries(searchParams));

    if (DEMO_MODE) {
      let filtered = [...DEMO_GRANTS];

      if (params.q) {
        const q = params.q.toLowerCase();
        filtered = filtered.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q) ||
            g.agency.toLowerCase().includes(q)
        );
      }

      if (params.sector) {
        filtered = filtered.filter((g) => g.eligibleSectors.includes(params.sector!));
      }

      if (params.province) {
        filtered = filtered.filter((g) => g.eligibleProvinces.includes(params.province!));
      }

      if (params.level) {
        filtered = filtered.filter((g) => g.level === params.level);
      }

      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const total = filtered.length;
      const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

      return paginated(paged, { page, pageSize, total });
    }

    const { prisma } = await import('@grantdesk/db');

    const where: Record<string, unknown> = { isActive: true };

    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
        { agency: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    if (params.sector) {
      where.eligibleSectors = { has: params.sector };
    }

    if (params.province) {
      where.eligibleProvinces = { has: params.province };
    }

    if (params.level) {
      where.level = params.level;
    }

    const [grants, total] = await Promise.all([
      prisma.grant.findMany({
        where,
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.grant.count({ where }),
    ]);

    return paginated(grants, {
      page: params.page,
      pageSize: params.pageSize,
      total,
    });
  } catch (e) {
    return error(e as any);
  }
}
