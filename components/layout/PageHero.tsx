import { ReactNode } from 'react';

export default function PageHero({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <section className="hero-gradient border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 max-w-2xl">{title}</h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">{subtitle}</p>
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
