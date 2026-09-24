'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

interface Props<K extends string> {
  labels: Record<K, string>;
  values: Record<K, boolean>;
  onSave: (values: Record<K, boolean>) => Promise<boolean>;
  saveLabel: string;
}

export default function FlagEditor<K extends string>({ labels, values, onSave, saveLabel }: Props<K>) {
  const [draft, setDraft] = useState<Record<K, boolean>>(values);
  const [saving, setSaving] = useState(false);
  const keys = Object.keys(labels) as K[];
  const dirty = keys.some((k) => draft[k] !== values[k]);
  const count = keys.filter((k) => draft[k]).length;

  async function submit() {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">{count} of {keys.length} available</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {keys.map((k) => {
          const on = draft[k];
          return (
            <button
              key={k}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => setDraft({ ...draft, [k]: !on })}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                on ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {labels[k]}
              <span className={`relative inline-block w-10 h-6 rounded-full shrink-0 ${on ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true">
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={submit}
        disabled={!dirty || saving}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saveLabel}
      </button>
    </div>
  );
}
