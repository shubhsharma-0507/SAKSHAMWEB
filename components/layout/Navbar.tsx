'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, LogIn, Cross, Activity } from 'lucide-react';
import EmergencyModal from '@/components/ui/EmergencyModal';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/find-hospital', label: 'Find Hospital' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/for-hospitals', label: 'For Hospitals' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="SAKSHAM home">
              <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-800 transition-colors">
                <Cross className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-700 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  SAKSHAM
                </div>
                <div className="text-[10px] text-slate-500 font-medium hidden sm:block leading-tight -mt-0.5">
                  Right Hospital. Right Time.
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                id="emergency-help-btn"
                onClick={() => setShowEmergency(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors emergency-pulse"
                aria-label="Get emergency help"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Emergency Help
              </button>
              <Link
                href="/hospital/login"
                id="hospital-login-btn"
                className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Hospital Login
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setShowEmergency(true)}
                className="p-2 bg-red-600 text-white rounded-lg"
                aria-label="Emergency help"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                id="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg" role="menu">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
                <button
                  onClick={() => setShowEmergency(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Emergency Help
                </button>
                <Link
                  href="/hospital/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Hospital Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Emergency Modal */}
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}

      {/* Spacer for fixed nav */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
