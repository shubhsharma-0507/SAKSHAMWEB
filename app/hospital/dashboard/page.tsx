'use client';

import Link from 'next/link';
import { Bed, Activity, Siren, Zap, Clock, CheckCircle, Circle, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { useHospital } from '@/components/dashboard/useHospital';
import { DemoNotice, LoadState, PageHeader, Panel } from '@/components/dashboard/PageShell';
import DashboardCard from '@/components/dashboard/DashboardCard';
import UpdateAvailabilityForm from '@/components/dashboard/UpdateAvailabilityForm';
import EmergencyStatusPicker from '@/components/dashboard/EmergencyStatusPicker';
import HospitalStatus from '@/components/hospitals/HospitalStatus';
import { formatLastUpdated } from '@/utils/emergencyTypes';
import { EQUIPMENT_LABELS, SPECIALIST_LABELS } from '@/utils/helpers';

export default function DashboardOverview() {
  const { hospital, loading, error, isDemo, save } = useHospital();
  if (loading || error || !hospital) return <LoadState loading={loading} error={error} />;

  const { text: updatedText, isStale } = formatLastUpdated(hospital.lastUpdated);
  const equipmentOn = Object.values(hospital.equipment).filter(Boolean).length;
  const specialistsOn = Object.values(hospital.specialists).filter(Boolean).length;
  const icuTone = hospital.icu.total === 0 ? 'neutral' : hospital.icu.available === 0 ? 'bad' : hospital.icu.available <= 3 ? 'warn' : 'good';
  const bedTone = hospital.beds.available === 0 ? 'bad' : hospital.beds.available <= 5 ? 'warn' : 'good';

  const checklist = [
    { done: hospital.description.trim().length >= 40, label: 'Add a short description of the hospital', href: '/hospital/dashboard/profile' },
    { done: !!hospital.website || !!hospital.email, label: 'Add a public email or website', href: '/hospital/dashboard/profile' },
    { done: equipmentOn > 0, label: 'Mark the equipment you have', href: '/hospital/dashboard/equipment' },
    { done: specialistsOn > 0, label: 'Mark the specialists on call', href: '/hospital/dashboard/specialists' },
    { done: hospital.beds.total > 0, label: 'Set your total bed capacity', href: '/hospital/dashboard/beds' },
  ];
  const remaining = checklist.filter((c) => !c.done);

  return (
    <>
      <PageHeader
        title={hospital.name}
        description={`${hospital.city}, ${hospital.state}`}
        action={
          <Link href={`/hospitals/${hospital._id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ExternalLink className="w-4 h-4" aria-hidden="true" /> View public page
          </Link>
        }
      />
      <DemoNotice show={isDemo} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <HospitalStatus status={hospital.emergencyStatus} />
        <span className={`inline-flex items-center gap-1.5 text-sm ${isStale ? 'text-amber-700' : 'text-slate-500'}`}>
          <Clock className="w-4 h-4" aria-hidden="true" /> {updatedText}
        </span>
      </div>

      {isStale && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-2.5 flex-1 text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <p>Patients can see that your numbers have not been updated for a while. If they are still right, confirm them.</p>
          </div>
          <button
            onClick={() => save('update', { beds: hospital.beds, icu: hospital.icu }, 'Numbers confirmed')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Numbers are current
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Beds available" value={`${hospital.beds.available}/${hospital.beds.total}`} icon={<Bed className="w-5 h-5" />} tone={bedTone} />
        <DashboardCard title="ICU available" value={`${hospital.icu.available}/${hospital.icu.total}`} icon={<Activity className="w-5 h-5" />} tone={icuTone} />
        <DashboardCard title="Ambulance" value={hospital.ambulance ? 'Yes' : 'No'} icon={<Siren className="w-5 h-5" />} tone={hospital.ambulance ? 'good' : 'neutral'} />
        <DashboardCard title="Equipment" value={`${equipmentOn}/${Object.keys(EQUIPMENT_LABELS).length}`} hint={`${specialistsOn}/${Object.keys(SPECIALIST_LABELS).length} specialists`} icon={<Zap className="w-5 h-5" />} tone="brand" />
      </div>

      <div className="space-y-6">
        <Panel title="Emergency status" description="Change this the moment your capacity changes. Patients see it first.">
          <EmergencyStatusPicker value={hospital.emergencyStatus} onChange={(s) => save('update', { emergencyStatus: s }, 'Emergency status updated')} />
        </Panel>

        <Panel title="Update bed counts" description="Keep these current. Matching depends on them.">
          <UpdateAvailabilityForm key={hospital.lastUpdated} hospital={hospital} mode="quick" onSave={(p) => save('update', p, 'Bed counts updated')} />
        </Panel>

        {remaining.length > 0 && (
          <Panel title="Finish your listing" description={`${checklist.length - remaining.length} of ${checklist.length} done`}>
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className={`flex items-center gap-2.5 text-sm rounded-lg px-2 py-1.5 -mx-2 hover:bg-slate-50 ${c.done ? 'text-slate-400' : 'text-slate-800 font-medium'}`}>
                    {c.done ? <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" /> : <Circle className="w-4 h-4 text-slate-300" aria-hidden="true" />}
                    <span className={c.done ? 'line-through' : ''}>{c.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </>
  );
}
