'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Scale, Menu, X, Sun, Moon, MapPin, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { FloatingChatbot } from '@/components/floating-chatbot';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-20 px-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl font-serif text-primary group">
            <div className="p-2 rounded-lg bg-yellow-600/10 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
              <Scale className="w-6 h-6" />
            </div>
            <span>AB & Co. Legal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            )}
            <Link href="/book" className="hidden sm:flex px-6 py-2.5 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors shadow-sm">
              Book Consultation
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 space-y-1 shadow-lg absolute w-full">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-4">
                {l.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setMenuOpen(false)} className="block mt-4 text-center w-full py-3 bg-yellow-600 text-white rounded-lg font-bold">
              Book Consultation
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="border-t bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center gap-3 font-bold text-xl font-serif text-primary mb-4">
                <Scale className="w-6 h-6 text-yellow-600" />
                <span>AB & Co. Legal</span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Curated, comprehensive legal solutions by Advocate Anirudha Sinai Borkar. Defending rights and securing futures across Goa.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-bold mb-4 font-serif text-lg">Quick Links</h3>
              <div className="space-y-3">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="block text-sm text-slate-500 hover:text-yellow-600 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="font-bold mb-4 font-serif text-lg">Expertise</h3>
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Strategic Litigation</p>
                <p className="text-sm text-slate-500">Dispute Resolution</p>
                <p className="text-sm text-slate-500">Advisory & Consultancy</p>
                <p className="text-sm text-slate-500">Notary Services</p>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="font-bold mb-4 font-serif text-lg">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-500">
                  <MapPin className="w-5 h-5 text-yellow-600 shrink-0" />
                  <p>Porvorim, Goa<br/>India</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Mail className="w-5 h-5 text-yellow-600 shrink-0" />
                  <p>hello@abcoflaw.in</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} AB & Co. Legal. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-yellow-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-yellow-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
      <FloatingChatbot />
    </div>
  );
}