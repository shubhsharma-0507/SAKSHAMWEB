import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAuthUser } from '@/lib/auth';
import { isDemoMode } from '@/lib/demoStore';
import AuthShell from '@/components/auth/AuthShell';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = { title: 'Register your hospital — SAKSHAM' };

export default async function HospitalSignupPage() {
  const user = await getAuthUser();
  if (user?.role === 'HOSPITAL_ADMIN') redirect('/hospital/dashboard');

  return (
    <AuthShell wide title="Register your hospital" subtitle="Create an account, then keep your beds, equipment and specialists up to date.">
      <SignupForm demo={isDemoMode()} />
    </AuthShell>
  );
}
