import Link from 'next/link';
import { Building2, CheckCircle, LogIn } from 'lucide-react';

const BENEFITS = [
  'Maintain your hospital profile and information',
  'Update ICU and general bed availability in real time',
  'Update equipment and ventilator status',
  'Manage specialist on-call availability',
  'Control emergency department status',
  'Reach patients who need exactly your capabilities',
];

export default function ForHospitalsSection() {
  return (
    <section id="for-hospitals-home" className="py-16 bg-blue-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 border border-blue-500 rounded-full text-xs font-semibold text-blue-100 mb-5">
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
              For Hospitals
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Help patients find your hospital when it matters most.
            </h2>
            <p className="text-blue-200 text-sm sm:text-base leading-relaxed mb-6">
              Register your hospital on SAKSHAM. Keep your availability information updated so patients with the right emergency find you — not a hospital 10 km further that lacks your capabilities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/for-hospitals"
                id="for-hospitals-learn-more"
                className="px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                Learn More
              </Link>
              <Link
                href="/hospital/login"
                id="for-hospitals-login-btn"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white border border-blue-500 rounded-xl font-semibold text-sm hover:bg-blue-500 transition-colors"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Hospital Login
              </Link>
            </div>
          </div>

          <div className="bg-blue-800/50 rounded-2xl p-6 border border-blue-600">
            <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-4">What you can do</h3>
            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-blue-100">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
