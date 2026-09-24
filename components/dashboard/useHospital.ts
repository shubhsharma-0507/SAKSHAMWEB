'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital } from '@/types';
import { useToast } from '@/components/ui/Toast';

/**
 * Loads the signed-in admin's hospital and exposes save().
 * `endpoint` picks the API: 'profile' for details, 'update' for live availability.
 */
export function useHospital() {
  const router = useRouter();
  const toast = useToast();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hospital/profile')
      .then(async (r) => {
        if (r.status === 401) { router.replace('/hospital/login'); return null; }
        return r.json();
      })
      .then((json) => {
        if (cancelled || !json) return;
        if (json.success) { setHospital(json.data); setIsDemo(!!json.isDemo); }
        else setError(json.error || 'Could not load your hospital');
      })
      .catch(() => !cancelled && setError('Could not reach the server. Check your connection and reload.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [router]);

  const save = useCallback(
    async (endpoint: 'profile' | 'update', patch: Record<string, unknown>, successMessage = 'Changes saved'): Promise<boolean> => {
      try {
        const res = await fetch(`/api/hospital/${endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (res.status === 401) { router.replace('/hospital/login'); return false; }
        const json = await res.json();
        if (!json.success) { toast.error(json.error || 'Could not save changes'); return false; }
        setHospital(json.data);
        toast.success(successMessage);
        return true;
      } catch {
        toast.error('Could not reach the server. Your changes were not saved.');
        return false;
      }
    },
    [router, toast]
  );

  return { hospital, loading, error, isDemo, save };
}
