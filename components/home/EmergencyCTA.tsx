import Link from 'next/link';
import { Search, Phone, AlertTriangle } from 'lucide-react';

export default function EmergencyCTA() {
  return (
    <section id="emergency-cta" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-red-50 via-red-50 to-orange-50 border border-red-100 rounded-3xl p-8 sm:p-12">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Facing a medical emergency right now?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            If it is immediately life-threatening, call emergency services first. Otherwise, use SAKSHAM to find the most suitable hospital for your situation.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="tel:112"
              id="call-112-cta"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-base hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call 112 — Emergency
            </a>
            <Link
              href="/find-hospital"
              id="find-hospital-cta"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl font-bold text-base hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              Find Suitable Hospital
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            SAKSHAM provides hospital information. It does not provide medical diagnosis or guarantee hospital admission. Always call emergency services for life-threatening situations.
          </p>
        </div>
      </div>
    </section>
  );
}
