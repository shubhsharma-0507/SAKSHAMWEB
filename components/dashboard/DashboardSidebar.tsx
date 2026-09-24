'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Bed, Zap, Activity, Siren, LogOut, ExternalLink } from 'lucide-react';

const ITEMS = [
  { href: '/hospital/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/hospital/dashboard/beds', label: 'Beds & ICU', icon: Bed },
  { href: '/hospital/dashboard/emergency', label: 'Emergency status', icon: Siren },
  { href: '/hospital/dashboard/equipment', label: 'Equipment', icon: Zap },
  { href: '/hospital/dashboard/specialists', label: 'Specialists', icon: Activity },
  { href: '/hospital/dashboard/profile', label: 'Hospital profile', icon: Building2 },
];

export default function DashboardSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try { await fetch('/api/auth/logout', { method: 'POST' }); } finally {
      router.replace('/hospital/login');
      router.refresh();
    }
  }

  return (
    <aside className="md:w-64 md:shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200">
      <div className="md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex md:flex-col">
        <div className="hidden md:block px-5 py-5 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">{email}</p>
        </div>

        <nav className="flex md:flex-col gap-1 p-2 md:p-3 overflow-x-auto md:overflow-visible flex-1" aria-label="Dashboard">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block p-3 border-t border-slate-100 space-y-1">
          <Link href="/find-hospital" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            See public search
          </Link>
          <button
            onClick={logout}
            disabled={busy}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
        <button
          onClick={logout}
          disabled={busy}
          className="md:hidden px-3 text-slate-500 hover:text-red-700 disabled:opacity-50"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
