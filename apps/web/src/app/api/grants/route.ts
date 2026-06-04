import { NextRequest } from 'next/server';
import { grantsQuerySchema } from '@grantdesk/api';
import { success, paginated, error } from '@grantdesk/api';

// Demo mode: return mock grants when no database is available
const DEMO_MODE = !process.env.DATABASE_URL;

const MOCK_GRANTS = [
  {
    id: '1',
    sourceId: 'cdap-2025',
    title: 'Canada Digital Adoption Program',
    description: 'Support for small businesses to adopt digital technologies. Grants cover up to 90% of eligible costs for digital adoption planning and implementation.',
    agency: 'Innovation, Science and Economic Development Canada (ISED)',
    level: 'federal',
    grantType: 'grant',
    minAmount: 2500,
    maxAmount: 150000,
    deadline: '2026-12-31',
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Retail', 'Manufacturing', 'Services', 'Agriculture'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Business registration', 'Financial statements', 'Digital adoption plan'],
    applicationUrl: 'https://ised-isde.canada.ca/cdap',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    sourceId: 'canexport-2025',
    title: 'CanExport',
    description: 'Funding for Canadian small and medium-sized enterprises (SMEs) pursuing new export markets.',
    agency: 'Global Affairs Canada',
    level: 'federal',
    grantType: 'grant',
    minAmount: 10000,
    maxAmount: 50000,
    deadline: '2026-08-31',
    deadlineType: 'fixed',
    eligibleSectors: ['IT', 'Manufacturing', 'Agriculture', 'Food & Beverage', 'Clean Tech'],
    eligibleStages: ['revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Business registration', 'Export plan', 'Market research'],
    applicationUrl: 'https://tradecommissioner.gc.ca/canexport',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    sourceId: 'irap-2025',
    title: 'Industrial Research Assistance Program (IRAP)',
    description: 'Financial assistance for innovative SMEs in Canada. IRAP provides technical and business advisory services along with funding for R&D projects.',
    agency: 'National Research Council Canada (NRC)',
    level: 'federal',
    grantType: 'grant',
    minAmount: 50000,
    maxAmount: 500000,
    deadline: '2026-12-31',
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Biotech', 'Clean Tech', 'Manufacturing', 'Aerospace'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Technical project description', 'Financial statements', 'Innovation assessment'],
    applicationUrl: 'https://nrc.canada.ca/irap',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    sourceId: 'ontario-cdap-2025',
    title: 'Ontario Digital Adoption Fund',
    description: 'Provincial support for Ontario small businesses to adopt digital technologies.',
    agency: 'Ontario Ministry of Economic Development',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 2500,
    maxAmount: 50000,
    deadline: '2026-06-30',
    deadlineType: 'fixed',
    eligibleSectors: ['IT', 'Retail', 'Services', 'Manufacturing'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON'],
    requiredDocs: ['Business registration', 'Digital adoption plan', 'Cost quotes'],
    applicationUrl: 'https://ontario.ca/cdap',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    sourceId: 'bc-tech-2025',
    title: 'BC Tech/IP Grant',
    description: 'Funding for BC technology companies to protect and commercialize intellectual property.',
    agency: 'BC Ministry of Jobs, Economic Recovery',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 25000,
    maxAmount: 250000,
    deadline: '2026-09-30',
    deadlineType: 'fixed',
    eligibleSectors: ['IT', 'Biotech', 'Clean Tech'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['BC'],
    requiredDocs: ['IP strategy document', 'Patent applications', 'Business plan'],
    applicationUrl: 'https://www2.gov.bc.ca/gov/content/technology',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = grantsQuerySchema.parse(Object.fromEntries(searchParams));

    // Demo mode: return mock data
    if (DEMO_MODE) {
      let filtered = [...MOCK_GRANTS];

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
      const paginatedGrants = filtered.slice((page - 1) * pageSize, page * pageSize);

      return paginated(paginatedGrants, { page, pageSize, total });
    }

    const { prisma } = await import('@grantdesk/db');

    const where: any = { isActive: true };

    if (params.q) {
      const q = params.q.toLowerCase();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { agency: { contains: q, mode: 'insensitive' } },
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
