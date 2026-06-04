import { NextRequest } from 'next/server';
import { prisma } from '@grantdesk/db';
import { grantIdSchema } from '@grantdesk/api';
import { success, error, notFound } from '@grantdesk/api';

const DEMO_MODE = !process.env.DATABASE_URL;

const MOCK_GRANTS = [
  { id: '1', title: 'Canada Digital Adoption Program', description: 'Support for small businesses to adopt digital technologies. Grants cover up to 90% of eligible costs for digital adoption planning and implementation.', agency: 'Innovation, Science and Economic Development Canada (ISED)', level: 'federal', grantType: 'grant', minAmount: 2500, maxAmount: 150000, avgAmount: null, deadline: '2026-12-31', deadlineType: 'rolling', eligibleSectors: ['IT', 'Retail', 'Manufacturing', 'Services', 'Agriculture'], eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'], eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'], requiredDocs: ['Business registration', 'Financial statements', 'Digital adoption plan'], applicationUrl: 'https://ised-isde.canada.ca/cdap', isActive: true, sourceId: 'cdap-2025', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'CanExport', description: 'Funding for Canadian small and medium-sized enterprises (SMEs) pursuing new export markets.', agency: 'Global Affairs Canada', level: 'federal', grantType: 'grant', minAmount: 10000, maxAmount: 50000, avgAmount: null, deadline: '2026-08-31', deadlineType: 'fixed', eligibleSectors: ['IT', 'Manufacturing', 'Agriculture', 'Food & Beverage', 'Clean Tech'], eligibleStages: ['revenue', 'established'], eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'], requiredDocs: ['Business registration', 'Export plan', 'Market research'], applicationUrl: 'https://tradecommissioner.gc.ca/canexport', isActive: true, sourceId: 'canexport-2025', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Industrial Research Assistance Program (IRAP)', description: 'Financial assistance for innovative SMEs in Canada. IRAP provides technical and business advisory services along with funding for R&D projects.', agency: 'National Research Council Canada (NRC)', level: 'federal', grantType: 'grant', minAmount: 50000, maxAmount: 500000, avgAmount: null, deadline: '2026-12-31', deadlineType: 'rolling', eligibleSectors: ['IT', 'Biotech', 'Clean Tech', 'Manufacturing', 'Aerospace'], eligibleStages: ['startup', 'pre-revenue', 'revenue'], eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'], requiredDocs: ['Technical project description', 'Financial statements', 'Innovation assessment'], applicationUrl: 'https://nrc.canada.ca/irap', isActive: true, sourceId: 'irap-2025', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', title: 'Ontario Digital Adoption Fund', description: 'Provincial support for Ontario small businesses to adopt digital technologies.', agency: 'Ontario Ministry of Economic Development', level: 'provincial', grantType: 'grant', minAmount: 2500, maxAmount: 50000, avgAmount: null, deadline: '2026-06-30', deadlineType: 'fixed', eligibleSectors: ['IT', 'Retail', 'Services', 'Manufacturing'], eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'], eligibleProvinces: ['ON'], requiredDocs: ['Business registration', 'Digital adoption plan', 'Cost quotes'], applicationUrl: 'https://ontario.ca/cdap', isActive: true, sourceId: 'ontario-cdap-2025', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', title: 'BC Tech/IP Grant', description: 'Funding for BC technology companies to protect and commercialize intellectual property.', agency: 'BC Ministry of Jobs, Economic Recovery', level: 'provincial', grantType: 'grant', minAmount: 25000, maxAmount: 250000, avgAmount: null, deadline: '2026-09-30', deadlineType: 'fixed', eligibleSectors: ['IT', 'Biotech', 'Clean Tech'], eligibleStages: ['startup', 'pre-revenue', 'revenue'], eligibleProvinces: ['BC'], requiredDocs: ['IP strategy document', 'Patent applications', 'Business plan'], applicationUrl: 'https://www2.gov.bc.ca/gov/content/technology', isActive: true, sourceId: 'bc-tech-2025', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (DEMO_MODE) {
      const grant = MOCK_GRANTS.find((g) => g.id === id);
      if (!grant) return notFound('Grant');
      return success(grant);
    }

    const parsed = grantIdSchema.parse({ id });
    const grant = await prisma.grant.findUnique({
      where: { id: parsed.id },
    });

    if (!grant) {
      return notFound('Grant');
    }

    return success(grant);
  } catch (e) {
    return error(e as any);
  }
}
