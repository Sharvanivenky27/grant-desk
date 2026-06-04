import { prisma } from '../prisma';
import type { Prisma } from '@prisma/client';

export type PipelineStage = 'saved' | 'applied' | 'submitted' | 'awarded' | 'rejected' | 'withdrawn';

export interface SaveGrantData {
  userId: string;
  grantId: string;
  notes?: string;
}

export interface UpdateStageData {
  stage: PipelineStage;
}

const STAGE_TIMESTAMPS: Record<PipelineStage, string | null> = {
  saved: null,
  applied: 'appliedAt',
  submitted: 'submittedAt',
  awarded: 'outcomeAt',
  rejected: 'outcomeAt',
  withdrawn: 'outcomeAt',
};

export async function saveGrant(data: SaveGrantData) {
  return prisma.savedGrant.create({
    data: {
      userId: data.userId,
      grantId: data.grantId,
      notes: data.notes,
    },
    include: { grant: true },
  });
}

export async function unsaveGrant(userId: string, grantId: string) {
  return prisma.savedGrant.delete({
    where: { userId_grantId: { userId, grantId } },
  });
}

export async function getSavedGrants(
  userId: string,
  options?: { stage?: PipelineStage; page?: number; pageSize?: number }
) {
  const { stage, page = 1, pageSize = 20 } = options ?? {};

  const where: Prisma.SavedGrantWhereInput = { userId };
  if (stage) where.stage = stage;

  return prisma.savedGrant.findMany({
    where,
    include: { grant: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { savedAt: 'desc' },
  });
}

export async function getSavedGrant(userId: string, grantId: string) {
  return prisma.savedGrant.findUnique({
    where: { userId_grantId: { userId, grantId } },
    include: { grant: true },
  });
}

export async function isGrantSaved(userId: string, grantId: string): Promise<boolean> {
  const result = await prisma.savedGrant.findUnique({
    where: { userId_grantId: { userId, grantId } },
    select: { id: true },
  });
  return result !== null;
}

export async function updateGrantStage(
  userId: string,
  grantId: string,
  data: UpdateStageData
) {
  const existing = await prisma.savedGrant.findUnique({
    where: { userId_grantId: { userId, grantId } },
  });
  if (!existing) throw new Error('Saved grant not found');

  const timestampField = STAGE_TIMESTAMPS[data.stage];
  const updateData: Prisma.SavedGrantUpdateInput = {
    stage: data.stage,
  };

  if (timestampField) {
    (updateData as any)[timestampField] = new Date();
  }

  return prisma.savedGrant.update({
    where: { id: existing.id },
    data: updateData,
    include: { grant: true },
  });
}
