'use client';

import { useState } from 'react';
import { Crosshair, Search, Loader2 } from 'lucide-react';
import { Field, inputClass } from '@/components/ui/Field';
import { HOSPITAL_TYPE_OPTIONS } from '@/utils/helpers';

export interface HospitalFormValues {
  name: string; hospitalType: string; address: string; city: string; state: string; pincode: string;
  phone: string; emergencyPhone: string; email: string; website: string;
  description: string; accreditation: string; establishedYear: string;
  latitude: string; longitude: string;
}

export const EMPTY_HOSPITAL_FORM: HospitalFormValues = {
  name: '', hospitalType: 'multispecialty', address: '', city: '', state: '', pincode: '',
  phone: '', emergencyPhone: '', email: '', website: '', description: '', accreditation: '', establishedYear: '',
  latitude: '', longitude: '',
};

interface Props {
  values: HospitalFormValues;
  onChange: (field: keyof HospitalFormValues, value: string) => void;
  /** compact hides the optional public-profile fields (used on signup) */
  compact?: boolean;
  idPrefix?: string;
}

export default function HospitalFields({ values, onChange, compact = false, idPrefix = 'h' }: Props) {
  const [locating, setLocating] = useState<'gps' | 'address' | null>(null);
  const [locMsg, setLocMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const id = (k: string) => `${idPrefix}-${k}`;

  function text(k: keyof HospitalFormValues, label: string, opts: { type?: string; required?: boolean; hint?: string; placeholder?: string; autoComplete?: string } = {}) {
    return (
      <Field label={label} htmlFor={id(k)} hint={opts.hint}>
        <input
          id={id(k)} type={opts.type || 'text'} required={opts.required} autoComplete={opts.autoComplete}
          placeholder={opts.placeholder} value={values[k]} onChange={(e) => onChange(k, e.target.value)} className={inputClass}
        />
      </Field>
    );
  }

  function useMyLocation() {
    if (!navigator.geolocation) { setLocMsg({ ok: false, text: 'Your browser does not support location access.' }); return; }
    setLocating('gps'); setLocMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange('latitude', pos.coords.latitude.toFixed(6));
        onChange('longitude', pos.coords.longitude.toFixed(6));
        setLocMsg({ ok: true, text: 'Location set from this device. Check it matches the hospital.' });
        setLocating(null);
      },
      () => { setLocMsg({ ok: false, text: 'Could not read your location. Allow location access or use the address lookup.' }); setLocating(null); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function findFromAddress() {
    const q = [values.address, values.city, values.state, values.pincode].filter(Boolean).join(', ');
    if (!q) { setLocMsg({ ok: false, text: 'Fill in the address, city and state first.' }); return; }
    setLocating('address'); setLocMsg(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`);
      const rows: Array<{ lat: string; lon: string }> = await res.json();
      if (!rows.length) throw new Error('none');
      onChange('latitude', Number(rows[0].lat).toFixed(6));
      onChange('longitude', Number(rows[0].lon).toFixed(6));
      setLocMsg({ ok: true, text: 'Coordinates found from the address. Check them on the map after saving.' });
    } catch {
      setLocMsg({ ok: false, text: 'Could not find that address. Try a simpler address, or enter coordinates by hand.' });
    } finally {
      setLocating(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        {text('name', 'Hospital name', { required: true, autoComplete: 'organization' })}
        <Field label="Hospital type" htmlFor={id('hospitalType')}>
          <select id={id('hospitalType')} value={values.hospitalType} onChange={(e) => onChange('hospitalType', e.target.value)} className={inputClass}>
            {HOSPITAL_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>

      {text('address', 'Street address', { required: true, autoComplete: 'street-address' })}
      <div className="grid sm:grid-cols-3 gap-4">
        {text('city', 'City', { required: true })}
        {text('state', 'State', { required: true })}
        {text('pincode', 'PIN code', { placeholder: '452001' })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {text('phone', 'Main phone', { type: 'tel', required: true, autoComplete: 'tel' })}
        {text('emergencyPhone', 'Emergency phone', { type: 'tel', required: true, hint: 'Shown to patients and callers. Make sure it is staffed 24×7.' })}
      </div>

      {!compact && (
        <div className="grid sm:grid-cols-2 gap-4">
          {text('email', 'Public email', { type: 'email' })}
          {text('website', 'Website', { type: 'url', placeholder: 'https://' })}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">Map location</p>
          <p className="text-xs text-slate-500 mt-0.5">Patients are matched by distance, so this needs to be accurate.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {text('latitude', 'Latitude', { required: true, placeholder: '22.7196' })}
          {text('longitude', 'Longitude', { required: true, placeholder: '75.8577' })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={findFromAddress} disabled={!!locating} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {locating === 'address' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Find from address
          </button>
          <button type="button" onClick={useMyLocation} disabled={!!locating} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {locating === 'gps' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />} Use my current location
          </button>
        </div>
        {locMsg && <p role="status" className={`text-xs ${locMsg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{locMsg.text}</p>}
      </div>

      {!compact && (
        <>
          <Field label="About the hospital" htmlFor={id('description')} hint="A short summary patients see on your public page.">
            <textarea id={id('description')} rows={4} maxLength={1500} value={values.description} onChange={(e) => onChange('description', e.target.value)} className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            {text('accreditation', 'Accreditation', { placeholder: 'NABH, NABL…' })}
            {text('establishedYear', 'Year established', { type: 'number', placeholder: '1995' })}
          </div>
        </>
      )}
    </div>
  );
}
