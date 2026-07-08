import type { Metadata } from 'next';
import { Instrument_Serif, Manrope } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Chatbot } from '@/components/chatbot';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });
const displayFont = Instrument_Serif({ subsets: ['latin'], variable: '--font-display', weight: '400' });

export const metadata: Metadata = {
  title: 'Law Practice CRM & Consultation Automation Platform',
  description: 'A premium law practice operating system for consultations, clients, blogs, and audit-ready workflows.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
