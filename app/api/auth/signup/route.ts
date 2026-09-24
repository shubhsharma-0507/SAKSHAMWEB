import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import HospitalModel from '@/models/Hospital';
import { signToken } from '@/lib/auth';
import { isDemoMode } from '@/lib/demoStore';
import { sanitizeProfile } from '@/lib/validation';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json({ success: false, error: 'Enter a valid email address' }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (isDemoMode()) {
      return Response.json(
        { success: false, error: 'Registration is turned off in demo mode. Sign in with admin@demo.com / demo123 instead.' },
        { status: 400 }
      );
    }

    // Hospital details entered during signup (same rules as the profile screen)
    const profile = sanitizeProfile({ ...body, name: body.hospitalName });
    if (!profile.ok) {
      return Response.json({ success: false, error: profile.error }, { status: 400 });
    }
    const required = ['name', 'address', 'city', 'state', 'phone', 'emergencyPhone', 'latitude', 'longitude'];
    const missing = required.filter((k) => profile.patch[k] === undefined || profile.patch[k] === '');
    if (missing.length) {
      return Response.json({ success: false, error: 'Please fill in all hospital details, including its location' }, { status: 400 });
    }

    await connectDB();
    if (await User.findOne({ email })) {
      return Response.json({ success: false, error: 'This email is already registered. Try signing in.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: 'HOSPITAL_ADMIN' });

    // New hospitals start with emergency "limited" and zero capacity until the admin publishes real numbers.
    const hospital = await HospitalModel.create({
      ...profile.patch,
      emergencyStatus: 'limited',
      adminId: user._id,
    });
    user.hospitalId = hospital._id;
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      hospitalId: hospital._id.toString(),
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
          hospitalId: hospital._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return dbErrorResponse(error, 'Signup failed. Please try again.');
  }
}
