'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EMERGENCY_TYPES } from '@/utils/emergencyTypes';
import { EmergencyType } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function EmergencySearchSection() {
  const [selected, setSelected] = useState<EmergencyType | null>(null);
  const router = useRouter();

  const handleFind = () => {
    if (!selected) return;
    router.push(`/find-hospital?emergency=${selected}`);
  };

  return (
    <section id="emergency-search" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            What kind of emergency are you facing?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Select the emergency type so SAKSHAM can find hospitals with the right capabilities.
          </p>
        </div>

        {/* Emergency Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8" role="group" aria-label="Emergency type selection">
          {EMERGENCY_TYPES.slice(0, 9).map((type) => {
            const Icon = type.icon;
            const isSelected = selected === type.id;
            return (
              <button
                key={type.id}
                id={`emergency-${type.id}`}
                onClick={() => setSelected(isSelected ? null : type.id)}
                aria-pressed={isSelected}
                className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all text-center group ${
                  isSelected
                    ? `border-blue-500 bg-blue-50 shadow-md`
                    : `border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50`
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600' : `${type.bg} group-hover:bg-blue-100`
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isSelected ? 'text-white' : type.color}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                    {type.label}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5 hidden sm:block">
                    {type.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center" aria-hidden="true">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            id="find-hospitals-cta"
            onClick={handleFind}
            disabled={!selected}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all ${
              selected
                ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-200 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            aria-disabled={!selected}
          >
            Find Suitable Hospitals
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
          {!selected && (
            <p className="text-xs text-slate-500">Select an emergency type above to continue</p>
          )}
          {selected && (
            <p className="text-xs text-blue-600 font-medium">
              Searching for hospitals suited for: {EMERGENCY_TYPES.find(e => e.id === selected)?.label}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
