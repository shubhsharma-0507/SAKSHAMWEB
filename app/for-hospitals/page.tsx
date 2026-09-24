import Link from 'next/link';
import type { Metadata } from 'next';
import { Bed, Zap, Activity, Siren, Building2, LogIn } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'For hospitals — SAKSHAM',
  description: 'Publish live bed, ICU, equipment and specialist availability so the right emergency patients reach you.',
};

const CONTROLS = [
  { icon: Bed, title: 'Beds and ICU', body: 'Set your capacity once, then change available counts in two taps as patients are admitted and discharged.' },
  { icon: Siren, title: 'Emergency status', body: 'Switch between active, limited and not accepting when your department is under pressure.' },
  { icon: Zap, title: 'Equipment', body: 'Mark ventilators, CT, MRI, dialysis and more as ready or out of service.' },
  { icon: Activity, title: 'Specialists', body: 'Show which specialists are on duty or reachable right now.' },
  { icon: Building2, title: 'Public profile', body: 'Add your address, phone lines, accreditation and location so patients can find and reach you.' },
];

const STEPS = [
  { title: 'Register', body: 'Create an account with your hospital’s name, address, emergency phone and map location.' },
  { title: 'Publish your capabilities', body: 'Mark the equipment and specialists you have, and set your bed and ICU capacity.' },
  { title: 'Keep it current', body: 'Update counts when they change. Stale data is flagged to patients, so a quick confirmation at each shift change keeps you trusted.' },
];

export default function ForHospitalsPage() {
  return (
    <>
      <PageHero
        title="Be found by the patients you are best equipped to treat."
        subtitle="When someone searches for a stroke or trauma hospital, SAKSHAM ranks by what each hospital can do right now. Keep your availability current and the right patients arrive."
      >
        <Link href="/hospital/signup" className="px-5 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800">Register your hospital</Link>
        <Link href="/hospital/login" className="inline-flex items-center gap-2 px-5 py-3 border border-slate-300 bg-white text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50">
          <LogIn className="w-4 h-4" aria-hidden="true" /> Hospital sign in
        </Link>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What you control</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {CONTROLS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0" aria-hidden="true"><Icon className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Getting started</h2>
          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center shrink-0" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1 max-w-2xl">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Your responsibility</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Patients make decisions from what you publish. Only mark equipment and specialists that are ready to use, and update counts promptly.
            Inaccurate listings may be removed under our <Link href="/terms" className="underline">Terms of Use</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
