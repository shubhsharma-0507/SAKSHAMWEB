'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, LogIn, Info } from 'lucide-react';
import { Field, inputClass } from '@/components/ui/Field';

export default function LoginForm({ demo }: { demo: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(creds: { email: string; password: string }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Could not sign in'); setBusy(false); return; }
      router.replace('/hospital/dashboard');
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <>
      {demo && (
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />Demo mode is on. Use the sample hospital account to look around.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => login({ email: 'admin@demo.com', password: 'demo123' })}
            className="mt-3 w-full px-4 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
          >
            Open demo dashboard
          </button>
          <p className="mt-2 text-xs text-blue-800">Or type admin@demo.com / demo123 below.</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); login({ email, password }); }} className="space-y-4">
        <Field label="Email" htmlFor="login-email">
          <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password" htmlFor="login-password">
          <div className="relative">
            <input id="login-password" type={show ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-11`} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-60">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500 text-center">
        New to SAKSHAM? <Link href="/hospital/signup" className="font-semibold text-blue-700 hover:underline">Register your hospital</Link>
      </p>
    </>
  );
}
