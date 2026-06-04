import { z } from 'zod';

// ---------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const nonEmptyStringSchema = z.string().min(1);

// ---------------------------------------------------------------------------
// Grants
// ---------------------------------------------------------------------------
export const grantsQuerySchema = z.object({
  q: z.string().optional(),
  sector: z.string().optional(),
  province: z.string().optional(),
  level: z.enum(['federal', 'provincial', 'municipal', 'private']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const grantIdSchema = z.object({
  id: z.string().uuid(),
});

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export const upsertProfileSchema = z.object({
  companyName: z.string().min(1).max(200),
  province: z.enum(['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL']),
  sector: z.string().min(1).max(100),
  stage: z.enum(['startup', 'pre-revenue', 'revenue', 'established']),
  employees: z.string().optional(),
  annualRevenue: z.enum(['<$100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M+']).optional(),
  legalStructure: z.string().optional(),
  fundingPurpose: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(2000).optional(),
});

// ---------------------------------------------------------------------------
// Saved Grants
// ---------------------------------------------------------------------------
export const saveGrantSchema = z.object({
  grantId: z.string().uuid(),
});

export const updateSavedStageSchema = z.object({
  grantId: z.string().uuid(),
  stage: z.enum(['saved', 'applied', 'submitted', 'awarded', 'rejected', 'withdrawn']),
  notes: z.string().max(1000).optional(),
});

export const savedQuerySchema = z.object({
  stage: z.enum(['saved', 'applied', 'submitted', 'awarded', 'rejected', 'withdrawn']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
});
