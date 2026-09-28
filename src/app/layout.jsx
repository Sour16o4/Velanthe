import { Cormorant_Garamond, Jost } from 'next/font/google';
import { BRAND } from '@/data/brand';
import { StoreProvider } from '@/components/StoreProvider';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { BagDrawer } from '@/components/BagDrawer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Toast } from '@/components/Toast';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], variable: '--font-cormorant' });
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-jost' });

// `||` (not `??`): copying .env.example leaves this as "", which `??` would pass to `new URL` and crash every page.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'http://localhost:3000';
const siteUrl = /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: `${BRAND.name}: luxury skincare made honestly. Rose, lavender, calendula and cold-pressed oils, blended slowly.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        <StoreProvider>
          <ScrollProgress />
          <Header />
          <BagDrawer />
          {children}
          <SiteFooter />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
