import { X, CheckCircle } from 'lucide-react';

const TRADITIONAL = [
  'Shows nearest hospitals only',
  'No information on ICU availability',
  'No specialist filtering',
  'No equipment information',
  'No suitability reasoning',
  'Patient arrives, may be turned away',
];

const SAKSHAM = [
  'Matches hospitals by emergency type',
  'Shows real ICU bed availability',
  'Filters by required specialist',
  'Shows critical equipment availability',
  'Explains why each hospital is suitable',
  'Patient reaches the right hospital first',
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Not just "nearest" — the <span className="text-blue-700">most suitable</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Traditional hospital search answers "What hospital is nearby?" SAKSHAM answers "Which nearby hospital can handle this emergency?"
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Traditional */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
              <h3 className="font-bold text-slate-700 text-base">Traditional Hospital Search</h3>
              <p className="text-xs text-slate-500 mt-0.5">Location-focused only</p>
            </div>
            <ul className="p-6 space-y-3">
              {TRADITIONAL.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SAKSHAM */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-md">
            <div className="px-6 py-4 bg-blue-700 border-b border-blue-600">
              <h3 className="font-bold text-white text-base">SAKSHAM</h3>
              <p className="text-xs text-blue-200 mt-0.5">Capability + Availability + Distance</p>
            </div>
            <ul className="p-6 space-y-3">
              {SAKSHAM.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
