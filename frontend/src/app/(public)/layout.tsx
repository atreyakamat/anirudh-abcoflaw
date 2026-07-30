'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Scale, Menu, X, Sun, Moon, MapPin, Mail, ShieldCheck, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { FloatingChatbot } from '@/components/floating-chatbot';
import { SITE_CONFIG } from '@/lib/config/site-config';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Practice Areas' },
  { href: '/blog', label: 'Legal Insights' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/portal', label: 'Client Portal' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const schemaOrgData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LegalService',
        '@id': 'https://abco.legal/#service',
        'name': SITE_CONFIG.firmName,
        'url': 'https://abco.legal',
        'logo': 'https://abco.legal/icon.svg',
        'image': 'https://abco.legal/profilepic.jpg',
        'telephone': SITE_CONFIG.contact.phone,
        'email': SITE_CONFIG.contact.email,
        'priceRange': SITE_CONFIG.consultation.fee,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Porvorim',
          'addressRegion': 'Goa',
          'postalCode': '403521',
          'addressCountry': 'IN',
        },
        'areaServed': [
          { '@type': 'AdministrativeArea', 'name': 'Goa' },
          { '@type': 'City', 'name': 'Porvorim' },
          { '@type': 'City', 'name': 'Panaji' },
        ],
        'founder': {
          '@type': 'Person',
          'name': SITE_CONFIG.lawyerName,
          'jobTitle': SITE_CONFIG.lawyerTitle,
          'alumniOf': [
            { '@type': 'EducationalOrganization', 'name': 'Salgaonkar College of Law, Goa' },
            { '@type': 'EducationalOrganization', 'name': 'University of Aberdeen, UK' },
          ],
          'knowsLanguage': SITE_CONFIG.credentials.languages,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-20 px-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-lg sm:text-xl font-serif text-primary group shrink-0">
            <div className="p-2 rounded-lg bg-yellow-600/10 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors shrink-0">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">{SITE_CONFIG.firmName}</span>
              <span className="text-[10px] text-slate-500 font-sans tracking-wide font-normal">{SITE_CONFIG.location}</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            )}
            
            <Link href="/portal" className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm">
              <Lock className="w-3.5 h-3.5 text-yellow-500" />
              <span>Portal</span>
            </Link>

            <Link href="/book" className="hidden md:flex px-4 py-2 bg-yellow-600 text-white rounded-lg text-xs font-bold hover:bg-yellow-500 transition-colors shadow-sm uppercase tracking-wider">
              Request Appointment
            </Link>
            
            <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer" aria-label="Toggle Navigation Menu">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="xl:hidden border-t bg-background px-4 py-4 space-y-1 shadow-2xl absolute top-full left-0 right-0 w-full z-50 max-h-[85vh] overflow-y-auto">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-4 text-slate-800 dark:text-slate-200">
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link href="/portal" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-yellow-500" />
                <span>Client Portal</span>
              </Link>
              <Link href="/book" onClick={() => setMenuOpen(false)} className="block text-center w-full py-2.5 bg-yellow-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider">
                Request Appointment
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="border-t bg-slate-950 text-slate-300">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-3 font-bold text-xl font-serif text-white">
                <Scale className="w-6 h-6 text-yellow-500" />
                <span>{SITE_CONFIG.firmName}</span>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed">
                Advocate Anirudha Sinai Borkar. Providing legal representation, property conveyancing, succession guidance, and business advisory across Goa.
              </p>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-yellow-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Rule 36 Compliance Statement</span>
                </p>
                <p>{SITE_CONFIG.bciDisclaimer.headerBanner}</p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-bold mb-4 font-serif text-sm text-white uppercase tracking-wider">Navigation</h3>
              <div className="space-y-2.5">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="block text-xs text-slate-400 hover:text-yellow-500 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="font-bold mb-4 font-serif text-sm text-white uppercase tracking-wider">Practice Areas</h3>
              <div className="space-y-2.5">
                {SITE_CONFIG.practiceAreas.map((pa) => (
                  <Link key={pa.slug} href="/services" className="block text-xs text-slate-400 hover:text-yellow-500 transition-colors">
                    {pa.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-bold font-serif text-sm text-white uppercase tracking-wider">Office Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p>{SITE_CONFIG.contact.address}</p>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Mail className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p>{SITE_CONFIG.contact.email}</p>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-900">
                <p><strong className="text-slate-300">Office Hours:</strong> {SITE_CONFIG.contact.officeHours}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} {SITE_CONFIG.firmName}. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-yellow-500 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </footer>
      <FloatingChatbot />
    </div>
  );
}