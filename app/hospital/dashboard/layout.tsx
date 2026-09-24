import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAuthUser } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export const metadata: Metadata = {
  title: 'Hospital dashboard — SAKSHAM',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user || user.role !== 'HOSPITAL_ADMIN') redirect('/hospital/login');

  return (
    <ToastProvider>
      <div className="md:flex min-h-[calc(100vh-4rem)] bg-slate-50">
        <DashboardSidebar name="Hospital admin" email={user.email} />
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}
