import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Terms of Use — SAKSHAM',
  description: 'The rules for using SAKSHAM.',
};

export default function TermsofUsePage() {
  return (
    <>
      <PageHero title="Terms of Use" subtitle="The rules for using SAKSHAM." />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Not a substitute for emergency services</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>SAKSHAM is an information tool. It is not an ambulance service, does not give medical advice, and does not diagnose or treat any condition. In an emergency call 112 (or 108 for an ambulance) immediately. Do not delay seeking care to use this site.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Accuracy of information</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>Hospital availability is reported by the hospitals themselves and can change at any moment. Suitability scores are calculated by fixed rules and are only a guide. We do not guarantee that any hospital has the beds, equipment or specialists shown, or that it will accept a patient. Always confirm by phone where you can.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Hospital accounts</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>You must be authorised to represent the hospital you register.</p>
            <p>You agree to publish accurate information and to update it promptly when it changes. Marking equipment or specialists as available when they are not may endanger patients.</p>
            <p>You are responsible for keeping your password secure and for activity under your account.</p>
            <p>We may suspend or remove listings that are inaccurate, out of date for long periods, or misused.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Acceptable use</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>Do not misuse the service: no scraping at a rate that harms it, no attempts to break into accounts or systems, no false listings, and no use of SAKSHAM to harass or mislead others.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Liability</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>SAKSHAM is provided as is. To the fullest extent the law allows, we are not liable for loss or harm arising from reliance on information shown on the site, from outages, or from decisions made using it.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Changes and contact</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>We may update these terms. The date below shows the latest version. Questions can be sent through the contact page.</p>
          </div>
        </section>
        <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">Last updated 24 September 2026. This is a plain-language template; have it reviewed by a lawyer before public launch.</p>
      </div>
    </>
  );
}
