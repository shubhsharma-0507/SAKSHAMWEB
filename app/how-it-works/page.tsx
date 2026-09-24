import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'How it works — SAKSHAM',
  description: 'How SAKSHAM scores and ranks hospitals for each type of emergency.',
};

const STEPS = [
  { title: 'Choose the emergency', body: 'Pick the closest match: cardiac, accident, breathing, stroke, burn, critical care, pediatric, general or other. Each type has its own list of specialists and equipment that matter.' },
  { title: 'Share your location', body: 'Allow GPS for an instant fix, or search by city, area, landmark or PIN code. Your location is used to calculate distance and is not stored.' },
  { title: 'Review ranked hospitals', body: 'Every hospital gets a suitability score out of 100 and a plain list of reasons. Results appear on a list and on a map.' },
  { title: 'Call or navigate', body: 'Call the hospital’s emergency line to confirm, then open directions in your maps app.' },
];

const WEIGHTS = [
  { factor: 'Emergency department', points: '25', note: 'Full marks when active, 10 when running at limited capacity, none when not accepting patients.' },
  { factor: 'Specialists', points: '25', note: 'Split across the specialists this emergency type needs. A stroke needs a neurologist and radiologist; a burn needs a burn specialist.' },
  { factor: 'ICU', points: '20', note: 'Full marks when an ICU bed is free, a few when the ICU exists but is full. Emergencies that do not need an ICU get full marks.' },
  { factor: 'Equipment', points: '20', note: 'Split across the equipment this emergency type needs, such as ECG and defibrillator for cardiac, CT for stroke and trauma.' },
  { factor: 'Distance', points: '10', note: '10 within 2 km, 8 within 5 km, 5 within 10 km, 2 within 20 km.' },
  { factor: '24×7 services', points: '+5', note: 'Bonus for hospitals that run emergency care around the clock.' },
  { factor: 'Ambulance', points: '+3', note: 'Bonus for accident and trauma emergencies when the hospital has an ambulance.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        title="How SAKSHAM picks a hospital"
        subtitle="A simple, rule-based score. No hidden model, so you can see exactly why a hospital ranks where it does."
      >
        <Link href="/find-hospital" className="px-5 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800">Try it now</Link>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">From emergency to hospital</h2>
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

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">How the score is calculated</h2>
          <p className="text-slate-600 text-sm mb-5 max-w-2xl">Scores are capped at 100. The specialists and equipment counted depend on the emergency type you choose.</p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <caption className="sr-only">Suitability score breakdown</caption>
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Factor</th>
                  <th scope="col" className="px-4 py-3 font-semibold w-20">Points</th>
                  <th scope="col" className="px-4 py-3 font-semibold">How it works</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WEIGHTS.map((w) => (
                  <tr key={w.factor}>
                    <th scope="row" className="px-4 py-3 font-semibold text-slate-900 text-left align-top">{w.factor}</th>
                    <td className="px-4 py-3 font-bold text-blue-700 align-top">{w.points}</td>
                    <td className="px-4 py-3 text-slate-600 leading-relaxed">{w.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-2">Where the data comes from</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hospitals update their own beds, equipment and specialists from the SAKSHAM dashboard. Each listing shows when it was last updated,
              and old data is flagged.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-bold text-amber-900 mb-2">Always confirm by phone</h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              A high score is a good starting point, not a guarantee. If someone’s life is at risk, call <a href="tel:112" className="font-semibold underline">112</a> now.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
