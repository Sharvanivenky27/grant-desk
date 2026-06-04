'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Grant {
  id: string;
  sourceId: string | null;
  title: string;
  description: string;
  agency: string;
  level: string;
  grantType: string;
  minAmount: number | null;
  maxAmount: number | null;
  avgAmount: number | null;
  deadline: string | null;
  deadlineType: string;
  eligibleSectors: string[];
  eligibleStages: string[];
  eligibleProvinces: string[];
  requiredDocs: string[];
  applicationUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GrantsResponse {
  data: Grant[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface GrantFilters {
  q?: string;
  sector?: string;
  province?: string;
  level?: string;
  page?: number;
  pageSize?: number;
}

export function useGrants(filters: GrantFilters = {}) {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });

  const fetchGrants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.sector) params.set('sector', filters.sector);
      if (filters.province) params.set('province', filters.province);
      if (filters.level) params.set('level', filters.level);
      if (filters.page) params.set('page', String(filters.page));
      if (filters.pageSize) params.set('pageSize', String(filters.pageSize));

      const res = await fetch(`/api/grants?${params}`);
      if (!res.ok) throw new Error('Failed to fetch grants');
      const json: GrantsResponse = await res.json();
      setGrants(json.data ?? []);
      setMeta(json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filters.q, filters.sector, filters.province, filters.level, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  return { grants, loading, error, meta, refetch: fetchGrants };
}
