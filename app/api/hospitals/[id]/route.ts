import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import { findHospital, patchHospital } from '@/lib/hospitalStore';
import { isDemoMode } from '@/lib/demoStore';
import { getHospitalAdmin } from '@/lib/auth';
import { sanitizeAvailability, sanitizeProfile } from '@/lib/validation';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const hospital = await findHospital(id);
    if (!hospital) {
      return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: hospital, ...(isDemoMode() && { isDemo: true }) });
  } catch (error) {
    console.error('Hospital detail error:', error);
    return dbErrorResponse(error, 'Failed to fetch hospital');
  }
}

// Only the admin who owns this hospital may edit it.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getHospitalAdmin();
    if ('error' in auth) return auth.error;

    const { id } = await params;
    if (auth.hospitalId !== id) {
      return Response.json({ success: false, error: 'You can only edit your own hospital' }, { status: 403 });
    }

    const body = await request.json();
    const profile = sanitizeProfile(body);
    const availability = sanitizeAvailability(body);
    const patch = {
      ...(profile.ok ? profile.patch : {}),
      ...(availability.ok ? availability.patch : {}),
    };
    if (Object.keys(patch).length === 0) {
      return Response.json({ success: false, error: profile.ok ? 'Nothing to update' : profile.error }, { status: 400 });
    }

    const hospital = await patchHospital(id, patch);
    if (!hospital) {
      return Response.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: hospital, ...(isDemoMode() && { isDemo: true }) });
  } catch (error) {
    console.error('Hospital update error:', error);
    return dbErrorResponse(error, 'Failed to update hospital');
  }
}
