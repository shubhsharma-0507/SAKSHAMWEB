'use client';

interface Filters {
  icuAvailable: boolean;
  ventilatorAvailable: boolean;
  emergencyActive: boolean;
  ambulanceAvailable: boolean;
  is24x7: boolean;
}

interface HospitalFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FILTER_OPTIONS = [
  { key: 'icuAvailable' as keyof Filters, label: 'ICU Available', desc: 'Show only hospitals with available ICU beds' },
  { key: 'ventilatorAvailable' as keyof Filters, label: 'Ventilator Available', desc: 'Must have ventilator' },
  { key: 'emergencyActive' as keyof Filters, label: 'Emergency Active', desc: 'Only active emergency departments' },
  { key: 'ambulanceAvailable' as keyof Filters, label: 'Ambulance', desc: 'Hospital has ambulance service' },
  { key: 'is24x7' as keyof Filters, label: '24×7 Emergency', desc: 'Round-the-clock emergency services' },
];

export default function HospitalFilters({ filters, onChange }: HospitalFiltersProps) {
  const toggle = (key: keyof Filters) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Hospital filters">
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          id={`filter-${opt.key}`}
          onClick={() => toggle(opt.key)}
          aria-pressed={filters[opt.key]}
          title={opt.desc}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            filters[opt.key]
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
