import HospitalDetailClient from '@/components/hospitals/HospitalDetailClient';
import { getDemoHospital, isDemoMode } from '@/lib/demoStore';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hospital = isDemoMode() ? getDemoHospital(id) : null;
  return {
    title: hospital ? `${hospital.name} — SAKSHAM` : 'Hospital details — SAKSHAM',
    description: hospital ? hospital.description : 'Hospital details and live availability.',
  };
}

export default async function HospitalDetailPage({ params }: Props) {
  const { id } = await params;
  // Demo mode renders on the server from sample data (including dashboard edits).
  // With a database, the client component loads the hospital from the API.
  const hospital = isDemoMode() ? getDemoHospital(id) : null;
  return <HospitalDetailClient hospitalId={id} initialHospital={hospital} />;
}
