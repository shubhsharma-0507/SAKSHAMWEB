'use client';

import { useState } from 'react';
import { EmergencyStatus } from '@/types';
import { EMERGENCY_STATUS_META } from '@/utils/helpers';
import Modal from '@/components/ui/Modal';

const ORDER: EmergencyStatus[] = ['active', 'limited', 'unavailable'];

export default function EmergencyStatusPicker({ value, onChange }: { value: EmergencyStatus; onChange: (s: EmergencyStatus) => Promise<boolean> }) {
  const [pending, setPending] = useState<EmergencyStatus | null>(null);
  const [busy, setBusy] = useState(false);

  async function apply(s: EmergencyStatus) {
    setBusy(true);
    await onChange(s);
    setBusy(false);
    setPending(null);
  }

  function choose(s: EmergencyStatus) {
    if (s === value || busy) return;
    if (s === 'unavailable') setPending(s);
    else apply(s);
  }

  return (
    <>
      <div role="radiogroup" aria-label="Emergency status" className="grid sm:grid-cols-3 gap-3">
        {ORDER.map((s) => {
          const m = EMERGENCY_STATUS_META[s];
          const selected = s === value;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={busy}
              onClick={() => choose(s)}
              className={`text-left rounded-xl border-2 p-4 disabled:opacity-60 ${
                selected ? `${m.bg} ${m.border}` : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`flex items-center gap-2 font-semibold text-sm ${selected ? m.text : 'text-slate-800'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} aria-hidden="true" />
                {m.label}
              </span>
              <span className="block mt-1.5 text-xs text-slate-500 leading-relaxed">{m.help}</span>
            </button>
          );
        })}
      </div>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Stop accepting emergency patients?"
        footer={
          <>
            <button onClick={() => setPending(null)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Keep current status</button>
            <button
              onClick={() => pending && apply(pending)}
              disabled={busy}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            >
              Mark as not accepting
            </button>
          </>
        }
      >
        Patients searching on SAKSHAM will see your hospital as not accepting emergencies and it will rank lower in results. You can switch back at any time.
      </Modal>
    </>
  );
}
