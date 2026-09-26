'use client';
import Link from 'next/link';
import Image from 'next/image';
import { bySlug } from '@/data/products';
import { bagCount, resolveBag, MAX_QTY } from '@/lib/bag';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';
import { Dialog } from './Dialog';

export function BagDrawer() {
  const { bagOpen, setBag } = useUI();
  const { bag, setQty, hydrated } = useShop();
  const rows = resolveBag(bag, bySlug);
  const total = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  return (
    <Dialog open={bagOpen} onClose={() => setBag(false)} label="Shopping bag" className="drawer">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-stone p-5">
          <h2 className="display text-3xl">Your bag ({bagCount(bag)})</h2>
          <button className="label" onClick={() => setBag(false)}>Close</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {!hydrated ? <div className="h-24 animate-pulse bg-stone" aria-hidden />
            : rows.length === 0 ? (
              <div className="py-16 text-center"><p className="display text-[1.75rem]">Your bag is empty</p>
                <Link href="/collection" onClick={() => setBag(false)} className="label mt-6 inline-block border border-ink px-6 py-3">Explore the collection</Link></div>
            ) : (
              <ul className="divide-y divide-stone">
                {rows.map(({ product: p, qty }) => (
                  <li key={p.slug} className="flex gap-4 py-4">
                    <div className="relative h-24 w-20 shrink-0 bg-stone"><Image src={p.images[0]} alt="" fill sizes="80px" className="object-cover" /></div>
                    <div className="flex-1">
                      <p>{p.name}</p><p className="text-mute">{formatPrice(p.price)}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <button aria-label={`Decrease ${p.name}`} onClick={() => setQty(p.slug, qty - 1)} className="h-8 w-8 border border-ink">−</button>
                        <span aria-live="polite">{qty}</span>
                        <button aria-label={`Increase ${p.name}`} disabled={qty >= MAX_QTY} onClick={() => setQty(p.slug, qty + 1)} className="h-8 w-8 border border-ink disabled:opacity-40">+</button>
                        <button onClick={() => setQty(p.slug, 0)} className="label ml-auto underline">Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
        {rows.length > 0 && (
          <div className="border-t border-stone p-5">
            <p className="mb-4 flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></p>
            <Link href="/checkout" onClick={() => setBag(false)} className="label block bg-ink px-6 py-4 text-center text-ivory hover:bg-gold hover:text-ink">Checkout</Link>
          </div>
        )}
      </div>
    </Dialog>
  );
}
