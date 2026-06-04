/**
 * Mock Grant Data
 *
 * Sample Canadian government grants for development.
 * In production, this would come from the database.
 */

export interface Grant {
  id: string;
  sourceId: string | null;
  title: string;
  description: string;
  agency: string;
  level: 'federal' | 'provincial' | 'municipal' | 'private';
  grantType: 'grant' | 'loan' | 'contribution' | 'tax_credit';
  minAmount: number | null;
  maxAmount: number | null;
  deadline: string | null;
  deadlineType: 'fixed' | 'rolling' | 'ongoing';
  eligibleSectors: string[];
  eligibleStages: string[];
  eligibleProvinces: string[];
  requiredDocs: string[];
  applicationUrl: string;
  isActive: boolean;
}

export const MOCK_GRANTS: Grant[] = [
  {
    id: '1',
    sourceId: 'cdap-2025',
    title: 'Canada Digital Adoption Program',
    description: 'Support for small businesses to adopt digital technologies. Grants cover up to 90% of eligible costs for digital adoption planning and implementation, including e-commerce platforms, digital marketing, and cybersecurity upgrades.',
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
  },
  {
    id: '2',
    sourceId: 'canexport-2025',
    title: 'CanExport',
    description: 'Funding for Canadian small and medium-sized enterprises (SMEs) pursuing new export markets. Covers up to 50% of eligible costs for market development activities including trade shows, buyer meetings, and international marketing.',
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
  },
  {
    id: '3',
    sourceId: 'sred-2025',
    title: 'SR&ED Tax Credits',
    description: 'Refundable tax credits for Canadian businesses conducting eligible R&D activities. Credits range from 15% to 35% depending on business type and jurisdiction.',
    agency: 'Canada Revenue Agency (CRA)',
    level: 'federal',
    grantType: 'tax_credit',
    minAmount: null,
    maxAmount: null,
    deadline: null,
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Biotech', 'Clean Tech', 'Manufacturing', 'Aerospace'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['T661 form', 'Project description', 'Financial records'],
    applicationUrl: 'https://canada.ca/en/revenue-agency/programs/sred',
    isActive: true,
  },
  {
    id: '4',
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
  },
  {
    id: '5',
    sourceId: 'ontario-cdap-2025',
    title: 'Ontario Digital Adoption Fund',
    description: 'Provincial support for Ontario small businesses to adopt digital technologies. Grants cover up to 50% of eligible costs for digital transformation projects.',
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
  },
  {
    id: '6',
    sourceId: 'bc-tech-2025',
    title: 'BC Tech/IP Grant',
    description: 'Funding for BC technology companies to protect and commercialize intellectual property. Covers patent costs, IP strategy, and commercialization activities.',
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
  },
  {
    id: '7',
    sourceId: 'quebec-pme-2025',
    title: 'PME 4.0 - Digital Transformation',
    description: 'Quebec government support for small and medium businesses undergoing digital transformation. Covers up to 50% of eligible costs for digital adoption.',
    agency: "Ministère de l'Économie et de l'Innovation du Québec",
    level: 'provincial',
    grantType: 'grant',
    minAmount: 15000,
    maxAmount: 100000,
    deadline: '2026-12-31',
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Manufacturing', 'Services', 'Retail'],
    eligibleStages: ['startup', 'revenue', 'established'],
    eligibleProvinces: ['QC'],
    requiredDocs: ['Business registration', 'Digital transformation plan', 'Budget'],
    applicationUrl: 'https://economie.gouv.qc.ca/pmq4',
    isActive: true,
  },
  {
    id: '8',
    sourceId: 'alberta-innovates-2025',
    title: 'Alberta Innovates Voucher Program',
    description: 'Vouchers for Alberta SMEs to access technical services from research organizations. Covers up to 80% of approved technical service costs.',
    agency: 'Alberta Innovates',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 10000,
    maxAmount: 50000,
    deadline: '2026-12-31',
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Clean Tech', 'Agriculture', 'Energy'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['AB'],
    requiredDocs: ['Project description', 'Technical service provider quote'],
    applicationUrl: 'https://albertainnovates.ca',
    isActive: true,
  },
  {
    id: '9',
    sourceId: 'agri-clean-2025',
    title: 'Agricultural Clean Technology Program',
    description: 'Funding for agriculture SMEs to adopt clean technologies. Covers up to 50% of eligible costs for on-farm clean tech adoption and pre-commercialization.',
    agency: 'Agriculture and Agri-Food Canada',
    level: 'federal',
    grantType: 'grant',
    minAmount: 50000,
    maxAmount: 2000000,
    deadline: '2026-03-31',
    deadlineType: 'fixed',
    eligibleSectors: ['Agriculture', 'Clean Tech'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Farm registration', 'Project description', 'Environmental assessment'],
    applicationUrl: 'https://agriculture.canada.ca/act',
    isActive: true,
  },
  {
    id: '10',
    sourceId: 'black-entrepreneurship-2025',
    title: 'Black Entrepreneurship Program',
    description: 'Support for Black-led businesses in Canada. Combines $250,000 in loans with a $5,000 grant for eligible Black entrepreneurs.',
    agency: 'Government of Canada / EDC',
    level: 'federal',
    grantType: 'grant',
    minAmount: 5000,
    maxAmount: 255000,
    deadline: '2026-12-31',
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Retail', 'Services', 'Food & Beverage', 'Construction'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Business registration', 'Black ownership verification', 'Business plan'],
    applicationUrl: 'https://ised-isde.canada.ca/bep',
    isActive: true,
  },
];

export function formatAmount(min: number | null, max: number | null): string {
  if (min === null && max === null) return 'Varies';
  if (min === null) return `Up to $${max?.toLocaleString()}`;
  if (max === null) return `$${min.toLocaleString()}+`;
  if (min === max) return `$${min.toLocaleString()}`;
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

export function formatDeadline(deadline: string | null, deadlineType: string): string {
  if (!deadline) {
    if (deadlineType === 'ongoing') return 'Ongoing';
    return 'No deadline';
  }
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Closed';
  if (diffDays === 0) return 'Closing today';
  if (diffDays === 1) return 'Closes tomorrow';
  if (diffDays <= 30) return `Closes in ${diffDays} days`;
  return `Closes ${date.toLocaleDateString()}`;
}

export function getLevelBadgeColor(level: string): string {
  switch (level) {
    case 'federal': return 'bg-blue-100 text-blue-700';
    case 'provincial': return 'bg-green-100 text-green-700';
    case 'municipal': return 'bg-purple-100 text-purple-700';
    case 'private': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
