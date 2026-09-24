import { CheckCircle, Shield, Clock } from 'lucide-react';

export default function TrustSection() {
  return (
    <section id="trust" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            Transparent Information
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Information you can understand.
            <br />
            <span className="text-blue-700">Decisions you can make.</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            SAKSHAM never shows unexplained scores. Every recommendation comes with a clear reason.
          </p>
        </div>

        {/* Example card */}
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-10">
          <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-base">Apollo City Medical Centre</div>
              <div className="text-xs text-slate-500 mt-0.5">3.2 km away · Cardiac Emergency</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-600">94%</div>
              <div className="text-xs text-slate-500">Suitability</div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-700">Why this hospital?</span>
            </div>
            <div className="space-y-2">
              {[
                'Emergency department active',
                'Cardiologist available',
                'ICU: 8 beds available',
                'Ventilator available',
                'Defibrillator available',
                '3.2 km away · ~6 min',
                '24×7 emergency services',
              ].map((reason) => (
                <div key={reason} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-slate-700">{reason}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Information updated 15 min ago</span>
            </div>
          </div>
        </div>

        {/* Trust points */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'No Fake Claims',
              desc: 'SAKSHAM does not fabricate data. All information comes from hospital-reported records.',
            },
            {
              icon: Clock,
              title: 'Timestamp on Data',
              desc: 'Every availability record shows when it was last updated. Outdated data is flagged clearly.',
            },
            {
              icon: CheckCircle,
              title: 'Transparent Matching',
              desc: 'Every recommendation comes with a visible list of reasons — no hidden algorithms.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
