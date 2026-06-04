'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Grant } from './useGrants';

export type PipelineStage = 'saved' | 'applied' | 'submitted' | 'awarded' | 'rejected' | 'withdrawn';

export interface SavedGrant {
  id: string;
  userId: string;
  grantId: string;
  grant: Grant;
  stage: PipelineStage;
  notes: string | null;
  savedAt: string;
  appliedAt: string | null;
  submittedAt: string | null;
  outcomeAt: string | null;
}

export interface SavedGrantsResponse {
  data: SavedGrant[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function useSavedGrants(stageFilter?: PipelineStage) {
  const [savedGrants, setSavedGrants] = useState<SavedGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });

  const fetchSavedGrants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (stageFilter) params.set('stage', stageFilter);

      const res = await fetch(`/api/saved?${params}`);
      if (!res.ok) throw new Error('Failed to fetch saved grants');
      const json: SavedGrantsResponse = await res.json();
      setSavedGrants(json.data);
      setMeta(json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stageFilter]);

  useEffect(() => {
    fetchSavedGrants();
  }, [fetchSavedGrants]);

  const saveGrant = useCallback(async (grantId: string) => {
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantId }),
      });
      if (res.status === 409) throw new Error('Grant already saved');
      if (!res.ok) throw new Error('Failed to save grant');
      await fetchSavedGrants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchSavedGrants]);

  const removeGrant = useCallback(async (grantId: string) => {
    try {
      const res = await fetch(`/api/saved?grantId=${grantId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove grant');
      await fetchSavedGrants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchSavedGrants]);

  const updateStage = useCallback(async (grantId: string, stage: PipelineStage, notes?: string) => {
    try {
      const res = await fetch('/api/saved', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantId, stage, notes }),
      });
      if (!res.ok) throw new Error('Failed to update stage');
      await fetchSavedGrants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchSavedGrants]);

  return {
    savedGrants,
    loading,
    error,
    meta,
    saveGrant,
    removeGrant,
    updateStage,
    refetch: fetchSavedGrants,
  };
}
