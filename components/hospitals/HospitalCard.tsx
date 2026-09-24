'use client';

import Link from 'next/link';
import { HospitalWithDistance, EmergencyType } from '@/types';
import { formatLastUpdated, getICUStatus } from '@/utils/emergencyTypes';
import {
  MapPin, Clock, Phone, Navigation, ChevronRight,
  CheckCircle, Bed, Wind, Zap, Building2, BadgeCheck
} from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalWithDistance;
  emergencyType: EmergencyType;
  isSelected?: boolean;
  onSelect?: () => void;
}

const HOSPITAL_TYPE_LABELS: Record<string, string> = {
  government: 'Govt.',
  private: 'Private',
  trust: 'Trust',
  multispecialty: 'Multi-specialty',
  specialty: 'Specialty',
};

export default function HospitalCard({ hospital, emergencyType, isSelected, onSelect }: HospitalCardProps) {
  const { text: lastUpdatedText, isStale } = formatLastUpdated(hospital.lastUpdated);
  const icuStatus = getICUStatus(hospital.icu.available, hospital.icu.total);

  const emergencyStatusConfig = {
    active: { label: 'Emergency Active', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    limited: { label: 'Limited Capacity', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    unavailable: { label: 'Not Available', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  };
  const status = emergencyStatusConfig[hospital.emergencyStatus];

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

  return (
    <article
      className={`hospital-card bg-white rounded-2xl border transition-all overflow-hidden ${
        isSelected ? 'border-blue-400 shadow-lg shadow-blue-100' : 'border-slate-200 shadow-sm'
      }`}
      aria-label={`${hospital.name} hospital card`}
      onClick={onSelect}
    >
      {/* Top strip */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full">
                {HOSPITAL_TYPE_LABELS[hospital.hospitalType] || hospital.hospitalType}
              </span>
              {hospital.is24x7 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">
                  24×7
                </span>
              )}
              {hospital.accreditation && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full">
                  <BadgeCheck className="w-2.5 h-2.5" aria-hidden="true" />
                  {hospital.accreditation}
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base leading-tight truncate">{hospital.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs text-slate-500 truncate">{hospital.address}, {hospital.city}</span>
            </div>
          </div>

          {/* Suitability score */}
          <div className="text-right flex-shrink-0">
            <div className={`text-2xl font-black ${hospital.suitabilityScore >= 70 ? 'text-emerald-600' : hospital.suitabilityScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {hospital.suitabilityScore}%
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Suitability</div>
          </div>
        </div>
      </div>

      {/* Status row */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-2 border-b border-slate-50">
        {/* Emergency status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 ${status.bg} rounded-full`}>
          <span className={`w-2 h-2 rounded-full ${status.dot} status-dot-active`} aria-hidden="true" />
          <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
        </div>

        {/* ICU status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
          hospital.icu.available > 3 ? 'bg-emerald-50' : hospital.icu.available > 0 ? 'bg-amber-50' : 'bg-red-50'
        }`}>
          <Bed className={`w-3 h-3 ${icuStatus.dot === 'bg-emerald-500' ? 'text-emerald-600' : icuStatus.dot === 'bg-amber-500' ? 'text-amber-600' : 'text-red-600'}`} aria-hidden="true" />
          <span className={`text-xs font-semibold ${icuStatus.color}`}>{icuStatus.label}</span>
        </div>

        {/* Ventilator */}
        {hospital.equipment.ventilator && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-full">
            <Wind className="w-3 h-3 text-blue-600" aria-hidden="true" />
            <span className="text-xs font-semibold text-blue-700">Ventilator</span>
          </div>
        )}

        {/* Ambulance */}
        {hospital.ambulance && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 rounded-full">
            <Zap className="w-3 h-3 text-purple-600" aria-hidden="true" />
            <span className="text-xs font-semibold text-purple-700">Ambulance</span>
          </div>
        )}
      </div>

      {/* Why this hospital */}
      <div className="px-5 py-3 border-b border-slate-50">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Why this hospital?</div>
        <div className="space-y-1">
          {hospital.matchReasons.slice(0, 4).map((reason) => (
            <div key={reason} className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs text-slate-700">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distance + time + last updated */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-500" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-700">{hospital.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span className="text-xs text-slate-600">~{hospital.estimatedTime} min</span>
          </div>
        </div>
        <span className={`text-[10px] font-medium ${isStale ? 'text-amber-600' : 'text-slate-400'}`}>
          {lastUpdatedText}
        </span>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 flex items-center gap-2">
        <Link
          href={`/hospitals/${hospital._id}`}
          id={`view-${hospital._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label={`View details for ${hospital.name}`}
        >
          View Details
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
        </Link>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          id={`directions-${hospital._id}`}
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Get directions to ${hospital.name}`}
        >
          <Navigation className="w-3 h-3" aria-hidden="true" />
          Directions
        </a>
        <a
          href={`tel:${hospital.emergencyPhone}`}
          id={`call-${hospital._id}`}
          className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Call ${hospital.name} emergency number`}
        >
          <Phone className="w-3 h-3" aria-hidden="true" />
          Call
        </a>
      </div>
    </article>
  );
}
