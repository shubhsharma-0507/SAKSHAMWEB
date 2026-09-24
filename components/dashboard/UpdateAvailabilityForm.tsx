'use client';

import { useState } from 'react';
import { Minus, Plus, Loader2, Save } from 'lucide-react';
import { Hospital } from '@/types';

interface Props {
  hospital: Hospital;
  onSave: (patch: { beds: { total: number; available: number }; icu: { total: number; available: number } }) => Promise<boolean>;
  /** quick: only "available" counts. full: totals too. */
  mode?: 'quick' | 'full';
}

function Stepper({ label, value, onChange, max, id }: { label: string; value: number; onChange: (n: number) => void; max?: number; id: string }) {
  const set = (n: number) => onChange(Math.max(0, Math.min(max ?? 100000, Number.isFinite(n) ? Math.round(n) : 0)));
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="flex items-stretch rounded-xl border border-slate-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 w-full max-w-[220px]">
        <button type="button" onClick={() => set(value - 1)} className="px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700" aria-label={`Decrease ${label}`}>
          <Minus className="w-4 h-4" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          onChange={(e) => set(e.target.valueAsNumber)}
          className="w-full text-center text-lg font-semibold text-slate-900 py-2.5 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => set(value + 1)} className="px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700" aria-label={`Increase ${label}`}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function UpdateAvailabilityForm({ hospital, onSave, mode = 'full' }: Props) {
  const [beds, setBeds] = useState(hospital.beds);
  const [icu, setIcu] = useState(hospital.icu);
  const [saving, setSaving] = useState(false);

  const dirty =
    beds.total !== hospital.beds.total || beds.available !== hospital.beds.available ||
    icu.total !== hospital.icu.total || icu.available !== hospital.icu.available;
  const problem =
    beds.available > beds.total ? 'Available beds cannot be more than total beds.' :
    icu.available > icu.total ? 'Available ICU beds cannot be more than total ICU beds.' : null;

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (problem || !dirty) return;
    setSaving(true);
    await onSave({ beds, icu });
    setSaving(false);
  }

  const full = mode === 'full';

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-slate-900 mb-3">General beds</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Stepper id="beds-available" label="Available now" value={beds.available} max={full ? undefined : beds.total} onChange={(n) => setBeds({ ...beds, available: n })} />
          {full ? (
            <Stepper id="beds-total" label="Total capacity" value={beds.total} onChange={(n) => setBeds({ ...beds, total: n })} />
          ) : (
            <p className="text-sm text-slate-500 self-end pb-3">of {beds.total} total</p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-slate-900 mb-3">ICU beds</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Stepper id="icu-available" label="Available now" value={icu.available} max={full ? undefined : icu.total} onChange={(n) => setIcu({ ...icu, available: n })} />
          {full ? (
            <Stepper id="icu-total" label="Total capacity" value={icu.total} onChange={(n) => setIcu({ ...icu, total: n })} />
          ) : (
            <p className="text-sm text-slate-500 self-end pb-3">of {icu.total} total</p>
          )}
        </div>
      </fieldset>

      {problem && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{problem}</p>}

      <button
        type="submit"
        disabled={!dirty || !!problem || saving}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save bed counts
      </button>
    </form>
  );
}
