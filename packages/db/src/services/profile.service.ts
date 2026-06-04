import { prisma } from '../prisma';
import type { Prisma } from '@prisma/client';

export interface CreateProfileData {
  userId: string;
  companyName: string;
  province: string;
  sector: string;
  stage: string;
  employees?: number | string;
  annualRevenue?: string;
  legalStructure?: string;
  fundingPurpose?: string;
  website?: string;
  description?: string;
}

export interface UpdateProfileData extends Partial<Omit<CreateProfileData, 'userId'>> {}

function normalizeEmployees(employees: number | string | undefined): number | undefined {
  if (employees === undefined || employees === '') return undefined;
  if (typeof employees === 'number') return employees;
  const match = String(employees).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

export async function getProfileByUserId(userId: string) {
  return prisma.businessProfile.findFirst({
    where: { userId },
    include: { user: { select: { email: true, name: true } } },
  });
}

export async function createProfile(data: CreateProfileData) {
  return prisma.businessProfile.create({
    data: {
      ...data,
      employees: normalizeEmployees(data.employees),
    },
  });
}

export async function updateProfile(userId: string, data: UpdateProfileData) {
  const profile = await getProfileByUserId(userId);
  if (!profile) throw new Error('Profile not found');

  return prisma.businessProfile.update({
    where: { id: profile.id },
    data: {
      ...data,
      employees: data.employees !== undefined
        ? normalizeEmployees(data.employees)
        : undefined,
    },
  });
}

export async function upsertProfile(userId: string, data: CreateProfileData) {
  const normalizedData = {
    ...data,
    employees: normalizeEmployees(data.employees),
  };
  const existing = await getProfileByUserId(userId);
  if (existing) {
    return prisma.businessProfile.update({
      where: { id: existing.id },
      data: normalizedData,
    });
  }
  return prisma.businessProfile.create({
    data: { ...normalizedData, userId },
  });
}
