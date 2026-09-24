import { NextRequest } from 'next/server';
import { dbErrorResponse } from '@/lib/apiError';
import connectDB from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { isDemoMode } from '@/lib/demoStore';

export async function POST(request: NextRequest) {
  try {
    const { name, email, topic, message } = await request.json();
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ success: false, error: 'Name, email and message are required' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json({ success: false, error: 'Enter a valid email address' }, { status: 400 });
    }
    const doc = { name: name.trim(), email: email.trim(), topic: topic || 'general', message: message.trim().slice(0, 4000) };
    if (isDemoMode()) {
      console.log('[contact:demo]', doc);
    } else {
      await connectDB();
      await ContactMessage.create(doc);
    }
    return Response.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact error:', error);
    return dbErrorResponse(error, 'Could not send your message. Please try again.');
  }
}
