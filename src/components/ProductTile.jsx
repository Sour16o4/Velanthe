'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { bagItem, bagKey } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';
import { HeartButton } from './HeartButton';

// One product card: render, category, name, blurb, price, and the round bag button that adds it.
export function ProductTile({ product: p, className = '', priority = false }) {
  const add = useShop((s) => s.add);
  const say = useUI((s) => s.say);
  const bagSize = useShop((s) => Object.values(s.bag).reduce((a, b) => a + b, 0));
  const [sizeKey, setSizeKey] = useState(''); // '' = small size, 'l' = large; each size is its own line in the bag
  const key = bagKey(p.slug, sizeKey);
  const item = bagItem(key);
  const inBag = useShop((s) => s.bag[key] || 0);
  const [hit, setHit] = useState(0);
  return (
    <article className={`pc ${className}`}>
      <HeartButton slug={p.slug} />
      <Link href={`/product/${p.slug}`} className="pf" aria-label={`${p.name}, ${formatPrice(p.price)}`}>
        <Image src={p.image} alt="" width={700} height={900} sizes="(min-width:900px) 28vw, 50vw" priority={priority} />
      </Link>
      <div className="pi">
        <span className="eyebrow">{p.category}</span>
        <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        <p>{p.blurb}</p>
        <div className="tsizes" role="group" aria-label={`${p.name} size`}>
          {p.sizes.map((s) => (
            <button key={s.key} type="button" className="tsz" aria-pressed={s.key === sizeKey} onClick={() => setSizeKey(s.key)}>{s.label}</button>
          ))}
        </div>
        <div className="pb">
          <span className="pr">{formatPrice(item.price)}</span>
          <button type="button" className="add" aria-label={`Add ${item.name} to bag${inBag ? `, ${inBag} in bag` : ''}`}
            onClick={(e) => { add(key); setHit((h) => h + 1); const n = bagSize + 1; say(`${item.name} added. ${n} ${n === 1 ? 'item' : 'items'} in your bag`); }}>
            {hit > 0 && <i key={`r${hit}`} className="rip" aria-hidden="true" />}
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /><path d="M12 12v4M10 14h4" /></svg>
            {inBag > 0 && <b key={`c${inBag}`} className="cnt" aria-hidden="true">{inBag}</b>}
          </button>
        </div>
      </div>
    </article>
  );
}
