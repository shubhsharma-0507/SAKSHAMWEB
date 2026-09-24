import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import { listHospitals } from '@/lib/hospitalStore';
import { isDemoMode } from '@/lib/demoStore';

// Text search by hospital name, city, state, pincode or address.
export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
    if (q.length < 2) {
      return Response.json({ success: false, error: 'Type at least 2 characters to search' }, { status: 400 });
    }
    const all = await listHospitals();
    const data = all
      .filter((h) => [h.name, h.city, h.state, h.pincode, h.address].some((f) => f?.toLowerCase().includes(q)))
      .slice(0, 20);
    return Response.json({ success: true, data, total: data.length, isDemo: isDemoMode() });
  } catch (error) {
    console.error('Hospital text search error:', error);
    return dbErrorResponse(error, 'Search failed');
  }
}
