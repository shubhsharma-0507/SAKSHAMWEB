'use client';

import Link from 'next/link';
import { Search, ArrowRight, CheckCircle, MapPin, Activity } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 py-16 sm:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 mb-6">
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              Smart Emergency Hospital Finder
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5">
              Find the{' '}
              <span className="text-blue-700">Right Hospital</span>
              <br />
              When Every Second
              <br />
              <span className="text-blue-700">Matters.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              SAKSHAM helps you discover nearby hospitals based on emergency requirements, available facilities and current capacity —{' '}
              <strong className="text-slate-800">not just distance.</strong>
            </p>

            {/* Feature bullets */}
            <div className="space-y-2.5 mb-8">
              {[
                'Matches hospitals to your specific emergency',
                'Shows ICU beds, ventilators, and specialist availability',
                'Explains exactly why each hospital is recommended',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/find-hospital"
                id="hero-find-hospital-btn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-md shadow-blue-200"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Find a Hospital
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/how-it-works"
                id="hero-how-it-works-btn"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50 transition-all"
              >
                How SAKSHAM Works
              </Link>
            </div>
          </div>

          {/* Right — Visual Card */}
          <div className="relative">
            {/* Flow diagram */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5 text-center">
                How SAKSHAM Helps
              </div>

              {/* Step flow */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Emergency Detected</div>
                    <div className="text-xs text-slate-500">Patient selects: Cardiac Emergency</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" aria-hidden="true" />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">SAKSHAM Matches</div>
                    <div className="text-xs text-slate-500">Checks ICU, cardiologist, equipment</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" aria-hidden="true" />
                </div>

                {/* Result */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-slate-800">Best Match Found</div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">94%</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mb-1.5">City Cardiac Care — 3.2 km</div>
                  <div className="space-y-1">
                    {['Cardiologist available', 'ICU: 5 beds', 'Emergency active'].map((reason) => (
                      <div key={reason} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                        <span className="text-xs text-slate-600">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location tag */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Using your current location</span>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -left-4 top-8 bg-white shadow-lg rounded-xl px-3 py-2 border border-slate-100">
              <div className="text-lg font-bold text-blue-700">10+</div>
              <div className="text-xs text-slate-500">Hospitals</div>
            </div>
            <div className="absolute -right-4 bottom-8 bg-white shadow-lg rounded-xl px-3 py-2 border border-slate-100">
              <div className="text-lg font-bold text-emerald-600">Live</div>
              <div className="text-xs text-slate-500">Availability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
