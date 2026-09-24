import { EmergencyStatus } from '@/types';
import { EMERGENCY_STATUS_META } from '@/utils/helpers';

export default function HospitalStatus({ status, size = 'md' }: { status: EmergencyStatus; size?: 'sm' | 'md' }) {
  const m = EMERGENCY_STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${m.bg} ${m.text} ${m.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${m.dot} ${status === 'active' ? 'status-dot-active' : ''}`} aria-hidden="true" />
      {m.label}
    </span>
  );
}
