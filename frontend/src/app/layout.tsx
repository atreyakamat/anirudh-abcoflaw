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
  variable: '--font-lato' 
});

const ebGaramond = EB_Garamond({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-eb-garamond' 
});

export const metadata: Metadata = {
  title: 'AB & Co. Legal | Advocate Anirudha Sinai Borkar',
  description: 'AB & Co. Legal is a prominent law practice in Goa focusing on civil law, property law, family law, tech contracts, and business consultancy.',
  keywords: ['lawyer', 'legal consultation', 'attorney', 'law practice', 'legal advice', 'Goa', 'Anirudha Sinai Borkar'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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