import Link from 'next/link';
import { BRAND } from '@/data/brand';

export function Footer() {
  return (
    <footer id="contact" className="mt-24 border-t border-stone bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-3">
        <div><p className="display text-3xl">{BRAND.name}</p><p className="mt-2 text-mute">{BRAND.tagline}</p></div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <Link href="/collection">Collection</Link><Link href="/wishlist">Wishlist</Link>
        </nav>
        <p className="text-sm text-mute">hello@example.com · A portfolio project. No real products are sold.</p>
      </div>
    </footer>
  );
}
