import { prisma } from '../prisma';
import type { Prisma } from '@prisma/client';

export interface GrantFilters {
  province?: string;
  sector?: string;
  level?: string;
  search?: string;
  isActive?: boolean;
}

export interface GrantListOptions extends GrantFilters {
  page?: number;
  pageSize?: number;
  sortBy?: 'deadline' | 'maxAmount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function listGrants(options: GrantListOptions = {}): Promise<PaginatedResult<any>> {
  const {
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const where: Prisma.GrantWhereInput = {
    isActive: options.isActive ?? true,
  };

  if (options.province) {
    where.eligibleProvinces = { has: options.province };
  }

  if (options.sector) {
    where.eligibleSectors = { has: options.sector };
  }

  if (options.level) {
    where.level = options.level;
  }

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    where.OR = [
      { title: { contains: searchLower, mode: 'insensitive' } },
      { description: { contains: searchLower, mode: 'insensitive' } },
      { agency: { contains: searchLower, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.grant.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.grant.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getGrantById(id: string) {
  return prisma.grant.findUnique({ where: { id } });
}

export async function getMatchingGrants(
  businessProfileId: string,
  options?: { page?: number; pageSize?: number }
) {
  const profile = await prisma.businessProfile.findUniqueOrThrow({
    where: { id: businessProfileId },
  });

  return listGrants({
    province: profile.province,
    sector: profile.sector,
    isActive: true,
    page: options?.page,
    pageSize: options?.pageSize,
  });
}
