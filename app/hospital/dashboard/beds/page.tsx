'use client';

import { useHospital } from '@/components/dashboard/useHospital';
import { DemoNotice, LoadState, PageHeader, Panel } from '@/components/dashboard/PageShell';
import UpdateAvailabilityForm from '@/components/dashboard/UpdateAvailabilityForm';

export default function BedsPage() {
  const { hospital, loading, error, isDemo, save } = useHospital();
  if (loading || error || !hospital) return <LoadState loading={loading} error={error} />;

  return (
    <>
      <PageHeader title="Beds & ICU" description="Set total capacity once, then update the available counts as patients come and go." />
      <DemoNotice show={isDemo} />
      <Panel>
        <UpdateAvailabilityForm key={hospital.lastUpdated} hospital={hospital} mode="full" onSave={(p) => save('update', p, 'Bed counts saved')} />
      </Panel>
    </>
  );
}
