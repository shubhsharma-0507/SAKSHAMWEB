import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import { findHospital, patchHospital } from '@/lib/hospitalStore';
import { isDemoMode } from '@/lib/demoStore';
import { getHospitalAdmin } from '@/lib/auth';
import { sanitizeAvailability } from '@/lib/validation';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const h = await findHospital(id);
    if (!h) {
      return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }
    const { beds, icu, equipment, specialists, ambulance, emergencyStatus, lastUpdated } = h;
    return Response.json({
      success: true,
      data: { beds, icu, equipment, specialists, ambulance, emergencyStatus, lastUpdated },
      ...(isDemoMode() && { isDemo: true }),
    });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(error, 'Failed to fetch availability');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getHospitalAdmin();
    if ('error' in auth) return auth.error;

    const { id } = await params;
    if (auth.hospitalId !== id) {
      return Response.json({ success: false, error: 'You can only update your own hospital' }, { status: 403 });
    }

    const result = sanitizeAvailability(await request.json());
    if (!result.ok) return Response.json({ success: false, error: result.error }, { status: 400 });

    const hospital = await patchHospital(id, result.patch);
    if (!hospital) {
      return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: hospital, message: 'Availability updated', ...(isDemoMode() && { isDemo: true }) });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(error, 'Failed to update availability');
  }
}
