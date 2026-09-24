import { ClipboardList, MapPin, Search, Building2, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Tell Us the Emergency',
    description: 'Select the type of emergency — cardiac, trauma, stroke, burn, pediatric, or others. SAKSHAM maps your selection to specific hospital capability requirements.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Share Your Location',
    description: 'Use your device\'s GPS for instant location detection, or manually search by city, area, landmark, or pincode using our built-in location search.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    number: '03',
    icon: Search,
    title: 'SAKSHAM Matches Hospitals',
    description: 'The platform checks hospital capability and availability data, calculates a suitability score for each hospital, and ranks results by match quality.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    number: '04',
    icon: Building2,
    title: 'Reach the Right Hospital',
    description: 'View hospital details, understand exactly why each hospital is recommended, then call directly or navigate there with one tap.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works-home" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 mb-4">
            Simple 4-step process
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            How SAKSHAM Works
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            From emergency selection to reaching the right hospital in under a minute.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line - desktop */}
          <div className="absolute top-8 left-1/4 right-1/4 h-0.5 bg-slate-100 hidden lg:block" aria-hidden="true" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <div className={`border ${step.border} ${step.bg} rounded-2xl p-6 h-full`}>
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${step.bg} border ${step.border} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${step.color}`} aria-hidden="true" />
                    </div>
                    <span className="text-3xl font-black text-slate-100" aria-hidden="true">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow between steps on mobile */}
                {index < STEPS.length - 1 && (
                  <div className="flex justify-center my-3 lg:hidden" aria-hidden="true">
                    <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
