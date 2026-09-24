'use client';

import { useEffect, useRef } from 'react';
import { X, Phone, MapPin, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface EmergencyModalProps {
  onClose: () => void;
}

export default function EmergencyModal({ onClose }: EmergencyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* Header */}
        <div className="bg-red-600 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white" aria-hidden="true" />
              <h2 id="emergency-modal-title" className="text-lg font-bold text-white">
                Emergency Help
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Close emergency modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-red-100 text-sm mt-1">
            Choose an action for immediate assistance
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* Emergency call */}
          <div className="p-4 border-2 border-red-200 rounded-xl bg-red-50">
            <p className="text-sm font-semibold text-red-800 mb-1">Call Emergency Services</p>
            <p className="text-xs text-red-600 mb-3">
              For immediate life-threatening emergencies, call emergency services first.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:112"
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                aria-label="Call 112 emergency"
              >
                <Phone className="w-4 h-4" />
                112 — Emergency
              </a>
              <a
                href="tel:102"
                className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                aria-label="Call 102 ambulance"
              >
                <Phone className="w-3.5 h-3.5" />
                102 — Ambulance
              </a>
            </div>
          </div>

          {/* Find hospital */}
          <Link
            href="/find-hospital"
            onClick={onClose}
            className="flex items-center gap-3 p-4 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
            aria-label="Find a suitable hospital now"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-900">Find a Suitable Hospital</div>
              <div className="text-xs text-blue-600 mt-0.5">Search by emergency type and your location</div>
            </div>
          </Link>

          <p className="text-xs text-slate-500 text-center pt-1">
            Emergency numbers are configurable. Please verify local emergency numbers for your region.
          </p>
        </div>
      </div>
    </div>
  );
}
