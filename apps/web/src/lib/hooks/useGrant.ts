'use client';

import { useState, useEffect } from 'react';
import type { Grant } from './useGrants';

export function useGrant(id: string) {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchGrant = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/grants/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Grant not found');
          } else {
            throw new Error('Failed to fetch grant');
          }
          return;
        }
        const json = await res.json();
        setGrant(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGrant();
  }, [id]);

  return { grant, loading, error };
}
