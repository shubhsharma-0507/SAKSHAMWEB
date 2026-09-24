import { SAMPLE_HOSPITALS } from '@/utils/sampleData';
import { Hospital } from '@/types';

/**
 * Single source of truth for demo vs real mode.
 *   NEXT_PUBLIC_DEMO_MODE=true   -> sample data, no database
 *   NEXT_PUBLIC_DEMO_MODE=false  -> real MongoDB only. Never falls back to sample data;
 *                                   if the database is missing the API returns a clear error.
 *   (unset)                      -> demo only when MONGODB_URI is empty
 */
export function isDemoMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return !process.env.MONGODB_URI;
}

// In demo mode there is no database, so dashboard edits are kept in memory
// for the lifetime of the server process. They reset when the server restarts.
const g = globalThis as unknown as { __sakshamDemoOverrides?: Record<string, Record<string, unknown>> };
const overrides: Record<string, Record<string, unknown>> = (g.__sakshamDemoOverrides ??= {});

function merge(base: Hospital, patch?: Record<string, unknown>): Hospital {
  if (!patch) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    const cur = out[k];
    out[k] =
      v && typeof v === 'object' && !Array.isArray(v) && cur && typeof cur === 'object'
        ? { ...(cur as object), ...(v as object) }
        : v;
  }
  return out as unknown as Hospital;
}

export function getDemoHospitals(): Hospital[] {
  return SAMPLE_HOSPITALS.map((h) => merge(h, overrides[h._id]));
}

export function getDemoHospital(id: string): Hospital | null {
  const base = SAMPLE_HOSPITALS.find((h) => h._id === id);
  return base ? merge(base, overrides[id]) : null;
}

export function updateDemoHospital(id: string, patch: Record<string, unknown>): Hospital | null {
  if (!SAMPLE_HOSPITALS.some((h) => h._id === id)) return null;
  const prev = overrides[id] ?? {};
  const next: Record<string, unknown> = { ...prev };
  for (const [k, v] of Object.entries(patch)) {
    next[k] =
      v && typeof v === 'object' && !Array.isArray(v)
        ? { ...((prev[k] as object) ?? {}), ...(v as object) }
        : v;
  }
  next.lastUpdated = new Date().toISOString();
  overrides[id] = next;
  return getDemoHospital(id);
}
