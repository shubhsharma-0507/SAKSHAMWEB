'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus, Info } from 'lucide-react';
import { Field, inputClass } from '@/components/ui/Field';
import HospitalFields, { EMPTY_HOSPITAL_FORM, HospitalFormValues } from '@/components/dashboard/HospitalFields';

export default function SignupForm({ demo }: { demo: boolean }) {
  const router = useRouter();
  const [account, setAccount] = useState({ name: '', email: '', password: '' });
  const [hospital, setHospital] = useState<HospitalFormValues>(EMPTY_HOSPITAL_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // `name` must stay the person's own name; the hospital's name goes in `hospitalName`
        body: JSON.stringify({ ...hospital, ...account, hospitalName: hospital.name }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error || 'Could not create your account'); setBusy(false); return; }
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
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <p>Registration is off while the app runs in demo mode. <Link href="/hospital/login" className="font-semibold underline">Open the demo dashboard</Link> instead.</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-base font-bold text-slate-900 mb-1">Your account</legend>
          <Field label="Your name" htmlFor="su-name">
            <input id="su-name" required autoComplete="name" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Work email" htmlFor="su-email">
              <input id="su-email" type="email" required autoComplete="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Password" htmlFor="su-password" hint="At least 8 characters.">
              <input id="su-password" type="password" required minLength={8} autoComplete="new-password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} className={inputClass} />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-base font-bold text-slate-900 mb-4">Your hospital</legend>
          <HospitalFields compact values={hospital} onChange={(k, v) => setHospital((h) => ({ ...h, [k]: v }))} idPrefix="su" />
        </fieldset>

        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <button type="submit" disabled={busy || demo} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create hospital account
          </button>
          <p className="mt-3 text-xs text-slate-500 text-center">
            By registering you agree to the <Link href="/terms" className="underline">Terms of Use</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </form>

      <p className="mt-6 text-sm text-slate-500 text-center">
        Already registered? <Link href="/hospital/login" className="font-semibold text-blue-700 hover:underline">Sign in</Link>
      </p>
    </>
  );
}
