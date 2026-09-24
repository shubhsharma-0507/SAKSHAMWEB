import type { Metadata } from 'next';
import { Phone, AlertTriangle } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import ContactForm from '@/components/layout/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — SAKSHAM',
  description: 'Get in touch about SAKSHAM, register a hospital, or report incorrect data.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact us" subtitle="Questions, feedback, or a hospital listing that needs fixing. We read every message." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <ContactForm />
        </div>
        <aside className="md:col-span-2">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="flex items-center gap-2 font-bold text-red-900"><AlertTriangle className="w-4 h-4" aria-hidden="true" /> In an emergency</h2>
            <p className="text-sm text-red-900 mt-2 leading-relaxed">This form is not monitored in real time. Do not use it to ask for help.</p>
            <div className="mt-4 space-y-2">
              <a href="tel:112" className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">
                <Phone className="w-4 h-4" aria-hidden="true" /> Call 112
              </a>
              <a href="tel:108" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-800 rounded-xl text-sm font-semibold hover:bg-red-100">
                <Phone className="w-4 h-4" aria-hidden="true" /> Ambulance: 108
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
