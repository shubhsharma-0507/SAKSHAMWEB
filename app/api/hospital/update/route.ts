import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import { patchHospital } from '@/lib/hospitalStore';
import { isDemoMode } from '@/lib/demoStore';
import { getHospitalAdmin } from '@/lib/auth';
import { sanitizeAvailability } from '@/lib/validation';

// Live availability update for the signed-in admin's own hospital
// (beds, ICU, equipment, specialists, ambulance, emergency status).
export async function PUT(request: NextRequest) {
  try {
    const auth = await getHospitalAdmin();
    if ('error' in auth) return auth.error;
    const result = sanitizeAvailability(await request.json());
    if (!result.ok) return Response.json({ success: false, error: result.error }, { status: 400 });
    const hospital = await patchHospital(auth.hospitalId, result.patch);
    if (!hospital) return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    return Response.json({ success: true, data: hospital, message: 'Updated', isDemo: isDemoMode() });
  } catch (error) {
    console.error('Availability update error:', error);
    return dbErrorResponse(error, 'Failed to save changes');
  }
}
