'use client';

import { useHospital } from '@/components/dashboard/useHospital';
import { DemoNotice, LoadState, PageHeader, Panel } from '@/components/dashboard/PageShell';
import FlagEditor from '@/components/dashboard/FlagEditor';
import { SPECIALIST_LABELS } from '@/utils/helpers';

export default function SpecialistsPage() {
  const { hospital, loading, error, isDemo, save } = useHospital();
  if (loading || error || !hospital) return <LoadState loading={loading} error={error} />;

  return (
    <>
      <PageHeader title="Specialists" description="Turn on the specialists who are on duty or reachable for emergencies right now." />
      <DemoNotice show={isDemo} />
      <Panel>
        <FlagEditor
          key={hospital.lastUpdated}
          labels={SPECIALIST_LABELS}
          values={{ ...hospital.specialists }}
          saveLabel="Save specialists"
          onSave={(specialists) => save('update', { specialists }, 'Specialists saved')}
        />
      </Panel>
    </>
  );
}
