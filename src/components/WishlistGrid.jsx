'use client';
import Link from 'next/link';
import { bySlug } from '@/data/products';
import { useShop } from '@/store/shop';
import { ProductTile } from './ProductTile';

export function WishlistGrid() {
  const { wishlist, hydrated } = useShop();
  if (!hydrated) return <div className="wgrid" aria-hidden>{[0, 1, 2].map((i) => <div key={i} className="skel" />)}</div>;
  const items = wishlist.flatMap((s) => { const p = bySlug(s); return p ? [p] : []; });
  if (items.length === 0) return (
    <div className="empty"><p className="serif">Nothing saved yet</p>
      <Link href="/collection" className="btn"><span>Explore the collection</span></Link></div>
  );
  return <div className="wgrid">{items.map((p) => <ProductTile key={p.slug} product={p} />)}</div>;
}
