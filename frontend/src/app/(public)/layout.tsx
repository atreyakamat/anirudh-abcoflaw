'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Scale, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg"><Scale className="w-6 h-6" /><span>Law Practice</span></Link>
          <nav className="hidden md:flex items-center gap-1">{navLinks.map((l) => <Link key={l.href} href={l.href} className="px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors">{l.label}</Link>)}</nav>
          <div className="flex items-center gap-2">
            {mounted && <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-accent rounded-lg">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>}
            <Link href="/book" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Book Consultation</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-accent rounded-lg">{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        {menuOpen && <div className="md:hidden border-t bg-background px-4 pb-4">{navLinks.map((l) => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm hover:bg-accent rounded-lg px-3">{l.label}</Link>)}</div>}
      </header>
      <main>{children}</main>
      <footer className="border-t mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div><Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3"><Scale className="w-5 h-5" /><span>Law Practice</span></Link><p className="text-sm text-muted-foreground">Professional legal consultation services.</p></div>
            <div><h3 className="font-medium mb-3">Quick Links</h3><div className="space-y-2">{navLinks.map((l) => <Link key={l.href} href={l.href} className="block text-sm text-muted-foreground hover:text-foreground">{l.label}</Link>)}</div></div>
            <div><h3 className="font-medium mb-3">Services</h3><div className="space-y-2"><p className="text-sm text-muted-foreground">Corporate Law</p><p className="text-sm text-muted-foreground">Family Law</p><p className="text-sm text-muted-foreground">Property Law</p><p className="text-sm text-muted-foreground">Employment Law</p></div></div>
            <div><h3 className="font-medium mb-3">Contact</h3><div className="space-y-2"><p className="text-sm text-muted-foreground">123 Legal Street, Suite 100</p><p className="text-sm text-muted-foreground">Mumbai, India</p><p className="text-sm text-muted-foreground">+91-9876543210</p><p className="text-sm text-muted-foreground">contact@lawpractice.com</p></div></div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Law Practice. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-muted-foreground"><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}