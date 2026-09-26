'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/data/products';
import { searchProducts } from '@/lib/search';
import { formatPrice } from '@/lib/format';
import { useUI } from '@/store/ui';
import { Dialog } from './Dialog';

export function SearchDialog() {
  const { searchOpen, setSearch } = useUI();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef(null);
  const results = useMemo(() => searchProducts(q, products), [q]);

  useEffect(() => { if (searchOpen) { setQ(''); setSel(0); requestAnimationFrame(() => input.current?.focus()); } }, [searchOpen]);

  const go = (slug) => { setSearch(false); router.push(`/product/${slug}`); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[sel]) go(results[sel].slug);
  };

  return (
    <Dialog open={searchOpen} onClose={() => setSearch(false)} label="Search" className="sheet">
      <div className="mx-auto max-w-2xl p-6">
        <label htmlFor="q" className="label">Search</label>
        <input id="q" ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey}
          role="combobox" aria-autocomplete="list" aria-expanded={results.length > 0} aria-controls="results" aria-activedescendant={results[sel] ? `r-${results[sel].slug}` : undefined}
          className="display mt-2 w-full border-b border-ink bg-transparent pb-2 text-3xl" autoComplete="off" />
        <ul id="results" role="listbox" className="mt-4">
          {results.map((p, i) => (
            <li key={p.slug} id={`r-${p.slug}`} role="option" aria-selected={i === sel}>
              <Link href={`/product/${p.slug}`} onClick={() => setSearch(false)} tabIndex={-1} className={`flex justify-between py-3 ${i === sel ? 'bg-stone px-2' : ''}`}>
                <span>{p.name}</span><span className={i === sel ? 'text-ink' : 'text-mute'}>{formatPrice(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
        {q.trim() && results.length === 0 && <p className="py-6 text-mute" role="status">Nothing here but beauty awaits. Try “serum” or “ceramides”.</p>}
      </div>
    </Dialog>
  );
}
