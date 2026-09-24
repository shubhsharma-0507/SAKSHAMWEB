import { ReactNode } from 'react';

const TONES = {
  neutral: 'bg-slate-100 text-slate-600',
  good: 'bg-emerald-50 text-emerald-700',
  warn: 'bg-amber-50 text-amber-700',
  bad: 'bg-red-50 text-red-700',
  brand: 'bg-blue-50 text-blue-700',
};

interface Props {
  title: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  tone?: keyof typeof TONES;
}

export default function DashboardCard({ title, value, hint, icon, tone = 'neutral' }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <div className="mt-1 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{value}</div>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TONES[tone]}`} aria-hidden="true">{icon}</div>
      </div>
    </div>
  );
}
