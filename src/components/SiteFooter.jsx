'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND } from '@/data/brand';
import { FooterGreeting } from './FooterGreeting';

// A compact footer for every page except the home page (which ends with its own large footer).
export function SiteFooter() {
  if (usePathname() === '/') return null;
  return (
    <footer className="foot2">
      <div className="wrap">
        <span className="serif">{BRAND.name}</span>
        <nav aria-label="Footer"><Link href="/collection">Collection</Link><Link href="/wishlist">Wishlist</Link><Link href="/#making">Our process</Link><Link href="/about">About us</Link><Link href="/privacy">Privacy</Link><Link href="/returns">Returns</Link></nav>
        <FooterGreeting />
        <p>© 2026 {BRAND.name}. A portfolio project: products are not for sale.</p>
      </div>
    </footer>
  );
}
