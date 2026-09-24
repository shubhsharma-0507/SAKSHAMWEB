import { ReactNode } from 'react';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1 max-w-xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DemoNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
      <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
      <p>Demo mode: edits are saved in server memory only and reset when the server restarts.</p>
    </div>
  );
}

export function LoadState({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 py-16 justify-center" role="status">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Loading your hospital…
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800 flex gap-3" role="alert">
      <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <p>{error || 'Something went wrong while loading your hospital.'}</p>
    </div>
  );
}

export function Panel({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      {title && <h2 className="font-bold text-slate-900">{title}</h2>}
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      <div className={title ? 'mt-5' : ''}>{children}</div>
    </section>
  );
}
