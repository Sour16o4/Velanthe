'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/data/brand';
import { bagCount } from '@/lib/bag';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';
import { Dialog } from './Dialog';
import { HeaderSearch } from './HeaderSearch';

const LINKS = [
  { href: '/#making', label: 'Our process' },
  { href: '/#ing', label: 'Ingredients' },
  { href: '/collection', label: 'Collection' },
];

// The floating pill navigation. It slides away while you scroll down and returns when you scroll up.
export function Header() {
  const { menuOpen, setMenu, bagOpen, setBag, searchOpen, setSearch } = useUI();
  const count = useShop((s) => (s.hydrated ? bagCount(s.bag) : 0));
  const wishCount = useShop((s) => (s.hydrated ? s.wishlist.length : 0));
  const [away, setAway] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const lastY = useRef(0);
  const lastCount = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAway(y > lastY.current && y > 600);
      setScrolled(y > 24);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A little bounce on the bag button whenever something is added.
  useEffect(() => {
    if (count > lastCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 900);
      lastCount.current = count;
      return () => clearTimeout(t);
    }
    lastCount.current = count;
    return undefined;
  }, [count]);

  return (
    <>
      <nav className={`nav${away ? ' away' : ''}${searchOpen ? ' searching' : ''}${scrolled ? ' scrolled' : ''}`} aria-label="Primary">
        <Link className="lg" href="/" data-go="#top" onClick={() => setMenu(false)}>{BRAND.name}</Link>
        {searchOpen ? <HeaderSearch /> : (
          <>
            {LINKS.map((l) => <Link key={l.href} className="l" href={l.href} data-go={l.href.startsWith('/#') ? l.href.slice(1) : undefined} onClick={() => setMenu(false)}>{l.label}</Link>)}
            <button type="button" className="l" onClick={() => setSearch(true)} aria-expanded={searchOpen}>Search</button>
            <Link className="l" href="/wishlist">Wishlist{wishCount > 0 && ` (${wishCount})`}</Link>
            <Link className="l" href="/account">Account</Link>
            <button type="button" className="menubtn" onClick={() => setMenu(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen}>Menu</button>
            <button type="button" className={`bagbtn${bump ? ' bump' : ''}`} onClick={() => setBag(true)} aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`} aria-haspopup="dialog" aria-expanded={bagOpen}>
              Bag <b>{count}</b>
            </button>
          </>
        )}
      </nav>

      <Dialog open={menuOpen} onClose={() => setMenu(false)} label="Menu" className="sheet">
        <button type="button" className="dclose" onClick={() => setMenu(false)}>Close</button>
        <div className="mnav">
          <Link href="/" data-go="#top" onClick={() => setMenu(false)}>Home</Link>
          {LINKS.map((l) => <Link key={l.href} href={l.href} data-go={l.href.startsWith('/#') ? l.href.slice(1) : undefined} onClick={() => setMenu(false)}>{l.label}</Link>)}
          <button type="button" onClick={() => { setMenu(false); setSearch(true); }}>Search</button>
          <Link href="/wishlist" onClick={() => setMenu(false)}>Wishlist{wishCount > 0 && ` (${wishCount})`}</Link>
          <Link href="/account" onClick={() => setMenu(false)}>Account</Link>
        </div>
      </Dialog>
    </>
  );
}
