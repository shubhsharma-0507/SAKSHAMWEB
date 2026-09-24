import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Privacy Policy — SAKSHAM',
  description: 'How SAKSHAM handles your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="How SAKSHAM handles your information." />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Summary</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>SAKSHAM collects as little as it can. Patients can search for hospitals without creating an account. Hospital administrators create an account so they can manage their listing.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Information we collect</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>Location: when you allow it, your device location is sent to our server to calculate distance to hospitals. We do not store it. If you type a place name instead, that text is sent to the OpenStreetMap Nominatim service to find coordinates.</p>
            <p>Hospital administrators: your name, work email and a password (stored only as a salted hash), plus the hospital details you enter: name, address, phone numbers, map coordinates, and availability data. Hospital details are public by design.</p>
            <p>Contact form: the name, email and message you send us.</p>
            <p>Technical data: a sign-in cookie for hospital administrators, and standard server logs such as IP address and request time.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">How we use it</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>To rank and display hospitals, to run hospital accounts, to answer your messages, and to keep the service secure. We do not sell personal information and we do not show advertising.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Third-party services</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>Maps are provided by OpenStreetMap contributors. Address search uses Nominatim, and map tiles load from OpenStreetMap servers, which will see your IP address. Database hosting is provided by MongoDB Atlas. Each of these operates under its own privacy policy.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Cookies</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>We set one cookie, saksham_token, when a hospital administrator signs in. It is HTTP-only and expires after 7 days. We do not use advertising or analytics cookies.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Retention and your choices</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>Hospital accounts are kept until the hospital asks us to delete them. Contact messages are kept as long as needed to respond. You can ask to see, correct or delete your data through the contact page.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Changes</h2>
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>If we change this policy we will update the date below. Continued use of SAKSHAM means you accept the updated policy.</p>
          </div>
        </section>
        <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">Last updated 24 September 2026. This is a plain-language template; have it reviewed by a lawyer before public launch.</p>
      </div>
    </>
  );
}
