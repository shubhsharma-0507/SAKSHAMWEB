import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import { findHospital, patchHospital } from '@/lib/hospitalStore';
import { isDemoMode } from '@/lib/demoStore';
import { getHospitalAdmin } from '@/lib/auth';
import { sanitizeProfile } from '@/lib/validation';

export async function GET() {
  try {
    const auth = await getHospitalAdmin();
    if ('error' in auth) return auth.error;
    const hospital = await findHospital(auth.hospitalId);
    if (!hospital) return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    return Response.json({ success: true, data: hospital, isDemo: isDemoMode() });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return dbErrorResponse(error, 'Failed to load hospital');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getHospitalAdmin();
    if ('error' in auth) return auth.error;
    const result = sanitizeProfile(await request.json());
    if (!result.ok) return Response.json({ success: false, error: result.error }, { status: 400 });
    const hospital = await patchHospital(auth.hospitalId, result.patch);
    if (!hospital) return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    return Response.json({ success: true, data: hospital, message: 'Profile saved', isDemo: isDemoMode() });
  } catch (error) {
    console.error('Profile update error:', error);
    return dbErrorResponse(error, 'Failed to save profile');
  }
}
