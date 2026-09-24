import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'About — SAKSHAM',
  description: 'Why SAKSHAM ranks hospitals by what they can do for your emergency, not just how close they are.',
};

const PRINCIPLES = [
  {
    title: 'Capability before distance',
    body: 'The closest hospital may have no free ICU bed, no neurologist on duty, or no CT scanner in working order. SAKSHAM checks those things first and uses distance as one factor among several.',
  },
  {
    title: 'Fresh data or a clear warning',
    body: 'Every hospital shows when its numbers were last updated. Old data is flagged so you can call ahead instead of trusting it blindly.',
  },
  {
    title: 'Explainable results',
    body: 'Each hospital lists why it matched: which specialists, which equipment, how many ICU beds. The scoring is rule-based and documented, not a black box.',
  },
  {
    title: 'Built for stress',
    body: 'Large tap targets, plain language, one call button and one navigate button per hospital. Nobody should have to learn an interface during an emergency.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="The nearest hospital is not always the right one."
        subtitle="SAKSHAM helps families and first responders choose a hospital based on what the emergency needs and what the hospital can provide right now."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The problem</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed max-w-2xl">
            <p>
              In an emergency most people head for the nearest hospital. Sometimes that is exactly right. Other times the patient arrives and is
              sent onward because the ICU is full or the needed specialist is not there, and the minutes lost in transfer matter.
            </p>
            <p>
              Hospitals know their own capacity, but that information rarely reaches the person deciding where to go. SAKSHAM closes that gap by
              letting hospitals publish live availability and by matching it to the type of emergency.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How we approach it</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
          <h2 className="text-lg font-bold text-amber-900 mb-2">What SAKSHAM is not</h2>
          <p className="text-sm text-amber-900 leading-relaxed max-w-2xl">
            SAKSHAM is not an ambulance service and does not give medical advice or diagnosis. Availability is reported by hospitals and can
            change minute to minute. If someone is in immediate danger, call <a href="tel:112" className="font-semibold underline">112</a> first,
            and phone the hospital to confirm before you travel whenever you can.
          </p>
        </section>

        <section className="flex flex-col sm:flex-row gap-3">
          <Link href="/find-hospital" className="px-5 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold text-center hover:bg-blue-800">Find a hospital</Link>
          <Link href="/for-hospitals" className="px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold text-center hover:bg-slate-50">List your hospital</Link>
        </section>
      </div>
    </>
  );
}
