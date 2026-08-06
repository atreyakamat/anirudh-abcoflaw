import type { Metadata } from 'next';
import { Lato, EB_Garamond } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/lib/auth/auth-context';
import { Toaster } from 'sonner';
import './globals.css';

const lato = Lato({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'], 
  variable: '--font-lato',
  display: 'swap',
});

const ebGaramond = EB_Garamond({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-eb-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AB & Co. Legal | Advocate Anirudha Sinai Borkar | Goa',
  description: 'AB & Co. Legal is a boutique law practice in Porvorim, Goa led by Advocate Anirudha Sinai Borkar, specializing in Civil Litigation, Property Law, Corporate Contracts, and Family Law.',
  keywords: ['Lawyer Goa', 'Advocate Porvorim', 'Property Law Goa', 'Civil Litigation Goa', 'Anirudha Sinai Borkar', 'AB & Co Legal'],
  openGraph: {
    title: 'AB & Co. Legal | Legal Advocates & Consultants, Goa',
    description: 'Boutique legal consultation, civil litigation, and corporate counsel in Porvorim, Goa.',
    url: 'https://abcoflaw.com',
    siteName: 'AB & Co. Legal',
    locale: 'en_IN',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'AB & Co. Legal',
  image: 'https://abcoflaw.com/logo.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Porvorim',
    addressLocality: 'North Goa',
    addressRegion: 'Goa',
    postalCode: '403521',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 15.5414,
    longitude: 73.8267,
  },
  url: 'https://abcoflaw.com',
  telephone: '+919876543210',
  priceRange: '₹₹',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${lato.variable} ${ebGaramond.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}