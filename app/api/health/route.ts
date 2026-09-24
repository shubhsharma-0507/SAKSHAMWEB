import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { describeDbProblem } from '@/lib/apiError';
import { isDemoMode } from '@/lib/demoStore';

// Open http://localhost:3000/api/health to confirm which mode the app is in
// and that MongoDB Atlas is reachable. It never returns connection details or credentials.
export const dynamic = 'force-dynamic';

export async function GET() {
  if (isDemoMode()) {
    return Response.json({ status: 'ok', mode: 'demo', database: null, note: 'Sample data. Set NEXT_PUBLIC_DEMO_MODE=false to use MongoDB.' });
  }
  try {
    const conn = await connectDB();
    await conn.connection.db!.admin().ping();
    const hospitals = await mongoose.connection.collection('hospitals').countDocuments();
    return Response.json({ status: 'ok', mode: 'database', database: { connected: true, name: conn.connection.name, hospitals } });
  } catch (error) {
    const { message } = describeDbProblem(error);
    return Response.json(
      { status: 'error', mode: 'database', database: { connected: false }, problem: message || 'Unexpected error while connecting.' },
      { status: 503 }
    );
  }
}
