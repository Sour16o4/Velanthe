'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { searchProducts } from '@/lib/search';
import { formatPrice } from '@/lib/format';
import { useUI } from '@/store/ui';

// The search bar that opens inside the header pill. Results drop down under it as a glass panel.
export function HeaderSearch() {
  const setSearch = useUI((s) => s.setSearch);
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef(null);
  const box = useRef(null);
  const results = useMemo(() => searchProducts(q, products), [q]);
  const close = () => setSearch(false);

  useEffect(() => { input.current?.focus(); }, []);
  // Going to another page closes the search (but not the moment it opens).
  const startPath = useRef(pathname);
  useEffect(() => { if (pathname !== startPath.current) close(); }, [pathname]);
  // A click or tap anywhere outside the header closes it.
  useEffect(() => {
    const onDown = (e) => { if (box.current && !box.current.closest('.nav').contains(e.target)) close(); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const go = (slug) => { close(); router.push(`/product/${slug}`); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[sel]) go(results[sel].slug);
  };

  return (
    <div className="hsearch" ref={box} role="search">
      <svg className="sicon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" strokeLinecap="round" /></svg>
      <label htmlFor="q" className="sr-only">Search products</label>
      <input id="q" ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey}
        role="combobox" aria-autocomplete="list" aria-expanded={results.length > 0} aria-controls="results" aria-activedescendant={results[sel] ? `r-${results[sel].slug}` : undefined}
        placeholder="Search serums, creams, ingredients, skin type" autoComplete="off" spellCheck={false} />
      <button type="button" className="sclose" onClick={close} aria-label="Close search">Close</button>

      {q.trim() && (
        <div className="sres">
          <ul id="results" role="listbox" aria-label="Search results">
            {results.map((p, i) => (
              <li key={p.slug} role="presentation">
                <Link id={`r-${p.slug}`} role="option" aria-selected={i === sel} href={`/product/${p.slug}`} tabIndex={-1} className={i === sel ? 'on' : ''} onClick={close}>
                  <span>{p.name}</span><span className="pr">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          {results.length === 0 && <p className="muted nores" role="status">Nothing here but beauty awaits. Try “serum”, “dry skin” or “lavender”.</p>}
        </div>
      )}
    </div>
  );
}
