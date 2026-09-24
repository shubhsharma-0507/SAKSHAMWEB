'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmergencyType, HospitalWithDistance } from '@/types';
import { EMERGENCY_TYPES } from '@/utils/emergencyTypes';
import HospitalCard from '@/components/hospitals/HospitalCard';
import HospitalFilters from '@/components/hospitals/HospitalFilters';
import LocationSearch from '@/components/search/LocationSearch';
import HospitalMapClient from '@/components/hospitals/HospitalMapClient';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { MapPin, SlidersHorizontal, Map, List, X, AlertCircle } from 'lucide-react';
import { EMERGENCY_TYPES as ET } from '@/utils/emergencyTypes';

interface Filters {
  icuAvailable: boolean;
  ventilatorAvailable: boolean;
  emergencyActive: boolean;
  ambulanceAvailable: boolean;
  is24x7: boolean;
}

function FindHospitalContent() {
  const searchParams = useSearchParams();
  const emergencyParam = searchParams.get('emergency') as EmergencyType | null;

  const [emergency, setEmergency] = useState<EmergencyType>(emergencyParam || 'general');
  const [location, setLocation] = useState<{ lat: number; lon: number; label: string } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedHospital, setSelectedHospital] = useState<HospitalWithDistance | null>(null);
  const [filters, setFilters] = useState<Filters>({
    icuAvailable: false,
    ventilatorAvailable: false,
    emergencyActive: false,
    ambulanceAvailable: false,
    is24x7: false,
  });

  const fetchHospitals = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        emergency,
        lat: lat.toString(),
        lon: lon.toString(),
        maxDistance: '50',
        ...(filters.icuAvailable && { icuAvailable: 'true' }),
        ...(filters.ventilatorAvailable && { ventilatorAvailable: 'true' }),
        ...(filters.emergencyActive && { emergencyActive: 'true' }),
        ...(filters.ambulanceAvailable && { ambulanceAvailable: 'true' }),
        ...(filters.is24x7 && { is24x7: 'true' }),
      });
      const res = await fetch(`/api/hospitals?${params}`);
      const data = await res.json();
      if (data.success) {
        setHospitals(data.data);
        setIsDemo(data.isDemo || false);
        setSearched(true);
      } else {
        setError(data.error || 'Failed to fetch hospitals');
      }
    } catch {
      setError('Hospital information is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [emergency, filters]);

  // Auto-search when location is set
  useEffect(() => {
    if (location) {
      fetchHospitals(location.lat, location.lon);
    }
  }, [location, fetchHospitals]);

  // If emergency came from URL, try auto-getting location
  useEffect(() => {
    if (emergencyParam && !location) {
      // Try geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Current Location' });
          },
          () => {
            // Use default Delhi coordinates for demo
            setLocation({ lat: 28.6139, lon: 77.2090, label: 'New Delhi (default)' });
          }
        );
      } else {
        setLocation({ lat: 28.6139, lon: 77.2090, label: 'New Delhi (default)' });
      }
    }
  }, [emergencyParam, location]);

  const selectedEmergency = ET.find((e) => e.id === emergency);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Emergency selector */}
            <div className="flex-shrink-0">
              <select
                id="emergency-type-select"
                value={emergency}
                onChange={(e) => setEmergency(e.target.value as EmergencyType)}
                className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select emergency type"
              >
                {EMERGENCY_TYPES.map((e) => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
            </div>

            {/* Location search */}
            <div className="flex-1">
              <LocationSearch
                onLocationSelect={(lat, lon, label) => setLocation({ lat, lon, label })}
                currentLocation={location?.label}
              />
            </div>

            {/* Filter toggle */}
            <button
              id="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Filters
              {Object.values(filters).some(Boolean) && (
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold" aria-label="Filters active">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <HospitalFilters filters={filters} onChange={setFilters} />
            </div>
          )}

          {/* Results summary */}
          {searched && !loading && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {location && (
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                    <span>{location.label}</span>
                  </div>
                )}
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600 font-medium">{hospitals.length} hospitals found</span>
                {isDemo && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-semibold">Demo Data</span>
                )}
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  id="list-view-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  id="map-view-btn"
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                  aria-label="Map view"
                  aria-pressed={viewMode === 'map'}
                >
                  <Map className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Initial state */}
        {!searched && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Select your location</h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              {emergencyParam
                ? 'Share your location to find suitable hospitals for your emergency.'
                : 'Choose an emergency type and share your location to begin your search.'}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div>
            <div className="text-center py-6 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Finding suitable hospitals...
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingSkeleton key={i} type="hospital-card" />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6" role="alert">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <div className="font-semibold text-sm">Unable to load hospitals</div>
              <div className="text-xs mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* Results */}
        {searched && !loading && hospitals.length === 0 && (
          <EmptyState
            title="No suitable hospitals found"
            description="No hospitals matching your requirements were found in this area. Try increasing the search range or adjusting filters."
            icon="hospital"
          />
        )}

        {searched && !loading && hospitals.length > 0 && (
          <>
            {/* Emergency label */}
            {selectedEmergency && (
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-7 h-7 ${selectedEmergency.bg} rounded-lg flex items-center justify-center`}>
                  <selectedEmergency.icon className={`w-4 h-4 ${selectedEmergency.color}`} aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{selectedEmergency.label}</span>
                <span className="text-xs text-slate-400">— showing most suitable hospitals first</span>
              </div>
            )}

            {viewMode === 'list' ? (
              <div className="grid lg:grid-cols-2 gap-4">
                {hospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital._id}
                    hospital={hospital}
                    emergencyType={emergency}
                    isSelected={selectedHospital?._id === hospital._id}
                    onSelect={() => setSelectedHospital(hospital)}
                  />
                ))}
              </div>
            ) : (
              <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200">
                <HospitalMapClient
                  hospitals={hospitals}
                  userLat={location?.lat || 28.6139}
                  userLon={location?.lon || 77.2090}
                  selectedHospital={selectedHospital}
                  onHospitalSelect={setSelectedHospital}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FindHospitalPage() {
  // useSearchParams() needs a Suspense boundary for static prerendering
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10"><LoadingSkeleton count={3} /></div>}>
      <FindHospitalContent />
    </Suspense>
  );
}
