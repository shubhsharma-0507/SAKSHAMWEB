import Link from 'next/link';
import { Cross, Phone, Shield, AlertTriangle } from 'lucide-react';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/find-hospital', label: 'Find Hospital' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/for-hospitals', label: 'For Hospitals' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  SAKSHAM
                </div>
                <div className="text-xs text-blue-400 font-medium">Right Hospital. Right Time. Saves Lives.</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              SAKSHAM helps patients and attendants find the most suitable hospital during a medical emergency — based on actual emergency capabilities, availability, and proximity.
            </p>
            {/* Emergency disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-800/40 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs text-red-300 leading-relaxed">
                <strong>For immediate life-threatening emergencies, call your local emergency services first.</strong> SAKSHAM is a hospital discovery tool, not a substitute for emergency services.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Hospitals */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hospitals</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/for-hospitals" className="text-sm text-slate-400 hover:text-white transition-colors">
                  For Hospitals
                </Link>
              </li>
              <li>
                <Link href="/hospital/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Hospital Login
                </Link>
              </li>
              <li>
                <Link href="/hospital/signup" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Register Hospital
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Legal</h3>
              <ul className="space-y-2">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SAKSHAM. Hospital information platform.
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hospital availability depends on hospital-reported data. Always verify directly with the hospital.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
