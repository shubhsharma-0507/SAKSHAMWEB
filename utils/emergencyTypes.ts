import { EmergencyType } from '@/types';
import {
  Heart, Car, Wind, Brain, Flame, Activity, Baby, AlertCircle, HelpCircle
} from 'lucide-react';

export const EMERGENCY_TYPES = [
  {
    id: 'cardiac' as EmergencyType,
    label: 'Cardiac Emergency',
    description: 'Heart attack, chest pain, cardiac arrest',
    icon: Heart,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    activeBg: 'bg-red-600',
  },
  {
    id: 'accident' as EmergencyType,
    label: 'Accident / Trauma',
    description: 'Road accident, fall, serious injuries',
    icon: Car,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    activeBg: 'bg-orange-600',
  },
  {
    id: 'breathing' as EmergencyType,
    label: 'Breathing Emergency',
    description: 'Difficulty breathing, asthma attack, COPD',
    icon: Wind,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBg: 'bg-blue-600',
  },
  {
    id: 'stroke' as EmergencyType,
    label: 'Stroke',
    description: 'Sudden numbness, confusion, speech difficulty',
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    activeBg: 'bg-purple-600',
  },
  {
    id: 'burn' as EmergencyType,
    label: 'Burn',
    description: 'Severe burns from fire, chemicals, electricity',
    icon: Flame,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-amber-600',
  },
  {
    id: 'critical' as EmergencyType,
    label: 'Critical Care',
    description: 'Sepsis, organ failure, unconsciousness',
    icon: Activity,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    activeBg: 'bg-rose-600',
  },
  {
    id: 'pediatric' as EmergencyType,
    label: 'Pediatric Emergency',
    description: 'Child emergency, neonatal, high fever',
    icon: Baby,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    activeBg: 'bg-pink-600',
  },
  {
    id: 'general' as EmergencyType,
    label: 'General Emergency',
    description: 'Acute pain, poisoning, allergic reaction',
    icon: AlertCircle,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    activeBg: 'bg-teal-600',
  },
  {
    id: 'other' as EmergencyType,
    label: 'Other',
    description: 'Other medical emergency situation',
    icon: HelpCircle,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    activeBg: 'bg-slate-600',
  },
];

export function formatLastUpdated(lastUpdated: string): {
  text: string;
  isStale: boolean;
} {
  const now = Date.now();
  const updated = new Date(lastUpdated).getTime();
  const diffMs = now - updated;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return { text: 'Just updated', isStale: false };
  if (diffMins < 60) return { text: `Updated ${diffMins} min ago`, isStale: false };
  if (diffHours < 4) return { text: `Updated ${diffHours}h ago`, isStale: false };
  if (diffHours < 12) return { text: `Updated ${diffHours}h ago`, isStale: true };
  return { text: `Updated ${diffHours}h ago — may be outdated`, isStale: true };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'limited': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'unavailable': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
}

export function getStatusDot(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500';
    case 'limited': return 'bg-amber-500';
    case 'unavailable': return 'bg-red-500';
    default: return 'bg-slate-400';
  }
}

export function getICUStatus(available: number, total: number): {
  label: string;
  color: string;
  dot: string;
} {
  if (total === 0) return { label: 'No ICU', color: 'text-slate-600', dot: 'bg-slate-400' };
  if (available === 0) return { label: 'ICU Full', color: 'text-red-700', dot: 'bg-red-500' };
  if (available <= 3) return { label: `ICU: ${available} beds`, color: 'text-amber-700', dot: 'bg-amber-500' };
  return { label: `ICU: ${available} beds`, color: 'text-emerald-700', dot: 'bg-emerald-500' };
}
