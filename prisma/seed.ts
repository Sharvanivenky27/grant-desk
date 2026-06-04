/**
 * GrantDesk Database Seed
 *
 * Seeds the database with mock Canadian government grants.
 * In production, this would be replaced by data from government APIs.
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const MOCK_GRANTS = [
  {
    sourceId: 'cdap-2025',
    title: 'Canada Digital Adoption Program',
    description: 'Support for small businesses to adopt digital technologies. Grants cover up to 90% of eligible costs for digital adoption planning and implementation, including e-commerce platforms, digital marketing, and cybersecurity upgrades.',
    agency: 'Innovation, Science and Economic Development Canada (ISED)',
    level: 'federal',
    grantType: 'grant',
    minAmount: 2500,
    maxAmount: 150000,
    avgAmount: 50000,
    deadline: new Date('2026-12-31'),
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Retail', 'Manufacturing', 'Services', 'Agriculture'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU'],
    requiredDocs: ['Business registration', 'Financial statements', 'Digital adoption plan'],
    applicationUrl: 'https://ised-isde.canada.ca/cdap',
  },
  {
    sourceId: 'canexport-2025',
    title: 'CanExport',
    description: 'Funding for Canadian small and medium-sized enterprises (SMEs) pursuing new export markets. Covers up to 50% of eligible costs for market development activities including trade shows, buyer meetings, and international marketing.',
    agency: 'Global Affairs Canada',
    level: 'federal',
    grantType: 'grant',
    minAmount: 10000,
    maxAmount: 50000,
    avgAmount: 25000,
    deadline: new Date('2026-08-31'),
    deadlineType: 'fixed',
    eligibleSectors: ['IT', 'Manufacturing', 'Agriculture', 'Food & Beverage', 'Clean Tech'],
    eligibleStages: ['revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU'],
    requiredDocs: ['Business registration', 'Export plan', 'Market research'],
    applicationUrl: 'https://tradecommissioner.gc.ca/canexport',
  },
  {
    sourceId: 'sred-2025',
    title: 'Scientific Research and Experimental Development (SR&ED) Tax Credits',
    description: 'Refundable tax credits for Canadian businesses conducting eligible R&D activities. Credits range from 15% to 35% depending on business type and jurisdiction.',
    agency: 'Canada Revenue Agency (CRA)',
    level: 'federal',
    grantType: 'tax_credit',
    minAmount: null,
    maxAmount: null,
    avgAmount: 50000,
    deadline: null,
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Biotech', 'Clean Tech', 'Manufacturing', 'Aerospace'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU'],
    requiredDocs: ['T661 form', 'Project description', 'Financial records'],
    applicationUrl: 'https://canada.ca/en/revenue-agency/programs/sred',
  },
  {
    sourceId: 'irap-2025',
    title: 'Industrial Research Assistance Program (IRAP)',
    description: 'Financial assistance for innovative SMEs in Canada. IRAP provides technical and business advisory services along with funding for R&D projects.',
    agency: 'National Research Council Canada (NRC)',
    level: 'federal',
    grantType: 'grant',
    minAmount: 50000,
    maxAmount: 500000,
    avgAmount: 200000,
    deadline: new Date('2026-12-31'),
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Biotech', 'Clean Tech', 'Manufacturing', 'Aerospace'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU'],
    requiredDocs: ['Technical project description', 'Financial statements', 'Innovation assessment'],
    applicationUrl: 'https://nrc.canada.ca/irap',
  },
  {
    sourceId: 'ontario-cdap-2025',
    title: 'Ontario Digital Adoption Fund',
    description: 'Provincial support for Ontario small businesses to adopt digital technologies. Grants cover up to 50% of eligible costs for digital transformation projects.',
    agency: 'Ontario Ministry of Economic Development',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 2500,
    maxAmount: 50000,
    avgAmount: 20000,
    deadline: new Date('2026-06-30'),
    deadlineType: 'fixed',
    eligibleSectors: ['IT', 'Retail', 'Services', 'Manufacturing'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON'],
    requiredDocs: ['Business registration', 'Digital adoption plan', 'Cost quotes'],
    applicationUrl: 'https://ontario.ca/cdap',
  },
  {
    sourceId: 'bc-tech-2025',
    title: 'BC Tech/IP Grant',
    description: 'Funding for BC technology companies to protect and commercialize intellectual property. Covers patent costs, IP strategy, and commercialization activities.',
    agency: 'BC Ministry of Jobs, Economic Recovery',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 25000,
    maxAmount: 250000,
    avgAmount: 100000,
    deadline: new Date('2026-09-30'),
    deadlineType: 'fixed',
    eligibleSectors: ['IT', 'Biotech', 'Clean Tech'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['BC'],
    requiredDocs: ['IP strategy document', 'Patent applications', 'Business plan'],
    applicationUrl: 'https://www2.gov.bc.ca/gov/content/technology',
  },
  {
    sourceId: 'quebec-pme-2025',
    title: 'PME 4.0 - Digital Transformation',
    description: 'Quebec government support for small and medium businesses undergoing digital transformation. Covers up to 50% of eligible costs for digital adoption.',
    agency: 'Ministère de l\'Économie et de l\'Innovation du Québec',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 15000,
    maxAmount: 100000,
    avgAmount: 50000,
    deadline: new Date('2026-12-31'),
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Manufacturing', 'Services', 'Retail'],
    eligibleStages: ['startup', 'revenue', 'established'],
    eligibleProvinces: ['QC'],
    requiredDocs: ['Business registration', 'Digital transformation plan', 'Budget'],
    applicationUrl: 'https://economie.gouv.qc.ca/pmq4',
  },
  {
    sourceId: 'alberta-innovates-2025',
    title: 'Alberta Innovates Voucher Program',
    description: 'Vouchers for Alberta SMEs to access technical services from research organizations. Covers up to 80% of approved technical service costs.',
    agency: 'Alberta Innovates',
    level: 'provincial',
    grantType: 'grant',
    minAmount: 10000,
    maxAmount: 50000,
    avgAmount: 30000,
    deadline: new Date('2026-12-31'),
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Clean Tech', 'Agriculture', 'Energy'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['AB'],
    requiredDocs: ['Project description', 'Technical service provider quote'],
    applicationUrl: 'https://albertainnovates.ca',
  },
  {
    sourceId: 'futurpreneur-2025',
    title: 'Futurpreneur Canada',
    description: 'Startup financing for young entrepreneurs aged 18-39. Provides up to $60,000 in financing along with mentorship and business resources.',
    agency: 'Futurpreneur Canada',
    level: 'federal',
    grantType: 'loan',
    minAmount: 10000,
    maxAmount: 60000,
    avgAmount: 40000,
    deadline: null,
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Retail', 'Food & Beverage', 'Services', 'Agriculture'],
    eligibleStages: ['startup'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Business plan', 'Personal identification', 'Resume'],
    applicationUrl: 'https://futurpreneur.ca',
  },
  {
    sourceId: 'agri-clean-2025',
    title: 'Agricultural Clean Technology Program',
    description: 'Funding for agriculture SMEs to adopt clean technologies. Covers up to 50% of eligible costs for on-farm clean tech adoption and pre-commercialization.',
    agency: 'Agriculture and Agri-Food Canada',
    level: 'federal',
    grantType: 'grant',
    minAmount: 50000,
    maxAmount: 2000000,
    avgAmount: 300000,
    deadline: new Date('2026-03-31'),
    deadlineType: 'fixed',
    eligibleSectors: ['Agriculture', 'Clean Tech'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue', 'established'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU'],
    requiredDocs: ['Farm registration', 'Project description', 'Environmental assessment'],
    applicationUrl: 'https://agriculture.canada.ca/act',
  },
  {
    sourceId: 'black-entrepreneurship-2025',
    title: 'Black Entrepreneurship Program',
    description: 'Support for Black-led businesses in Canada. Combines $250,000 in loans with a $5,000 grant for eligible Black entrepreneurs.',
    agency: 'Government of Canada / EDC',
    level: 'federal',
    grantType: 'grant',
    minAmount: 5000,
    maxAmount: 255000,
    avgAmount: 100000,
    deadline: new Date('2026-12-31'),
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Retail', 'Services', 'Food & Beverage', 'Construction'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Business registration', 'Black ownership verification', 'Business plan'],
    applicationUrl: 'https://ised-isde.canada.ca/bep',
  },
  {
    sourceId: 'women-entrepreneurship-2025',
    title: 'Women Entrepreneurship Strategy (WES)',
    description: 'Loans and grants for women-owned businesses in Canada. Includes digital adoption grants up to $5,000 and loans up to $50,000.',
    agency: 'ISED / EDC / BDC',
    level: 'federal',
    grantType: 'grant',
    minAmount: 5000,
    maxAmount: 55000,
    avgAmount: 25000,
    deadline: new Date('2026-12-31'),
    deadlineType: 'rolling',
    eligibleSectors: ['IT', 'Retail', 'Services', 'Food & Beverage', 'Agriculture'],
    eligibleStages: ['startup', 'pre-revenue', 'revenue'],
    eligibleProvinces: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    requiredDocs: ['Business registration', 'Women ownership verification', 'Business plan'],
    applicationUrl: 'https://ised-isde.canada.ca/wes',
  },
];

async function main() {
  console.log('🌱 Seeding GrantDesk database...');

  // Clear existing data
  await prisma.savedGrant.deleteMany();
  await prisma.grant.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.auditLogEntry.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.organization.deleteMany();

  console.log('✓ Cleared existing data');

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      permissions: ['grants:read', 'grants:write', 'profile:read', 'profile:write', 'saved:read', 'saved:write', 'admin:read', 'admin:write'],
    },
  });

  const applicantRole = await prisma.role.create({
    data: {
      name: 'applicant',
      permissions: ['grants:read', 'profile:read', 'profile:write', 'saved:read', 'saved:write'],
    },
  });

  console.log('✓ Created roles');

  // Create demo organization
  const demoOrg = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
    },
  });

  console.log('✓ Created demo organization');

  // Create demo user
  // Password: demo123 (DO NOT use this in production)
  const demoPasswordHash = await hash('demo123', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@grantdesk.ca',
      name: 'Demo User',
      passwordHash: demoPasswordHash,
      organizationId: demoOrg.id,
      roles: {
        connect: [{ id: applicantRole.id }],
      },
    },
  });

  console.log('✓ Created demo user');

  // Create business profile for demo user
  await prisma.businessProfile.create({
    data: {
      userId: demoUser.id,
      companyName: 'Demo Tech Solutions Inc.',
      province: 'ON',
      sector: 'IT',
      stage: 'revenue',
      employees: 15,
      annualRevenue: '$500K-$1M',
      legalStructure: 'corporation',
      fundingPurpose: 'Digital adoption and expansion',
      website: 'https://demotech.example.com',
      description: 'IT consulting and software development company focused on digital transformation.',
    },
  });

  console.log('✓ Created demo business profile');

  // Create grants
  for (const grantData of MOCK_GRANTS) {
    await prisma.grant.create({
      data: grantData,
    });
  }

  console.log(`✓ Created ${MOCK_GRANTS.length} grants`);

  // Create some saved grants for demo user
  const allGrants = await prisma.grant.findMany({ take: 4 });
  const stages = ['saved', 'applied', 'submitted', 'saved'] as const;

  for (let i = 0; i < allGrants.length; i++) {
    await prisma.savedGrant.create({
      data: {
        userId: demoUser.id,
        grantId: allGrants[i].id,
        stage: stages[i],
        savedAt: new Date(Date.now() - (i * 2 + 1) * 24 * 60 * 60 * 1000),
        ...(stages[i] === 'applied' || stages[i] === 'submitted' ? { appliedAt: new Date() } : {}),
        ...(stages[i] === 'submitted' ? { submittedAt: new Date() } : {}),
      },
    });
  }

  console.log('✓ Created saved grants for demo user');

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Demo user: demo@grantdesk.ca');
  console.log('Demo password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
