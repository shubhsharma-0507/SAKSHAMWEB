'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { Field, inputClass } from '@/components/ui/Field';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) setError(json.error || 'Could not send your message');
      else setSent(true);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center" role="status">
        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-3" aria-hidden="true" />
        <h2 className="font-bold text-emerald-900">Message sent</h2>
        <p className="text-sm text-emerald-800 mt-1">Thanks, {form.name.split(' ')[0]}. We will reply to {form.email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name" htmlFor="c-name">
          <input id="c-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="c-email">
          <input id="c-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <Field label="Topic" htmlFor="c-topic">
        <select id="c-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputClass}>
          <option value="general">General question</option>
          <option value="hospital">Register or update a hospital</option>
          <option value="data">Report incorrect hospital data</option>
          <option value="feedback">Feedback or suggestion</option>
        </select>
      </Field>
      <Field label="Message" htmlFor="c-message">
        <textarea id="c-message" required rows={5} maxLength={4000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
      </Field>
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-5 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-60">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send message
      </button>
    </form>
  );
}
