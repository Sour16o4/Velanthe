'use client';
import Link from 'next/link';
import { bySlug } from '@/data/products';
import { useShop } from '@/store/shop';
import { ProductCard } from './ProductCard';
import { AddToBagButton } from './AddToBagButton';

export function WishlistGrid() {
  const { wishlist, hydrated } = useShop();
  if (!hydrated) return <div className="grid grid-cols-2 gap-6 lg:grid-cols-4" aria-hidden>{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-stone" />)}</div>;
  const items = wishlist.flatMap((s) => { const p = bySlug(s); return p ? [p] : []; });
  if (items.length === 0) return (
    <div className="py-24 text-center"><p className="display text-3xl">Nothing saved yet</p>
      <Link href="/collection" className="label mt-6 inline-block border border-ink px-6 py-3">Explore the collection</Link></div>
  );
  return <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.slug} product={p} actions={<AddToBagButton slug={p.slug} variant="icon" />} />)}</div>;
}
