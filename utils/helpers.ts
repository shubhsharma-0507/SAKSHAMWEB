import { EmergencyStatus, Equipment, Specialists } from '@/types';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export const EQUIPMENT_LABELS: Record<keyof Equipment, string> = {
  ventilator: 'Ventilator',
  ctScan: 'CT Scan',
  mri: 'MRI',
  xray: 'X-Ray',
  ecg: 'ECG',
  defibrillator: 'Defibrillator',
  dialysis: 'Dialysis',
  oxygen: 'Oxygen supply',
  bloodBank: 'Blood bank',
  operationTheater: 'Operation theater',
};

export const SPECIALIST_LABELS: Record<keyof Specialists, string> = {
  cardiologist: 'Cardiologist',
  neurologist: 'Neurologist',
  orthopedic: 'Orthopedic specialist',
  pulmonologist: 'Pulmonologist',
  pediatrician: 'Pediatrician',
  traumaSurgeon: 'Trauma surgeon',
  generalSurgeon: 'General surgeon',
  anesthesiologist: 'Anesthesiologist',
  radiologist: 'Radiologist',
  intensivist: 'ICU intensivist',
  burnSpecialist: 'Burn specialist',
  ophthalmologist: 'Ophthalmologist',
};

export const EMERGENCY_STATUS_META: Record<EmergencyStatus, { label: string; help: string; dot: string; text: string; bg: string; border: string }> = {
  active: {
    label: 'Emergency active',
    help: 'Accepting emergency patients normally.',
    dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
  },
  limited: {
    label: 'Limited capacity',
    help: 'Accepting patients, but resources are stretched. Patients may be redirected.',
    dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200',
  },
  unavailable: {
    label: 'Not accepting',
    help: 'Not accepting new emergency patients. Ranked lower in search results.',
    dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200',
  },
};

export const HOSPITAL_TYPE_OPTIONS = [
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private' },
  { value: 'trust', label: 'Trust / charitable' },
  { value: 'multispecialty', label: 'Multi-specialty' },
  { value: 'specialty', label: 'Specialty' },
] as const;
