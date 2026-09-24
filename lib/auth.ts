import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const DEV_SECRET = 'dev-only-secret-do-not-use-in-production';

// Read lazily so `next build` works without env vars, but a production server
// refuses to sign or verify tokens with a guessable secret.
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set. Add a long random value to your environment.');
  }
  return DEV_SECRET;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  hospitalId?: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('saksham_token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireHospitalAdmin(): Promise<TokenPayload> {
  const user = await getAuthUser();
  if (!user || user.role !== 'HOSPITAL_ADMIN') {
    throw new Error('Forbidden: Hospital admin access required');
  }
  return user;
}

/** Returns the signed-in hospital admin, or a ready-made error Response. */
export async function getHospitalAdmin(): Promise<
  { user: TokenPayload; hospitalId: string } | { error: Response }
> {
  const user = await getAuthUser();
  if (!user) return { error: Response.json({ success: false, error: 'Please sign in to continue' }, { status: 401 }) };
  if (user.role !== 'HOSPITAL_ADMIN' || !user.hospitalId) {
    return { error: Response.json({ success: false, error: 'Hospital admin access required' }, { status: 403 }) };
  }
  return { user, hospitalId: user.hospitalId };
}
