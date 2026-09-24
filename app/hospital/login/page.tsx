import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAuthUser } from '@/lib/auth';
import { isDemoMode } from '@/lib/demoStore';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Hospital sign in — SAKSHAM' };

export default async function HospitalLoginPage() {
  const user = await getAuthUser();
  if (user?.role === 'HOSPITAL_ADMIN') redirect('/hospital/dashboard');

  return (
    <AuthShell title="Sign in" subtitle="Manage your hospital's live availability.">
      <LoginForm demo={isDemoMode()} />
    </AuthShell>
  );
}
