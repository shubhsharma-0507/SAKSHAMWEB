'use client';

import { useHospital } from '@/components/dashboard/useHospital';
import { DemoNotice, LoadState, PageHeader, Panel } from '@/components/dashboard/PageShell';
import EmergencyStatusPicker from '@/components/dashboard/EmergencyStatusPicker';

function Switch({ label, help, checked, onChange }: { label: string; help: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 text-left rounded-xl border border-slate-200 px-4 py-3.5 hover:border-slate-300"
    >
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="block text-xs text-slate-500 mt-0.5">{help}</span>
      </span>
      <span className={`relative inline-block w-11 h-6 rounded-full shrink-0 ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true">
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

export default function EmergencyPage() {
  const { hospital, loading, error, isDemo, save } = useHospital();
  if (loading || error || !hospital) return <LoadState loading={loading} error={error} />;

  return (
    <>
      <PageHeader title="Emergency status" description="What patients see first when they search. Changes apply immediately." />
      <DemoNotice show={isDemo} />
      <div className="space-y-6">
        <Panel title="Emergency department">
          <EmergencyStatusPicker value={hospital.emergencyStatus} onChange={(s) => save('update', { emergencyStatus: s }, 'Emergency status updated')} />
        </Panel>
        <Panel title="Services">
          <div className="space-y-3">
            <Switch
              label="Ambulance available"
              help="An ambulance is ready to dispatch or bring patients in."
              checked={hospital.ambulance}
              onChange={(v) => save('update', { ambulance: v }, v ? 'Ambulance marked available' : 'Ambulance marked unavailable')}
            />
            <Switch
              label="Open 24×7"
              help="Emergency services run around the clock."
              checked={hospital.is24x7}
              onChange={(v) => save('update', { is24x7: v }, 'Hours updated')}
            />
          </div>
        </Panel>
      </div>
    </>
  );
}
