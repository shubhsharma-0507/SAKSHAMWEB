'use client';

import { useHospital } from '@/components/dashboard/useHospital';
import { DemoNotice, LoadState, PageHeader, Panel } from '@/components/dashboard/PageShell';
import FlagEditor from '@/components/dashboard/FlagEditor';
import { EQUIPMENT_LABELS } from '@/utils/helpers';

export default function EquipmentPage() {
  const { hospital, loading, error, isDemo, save } = useHospital();
  if (loading || error || !hospital) return <LoadState loading={loading} error={error} />;

  return (
    <>
      <PageHeader title="Equipment" description="Turn on only what is working and ready to use right now. A ventilator that is under repair should be off." />
      <DemoNotice show={isDemo} />
      <Panel>
        <FlagEditor
          key={hospital.lastUpdated}
          labels={EQUIPMENT_LABELS}
          values={{ ...hospital.equipment }}
          saveLabel="Save equipment"
          onSave={(equipment) => save('update', { equipment }, 'Equipment saved')}
        />
      </Panel>
    </>
  );
}
