import { EmergencyStatus, HospitalType } from '@/types';

export const EQUIPMENT_KEYS = [
  'ventilator', 'ctScan', 'mri', 'xray', 'ecg', 'defibrillator', 'dialysis', 'oxygen', 'bloodBank', 'operationTheater',
] as const;

export const SPECIALIST_KEYS = [
  'cardiologist', 'neurologist', 'orthopedic', 'pulmonologist', 'pediatrician', 'traumaSurgeon',
  'generalSurgeon', 'anesthesiologist', 'radiologist', 'intensivist', 'burnSpecialist', 'ophthalmologist',
] as const;

const STATUSES: EmergencyStatus[] = ['active', 'limited', 'unavailable'];
const TYPES: HospitalType[] = ['government', 'private', 'trust', 'multispecialty', 'specialty'];

type Result = { ok: true; patch: Record<string, unknown> } | { ok: false; error: string };
type Body = Record<string, unknown>;

const isObj = (v: unknown): v is Body => !!v && typeof v === 'object' && !Array.isArray(v);

function capacity(v: unknown, label: string): { total: number; available: number } | string {
  if (!isObj(v)) return `${label} must include total and available`;
  const { total, available } = v;
  if (!Number.isInteger(total) || !Number.isInteger(available)) return `${label} counts must be whole numbers`;
  const t = total as number;
  const a = available as number;
  if (t < 0 || a < 0 || t > 100000) return `${label} counts must be zero or more`;
  if (a > t) return `${label}: available beds cannot exceed total beds`;
  return { total: t, available: a };
}

function flags(v: unknown, keys: readonly string[]): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  if (!isObj(v)) return out;
  for (const k of keys) if (typeof v[k] === 'boolean') out[k] = v[k] as boolean;
  return out;
}

/** Fields a hospital admin can change from the live-availability screens. */
export function sanitizeAvailability(body: unknown): Result {
  if (!isObj(body)) return { ok: false, error: 'Invalid request body' };
  const patch: Record<string, unknown> = {};

  for (const key of ['beds', 'icu'] as const) {
    if (body[key] !== undefined) {
      const c = capacity(body[key], key === 'icu' ? 'ICU' : 'Beds');
      if (typeof c === 'string') return { ok: false, error: c };
      patch[key] = c;
    }
  }
  if (body.equipment !== undefined) patch.equipment = flags(body.equipment, EQUIPMENT_KEYS);
  if (body.specialists !== undefined) patch.specialists = flags(body.specialists, SPECIALIST_KEYS);
  if (typeof body.ambulance === 'boolean') patch.ambulance = body.ambulance;
  if (typeof body.is24x7 === 'boolean') patch.is24x7 = body.is24x7;
  if (body.emergencyStatus !== undefined) {
    if (!STATUSES.includes(body.emergencyStatus as EmergencyStatus)) return { ok: false, error: 'Invalid emergency status' };
    patch.emergencyStatus = body.emergencyStatus;
  }
  if (Object.keys(patch).length === 0) return { ok: false, error: 'Nothing to update' };
  return { ok: true, patch };
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined);

/** Fields a hospital admin can change from the profile screen. */
export function sanitizeProfile(body: unknown): Result {
  if (!isObj(body)) return { ok: false, error: 'Invalid request body' };
  const patch: Record<string, unknown> = {};
  const fields: [string, number][] = [
    ['name', 150], ['description', 1500], ['address', 250], ['city', 80], ['state', 80], ['pincode', 12],
    ['phone', 30], ['emergencyPhone', 30], ['email', 120], ['website', 200], ['accreditation', 80],
  ];
  for (const [f, max] of fields) {
    const v = str(body[f], max);
    if (v !== undefined) patch[f] = v;
  }
  for (const req of ['name', 'address', 'city', 'state', 'phone', 'emergencyPhone']) {
    if (req in patch && !patch[req]) return { ok: false, error: `${req} cannot be empty` };
  }
  if (patch.email && !/^\S+@\S+\.\S+$/.test(patch.email as string)) return { ok: false, error: 'Enter a valid email address' };

  if (body.hospitalType !== undefined) {
    if (!TYPES.includes(body.hospitalType as HospitalType)) return { ok: false, error: 'Invalid hospital type' };
    patch.hospitalType = body.hospitalType;
  }
  if (body.latitude !== undefined || body.longitude !== undefined) {
    const lat = Number(body.latitude);
    const lon = Number(body.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return { ok: false, error: 'Enter a valid latitude and longitude' };
    }
    patch.latitude = lat;
    patch.longitude = lon;
  }
  if (body.establishedYear !== undefined && body.establishedYear !== '' && body.establishedYear !== null) {
    const y = Number(body.establishedYear);
    if (!Number.isInteger(y) || y < 1800 || y > new Date().getFullYear()) return { ok: false, error: 'Enter a valid established year' };
    patch.establishedYear = y;
  }
  if (Object.keys(patch).length === 0) return { ok: false, error: 'Nothing to update' };
  return { ok: true, patch };
}
