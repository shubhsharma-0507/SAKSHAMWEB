import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import { listHospitals } from '@/lib/hospitalStore';
import { isDemoMode } from '@/lib/demoStore';
import { calculateDistance, calculateSuitabilityScore, estimateTravelTime } from '@/lib/matching';
import { EmergencyType, HospitalWithDistance } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const emergency = (searchParams.get('emergency') || 'general') as EmergencyType;
    const lat = parseFloat(searchParams.get('lat') || '28.6139');
    const validEmergencies = ['cardiac','accident','breathing','stroke','burn','critical','pediatric','general','other'];
    if (!validEmergencies.includes(emergency)) {
      return Response.json({ success: false, error: 'Unknown emergency type' }, { status: 400 });
    }
    const lon = parseFloat(searchParams.get('lon') || '77.2090');
    const maxDistance = parseFloat(searchParams.get('maxDistance') || '30');

    // Filters
    const icuAvailable = searchParams.get('icuAvailable') === 'true';
    const ventilatorAvailable = searchParams.get('ventilatorAvailable') === 'true';
    const emergencyActive = searchParams.get('emergencyActive') === 'true';
    const ambulanceAvailable = searchParams.get('ambulanceAvailable') === 'true';
    const is24x7 = searchParams.get('is24x7') === 'true';

    const hospitalsRaw = await listHospitals();

    // Compute distance + suitability
    let hospitals: HospitalWithDistance[] = hospitalsRaw
      .map((h) => {
        const dist = calculateDistance(lat, lon, h.latitude, h.longitude);
        const { score, reasons } = calculateSuitabilityScore(h, emergency, dist);
        return {
          ...h,
          distance: Math.round(dist * 10) / 10,
          estimatedTime: estimateTravelTime(dist),
          suitabilityScore: score,
          matchReasons: reasons,
        } as HospitalWithDistance;
      })
      .filter((h) => h.distance <= maxDistance);

    // Apply filters
    if (icuAvailable) hospitals = hospitals.filter((h) => h.icu.available > 0);
    if (ventilatorAvailable) hospitals = hospitals.filter((h) => h.equipment.ventilator);
    if (emergencyActive) hospitals = hospitals.filter((h) => h.emergencyStatus === 'active');
    if (ambulanceAvailable) hospitals = hospitals.filter((h) => h.ambulance);
    if (is24x7) hospitals = hospitals.filter((h) => h.is24x7);

    // Sort by suitability score descending
    hospitals.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return Response.json({
      success: true,
      data: hospitals,
      isDemo: isDemoMode(),
      total: hospitals.length,
    });
  } catch (error) {
    console.error('Hospital search error:', error);
    return dbErrorResponse(error, 'Failed to fetch hospitals');
  }
}
