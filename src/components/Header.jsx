'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRAND } from '@/data/brand';
import { Dialog } from './Dialog';
import { useUI } from '@/store/ui';
import { useShop } from '@/store/shop';
import { bagCount } from '@/lib/bag';

const NAV = [{ href: '/collection', label: 'Collection' }, { href: '/#contact', label: 'Contact' }];

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const { menuOpen, setMenu, bagOpen, setBag, searchOpen, setSearch } = useUI();
  const count = useShop((s) => (s.hydrated ? bagCount(s.bag) : 0));
  const wishCount = useShop((s) => (s.hydrated ? s.wishlist.length : 0));

  useEffect(() => {
    const el = document.getElementById('top-sentinel');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const solid = !overHero || scrolled;
  return (
    <>
      <div id="top-sentinel" className="absolute top-0 h-px w-px" aria-hidden />
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? 'border-b border-stone bg-ivory text-ink' : 'bg-transparent text-ivory'}`}>
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4">
          <div className="flex min-w-0 items-center gap-6">
            <button className="label md:hidden" onClick={() => setMenu(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen}>Menu</button>
            <nav className="hidden gap-6 md:flex" aria-label="Primary">
              {NAV.map((n) => <Link key={n.href} href={n.href} className="label hover:underline underline-offset-8">{n.label}</Link>)}
            </nav>
          </div>
          <Link href="/" className="display text-center text-[1.75rem] md:text-3xl">{BRAND.name}</Link>
          <div className="flex min-w-0 items-center justify-end gap-3 md:gap-5">
            <button className="label" onClick={() => setSearch(true)} aria-haspopup="dialog" aria-expanded={searchOpen}>Search</button>
            <Link href="/account" className="label hidden md:inline">Account</Link>
            <Link href="/wishlist" className="label hidden md:inline">Wishlist{wishCount > 0 && ` (${wishCount})`}</Link>
            <button className="label" onClick={() => setBag(true)} aria-haspopup="dialog" aria-expanded={bagOpen}>Bag{count > 0 && ` (${count})`}</button>
          </div>
        </div>
      </header>
      <Dialog open={menuOpen} onClose={() => setMenu(false)} label="Menu" className="sheet">
        <button className="label absolute right-4 top-4 text-ink" onClick={() => setMenu(false)}>Close</button>
        <nav className="flex flex-col gap-6 p-8" aria-label="Mobile">
          {[...NAV, { href: '/account', label: 'Account' }, { href: '/wishlist', label: `Wishlist${wishCount > 0 ? ` (${wishCount})` : ''}` }].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="display text-3xl">{n.label}</Link>
          ))}
        </nav>
      </Dialog>
    </>
  );
}
