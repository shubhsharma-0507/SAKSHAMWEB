import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { isDemoMode } from '@/lib/demoStore';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    if (isDemoMode()) {
      // Demo mode: accept demo credentials
      if (email === 'admin@demo.com' && password === 'demo123') {
        const token = signToken({ userId: 'demo-user', email, role: 'HOSPITAL_ADMIN', hospitalId: 'hosp-001' });
        const cookieStore = await cookies();
        cookieStore.set('saksham_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
        return Response.json({
          success: true,
          data: {
            user: { _id: 'demo-user', name: 'Demo Admin', email, role: 'HOSPITAL_ADMIN', hospitalId: 'hosp-001' },
          },
          isDemo: true,
        });
      }
      return Response.json({ success: false, error: 'Invalid credentials. Use admin@demo.com / demo123' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId?.toString(),
    });

    const cookieStore = await cookies();
    cookieStore.set('saksham_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return Response.json({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          hospitalId: user.hospitalId?.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return dbErrorResponse(error, 'Login failed. Please try again.');
  }
}
