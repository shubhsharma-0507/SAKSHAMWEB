'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, label: string) => void;
  currentLocation?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocation = async (q: string) => {
    if (!q.trim() || q.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      });
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowResults(true);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(value), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    const shortName = result.display_name.split(',').slice(0, 2).join(',').trim();
    setQuery(shortName);
    setShowResults(false);
    onLocationSelect(parseFloat(result.lat), parseFloat(result.lon), shortName);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please search for your location manually.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const label = data.address
            ? `${data.address.suburb || data.address.neighbourhood || ''}, ${data.address.city || data.address.town || ''}`.replace(/^, /, '').trim()
            : 'Current Location';
          setQuery(label || 'Current Location');
          onLocationSelect(latitude, longitude, label || 'Current Location');
        } catch {
          setQuery('Current Location');
          onLocationSelect(latitude, longitude, 'Current Location');
        }
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        alert("We couldn't access your location. Please search manually.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            id="location-search-input"
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder={currentLocation || 'Search city, area, or landmark...'}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search location"
            aria-autocomplete="list"
            aria-controls="location-results"
            aria-expanded={showResults}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" aria-hidden="true" />
          )}
        </div>

        {/* Use current location */}
        <button
          id="use-my-location-btn"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-60"
          aria-label="Use my current location"
        >
          {geoLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div
          id="location-results"
          role="listbox"
          aria-label="Location search results"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
        >
          {results.map((result, i) => (
            <button
              key={i}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(result)}
              className="w-full flex items-start gap-2.5 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-slate-700 line-clamp-2">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
