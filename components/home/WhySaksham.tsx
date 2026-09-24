import { Target, Activity, Clock, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Beyond Distance',
    description:
      'Find hospitals based on emergency capability, available specialists, ICU beds, and required equipment — not just how close they are.',
    color: 'bg-blue-50 text-blue-700',
    iconBg: 'bg-blue-100',
  },
  {
    icon: Activity,
    title: 'Emergency Ready',
    description:
      'See exactly which hospitals have active emergency departments, available ICU beds, ventilators, and relevant specialists for your situation.',
    color: 'bg-emerald-50 text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: Clock,
    title: 'Availability Visibility',
    description:
      'Know when hospital information was last updated. Outdated information is clearly marked so you can make informed decisions.',
    color: 'bg-amber-50 text-amber-700',
    iconBg: 'bg-amber-100',
  },
  {
    icon: Zap,
    title: 'Faster Decisions',
    description:
      'Stop wasting critical minutes searching random hospitals. SAKSHAM shows you the most suitable options upfront, ranked by suitability.',
    color: 'bg-purple-50 text-purple-700',
    iconBg: 'bg-purple-100',
  },
];

export default function WhySaksham() {
  return (
    <section id="why-saksham" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
            Why SAKSHAM
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Designed for the moments that matter most
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            During a medical emergency, you need more than a map. You need to know if the hospital can actually handle your situation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${feature.color.split(' ')[1]}`} aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
