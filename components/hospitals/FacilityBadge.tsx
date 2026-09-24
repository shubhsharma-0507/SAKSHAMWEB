import { CheckCircle, X } from 'lucide-react';

export default function FacilityBadge({ label, available }: { label: string; available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
        available ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
      }`}
    >
      {available ? <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> : <X className="w-3.5 h-3.5" aria-hidden="true" />}
      <span className="sr-only">{available ? 'Available:' : 'Not available:'}</span>
      {label}
    </span>
  );
}
