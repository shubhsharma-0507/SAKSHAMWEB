import { ReactNode } from 'react';
import { Cross } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, wide = false }: { title: string; subtitle: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="hero-gradient min-h-[calc(100vh-4rem)] py-10 px-4">
      <div className={`mx-auto ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center" aria-hidden="true">
            <Cross className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-700" style={{ fontFamily: 'Outfit, sans-serif' }}>SAKSHAM for hospitals</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
