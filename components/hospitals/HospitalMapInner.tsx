'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HospitalWithDistance } from '@/types';

// Fix default marker icons for Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createHospitalIcon = (score: number, isSelected: boolean) => {
  const color = isSelected ? '#1B4FD8' : score >= 70 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626';
  return L.divIcon({
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: ${color}; border: 3px solid white;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    "><span style="transform: rotate(45deg); color: white; font-size: 11px; font-weight: bold;">${score}</span></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });
};

const userIcon = L.divIcon({
  html: `<div style="
    width: 16px; height: 16px; border-radius: 50%;
    background: #1B4FD8; border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(27,79,216,0.25);
  "></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface Props {
  hospitals: HospitalWithDistance[];
  userLat: number;
  userLon: number;
  selectedHospital?: HospitalWithDistance | null;
  onHospitalSelect?: (hospital: HospitalWithDistance) => void;
}

export default function HospitalMapInner({ hospitals, userLat, userLon, selectedHospital, onHospitalSelect }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [userLat, userLon],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // User marker
    L.marker([userLat, userLon], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div style="font-size:12px;font-weight:600;color:#1B4FD8">📍 Your Location</div>');

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [userLat, userLon]);

  // Update markers when hospitals change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    hospitals.forEach((hospital) => {
      const isSelected = selectedHospital?._id === hospital._id;
      const icon = createHospitalIcon(hospital.suitabilityScore, isSelected);

      const statusColor = hospital.emergencyStatus === 'active' ? '#059669' : hospital.emergencyStatus === 'limited' ? '#D97706' : '#DC2626';

      const popup = `
        <div style="font-family: Inter, sans-serif; min-width: 200px;">
          <div style="font-weight: 700; font-size: 13px; color: #0F172A; margin-bottom: 4px;">${hospital.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${hospital.address}</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
            <span style="padding: 2px 8px; background: ${statusColor}20; color: ${statusColor}; border-radius: 20px; font-size: 10px; font-weight: 600;">
              Emergency: ${hospital.emergencyStatus}
            </span>
            <span style="padding: 2px 8px; background: #EEF2FF; color: #1B4FD8; border-radius: 20px; font-size: 10px; font-weight: 600;">
              ${hospital.suitabilityScore}% Match
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            📍 ${hospital.distance} km · ⏱ ~${hospital.estimatedTime} min<br>
            🛏 ICU: ${hospital.icu.available}/${hospital.icu.total} available
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="/hospitals/${hospital._id}" style="flex:1; padding: 5px 8px; background: #1B4FD8; color: white; text-align: center; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">View Details</a>
            <a href="tel:${hospital.emergencyPhone}" style="padding: 5px 8px; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">📞 Call</a>
          </div>
        </div>
      `;

      const marker = L.marker([hospital.latitude, hospital.longitude], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 280 });

      marker.on('click', () => {
        onHospitalSelect?.(hospital);
        marker.openPopup();
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });

    // Fit bounds
    if (hospitals.length > 0) {
      const group = L.featureGroup([
        L.marker([userLat, userLon]),
        ...markersRef.current,
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [hospitals, selectedHospital, userLat, userLon, onHospitalSelect]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      aria-label="Hospital locations map"
      role="application"
    />
  );
}
