'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useHospital } from '@/components/dashboard/useHospital';
import { DemoNotice, LoadState, PageHeader, Panel } from '@/components/dashboard/PageShell';
import HospitalFields, { HospitalFormValues } from '@/components/dashboard/HospitalFields';
import { Hospital } from '@/types';

function toForm(h: Hospital): HospitalFormValues {
  return {
    name: h.name, hospitalType: h.hospitalType, address: h.address, city: h.city, state: h.state, pincode: h.pincode || '',
    phone: h.phone, emergencyPhone: h.emergencyPhone, email: h.email || '', website: h.website || '',
    description: h.description || '', accreditation: h.accreditation || '', establishedYear: h.establishedYear ? String(h.establishedYear) : '',
    latitude: String(h.latitude), longitude: String(h.longitude),
  };
}

function ProfileForm({ hospital, onSave }: { hospital: Hospital; onSave: (patch: Record<string, unknown>) => Promise<boolean> }) {
  const [form, setForm] = useState<HospitalFormValues>(() => toForm(hospital));
  const [saving, setSaving] = useState(false);

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form });
    setSaving(false);
  }

  return (
    <form onSubmit={submit}>
      <HospitalFields values={form} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} idPrefix="profile" />
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save profile
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { hospital, loading, error, isDemo, save } = useHospital();
  if (loading || error || !hospital) return <LoadState loading={loading} error={error} />;

  return (
    <>
      <PageHeader title="Hospital profile" description="The details patients see on your public page." />
      <DemoNotice show={isDemo} />
      <Panel>
        <ProfileForm key={hospital.lastUpdated} hospital={hospital} onSave={(p) => save('profile', p, 'Profile saved')} />
      </Panel>
    </>
  );
}
