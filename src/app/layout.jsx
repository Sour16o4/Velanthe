import { Cormorant_Garamond, Inter } from 'next/font/google';
import { BRAND } from '@/data/brand';
import { StoreProvider } from '@/components/StoreProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BagDrawer } from '@/components/BagDrawer';
import { SearchDialog } from '@/components/SearchDialog';
import { LiveRegion } from '@/components/LiveRegion';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '500'], variable: '--font-cormorant' });
const sans = Inter({ subsets: ['latin'], variable: '--font-inter' });

// `||` (not `??`): README's `cp .env.example .env.local` leaves this as `""`,
// which `??` would happily pass to `new URL` and crash every page.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'http://localhost:3000';
const siteUrl = /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: `${BRAND.name}: luxury skincare, quietly perfected.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-4 focus:py-2">Skip to content</a>
        <StoreProvider>
          <Header />
          <BagDrawer />
          <SearchDialog />
          <LiveRegion />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
