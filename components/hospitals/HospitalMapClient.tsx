'use client';

import dynamic from 'next/dynamic';
import { HospitalWithDistance } from '@/types';

const HospitalMapInner = dynamic(() => import('./HospitalMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Loading map...</p>
      </div>
    </div>
  ),
});

interface HospitalMapClientProps {
  hospitals: HospitalWithDistance[];
  userLat: number;
  userLon: number;
  selectedHospital?: HospitalWithDistance | null;
  onHospitalSelect?: (hospital: HospitalWithDistance) => void;
}

export default function HospitalMapClient(props: HospitalMapClientProps) {
  return <HospitalMapInner {...props} />;
}
