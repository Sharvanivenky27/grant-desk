'use client';

import { useState, useEffect, useCallback } from 'react';

export interface BusinessProfile {
  id: string;
  userId: string;
  companyName: string;
  province: string;
  sector: string;
  stage: string;
  employees: number | null;
  annualRevenue: string | null;
  legalStructure: string | null;
  fundingPurpose: string | null;
  website: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertProfileData {
  companyName: string;
  province: string;
  sector: string;
  stage: string;
  employees?: string;
  annualRevenue?: string;
  legalStructure?: string;
  fundingPurpose?: string;
  website?: string;
  description?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/profile');
      if (res.status === 404) {
        setProfile(null);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch profile');
      const json = await res.json();
      setProfile(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data: UpsertProfileData) => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      const json = await res.json();
      setProfile(json.data);
      return json.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, error, saving, updateProfile, refetch: fetchProfile };
}
