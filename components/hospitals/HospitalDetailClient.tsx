'use client';

import { useEffect, useState } from 'react';
import { Hospital } from '@/types';
import { formatLastUpdated } from '@/utils/emergencyTypes';
import {
  Phone, MapPin, Navigation, Clock, Share2, CheckCircle, X,
  Bed, Wind, Building2, BadgeCheck, ArrowLeft, AlertTriangle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const SingleHospitalMap = dynamic(() => import('@/components/hospitals/SingleHospitalMap'), {
  ssr: false,
  loading: () => <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />,
});

interface Props {
  hospitalId: string;
  initialHospital: Hospital | null;
}

const EQUIPMENT_LABELS: Record<string, string> = {
  ventilator: 'Ventilator',
  ctScan: 'CT Scan',
  mri: 'MRI',
  xray: 'X-Ray',
  ecg: 'ECG',
  defibrillator: 'Defibrillator',
  dialysis: 'Dialysis',
  oxygen: 'Oxygen Supply',
  bloodBank: 'Blood Bank',
  operationTheater: 'Operation Theater',
};

const SPECIALIST_LABELS: Record<string, string> = {
  cardiologist: 'Cardiologist',
  neurologist: 'Neurologist',
  orthopedic: 'Orthopedic Specialist',
  pulmonologist: 'Pulmonologist',
  pediatrician: 'Pediatrician',
  traumaSurgeon: 'Trauma Surgeon',
  generalSurgeon: 'General Surgeon',
  anesthesiologist: 'Anesthesiologist',
  radiologist: 'Radiologist',
  intensivist: 'ICU Intensivist',
  burnSpecialist: 'Burn Specialist',
  ophthalmologist: 'Ophthalmologist',
};

const HOSPITAL_TYPE_LABELS: Record<string, string> = {
  government: 'Government Hospital',
  private: 'Private Hospital',
  trust: 'Trust Hospital',
  multispecialty: 'Multi-Specialty Hospital',
  specialty: 'Specialty Hospital',
};

export default function HospitalDetailClient({ hospitalId, initialHospital }: Props) {
  const [hospital, setHospital] = useState<Hospital | null>(initialHospital);
  const [loading, setLoading] = useState(!initialHospital);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialHospital) {
      fetch(`/api/hospitals/${hospitalId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setHospital(data.data);
          else setError('Hospital information could not be loaded.');
        })
        .catch(() => setError('Hospital information is temporarily unavailable.'))
        .finally(() => setLoading(false));
    }
  }, [hospitalId, initialHospital]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading hospital information...</p>
        </div>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Hospital Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">{error || 'This hospital could not be found.'}</p>
          <Link href="/find-hospital" className="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
            Find Another Hospital
          </Link>
        </div>
      </div>
    );
  }

  const { text: lastUpdatedText, isStale } = formatLastUpdated(hospital.lastUpdated);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
  const statusColors = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    limited: 'bg-amber-100 text-amber-800 border-amber-200',
    unavailable: 'bg-red-100 text-red-800 border-red-200',
  };

  const handleShare = async () => {
    const shareData = {
      title: hospital.name,
      text: `${hospital.name} — Emergency: ${hospital.emergencyPhone}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'));
    }
  };

  const availableEquipment = Object.entries(hospital.equipment).filter(([, v]) => v);
  const unavailableEquipment = Object.entries(hospital.equipment).filter(([, v]) => !v);
  const availableSpecialists = Object.entries(hospital.specialists).filter(([, v]) => v);
  const unavailableSpecialists = Object.entries(hospital.specialists).filter(([, v]) => !v);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/find-hospital" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-700 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              id="share-hospital-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
              aria-label="Share hospital"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="get-directions-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </a>
            <a
              href={`tel:${hospital.emergencyPhone}`}
              id="call-hospital-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    {HOSPITAL_TYPE_LABELS[hospital.hospitalType]}
                  </span>
                  {hospital.is24x7 && (
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">24×7</span>
                  )}
                  {hospital.accreditation && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      <BadgeCheck className="w-3 h-3" />
                      {hospital.accreditation}
                    </span>
                  )}
                  {hospital.establishedYear && (
                    <span className="text-xs text-slate-400">Est. {hospital.establishedYear}</span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{hospital.name}</h1>
                {hospital.description && (
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{hospital.description}</p>
                )}
                <div className="flex items-start gap-1.5 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span>{hospital.address}, {hospital.city}, {hospital.state}{hospital.pincode && ` — ${hospital.pincode}`}</span>
                </div>
              </div>

              {/* Emergency status badge */}
              <div className={`flex-shrink-0 px-4 py-3 border rounded-xl text-center ${statusColors[hospital.emergencyStatus]}`}>
                <div className="font-bold text-sm capitalize">Emergency</div>
                <div className="font-black text-base capitalize">{hospital.emergencyStatus}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Availability cards */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 text-base mb-4">Current Availability</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* General beds */}
                <div className={`p-3 rounded-xl border text-center ${hospital.beds.available > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <Bed className={`w-5 h-5 mx-auto mb-1 ${hospital.beds.available > 0 ? 'text-emerald-600' : 'text-red-500'}`} />
                  <div className="font-black text-lg text-slate-900">{hospital.beds.available}</div>
                  <div className="text-[10px] text-slate-500 font-medium">General Beds</div>
                  <div className="text-[10px] text-slate-400">of {hospital.beds.total}</div>
                </div>

                {/* ICU beds */}
                <div className={`p-3 rounded-xl border text-center ${hospital.icu.available > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <Building2 className={`w-5 h-5 mx-auto mb-1 ${hospital.icu.available > 0 ? 'text-emerald-600' : 'text-red-500'}`} />
                  <div className="font-black text-lg text-slate-900">{hospital.icu.available}</div>
                  <div className="text-[10px] text-slate-500 font-medium">ICU Beds</div>
                  <div className="text-[10px] text-slate-400">of {hospital.icu.total}</div>
                </div>

                {/* Ventilator */}
                <div className={`p-3 rounded-xl border text-center ${hospital.equipment.ventilator ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                  <Wind className={`w-5 h-5 mx-auto mb-1 ${hospital.equipment.ventilator ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className={`font-bold text-sm ${hospital.equipment.ventilator ? 'text-blue-700' : 'text-slate-500'}`}>
                    {hospital.equipment.ventilator ? 'Available' : 'Not Available'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Ventilator</div>
                </div>

                {/* Ambulance */}
                <div className={`p-3 rounded-xl border text-center ${hospital.ambulance ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xl mx-auto mb-1 text-center">🚑</div>
                  <div className={`font-bold text-sm ${hospital.ambulance ? 'text-purple-700' : 'text-slate-500'}`}>
                    {hospital.ambulance ? 'Available' : 'Not Available'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Ambulance</div>
                </div>
              </div>

              {/* Last updated */}
              <div className={`mt-4 flex items-center gap-1.5 text-xs ${isStale ? 'text-amber-600' : 'text-slate-400'}`}>
                {isStale && <AlertTriangle className="w-3.5 h-3.5" />}
                <Clock className="w-3.5 h-3.5" />
                <span>{lastUpdatedText}</span>
                {isStale && <span className="font-medium">— Information may be outdated. Verify with the hospital directly.</span>}
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 text-base mb-4">Equipment & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableEquipment.map(([key]) => (
                  <div key={key} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-700">{EQUIPMENT_LABELS[key] || key}</span>
                  </div>
                ))}
                {unavailableEquipment.map(([key]) => (
                  <div key={key} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg opacity-60">
                    <X className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-500">{EQUIPMENT_LABELS[key] || key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialists */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 text-base mb-4">Available Specialists</h2>
              {availableSpecialists.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No specialist information available.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSpecialists.map(([key]) => (
                    <div key={key} className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-700">{SPECIALIST_LABELS[key] || key}</span>
                    </div>
                  ))}
                  {unavailableSpecialists.map(([key]) => (
                    <div key={key} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg opacity-60">
                      <X className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-500">{SPECIALIST_LABELS[key] || key}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 text-sm mb-3">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Emergency Phone</div>
                  <a href={`tel:${hospital.emergencyPhone}`} className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    {hospital.emergencyPhone}
                  </a>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">General Phone</div>
                  <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-blue-700 transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    {hospital.phone}
                  </a>
                </div>
                {hospital.email && (
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</div>
                    <span className="text-xs text-slate-600">{hospital.email}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href={`tel:${hospital.emergencyPhone}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Emergency
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm">Location</h2>
                <p className="text-xs text-slate-500 mt-0.5">{hospital.city}, {hospital.state}</p>
              </div>
              <div className="h-48">
                <SingleHospitalMap
                  lat={hospital.latitude}
                  lon={hospital.longitude}
                  name={hospital.name}
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Note:</strong> SAKSHAM provides hospital and facility information to help users make informed decisions. Availability may change. Always verify directly with the hospital and call emergency services for life-threatening situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
