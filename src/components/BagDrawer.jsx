'use client';
import Link from 'next/link';
import Image from 'next/image';
import { bagItem } from '@/data/products';
import { bagCount, resolveBag, MAX_QTY } from '@/lib/bag';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';
import { Dialog } from './Dialog';

export function BagDrawer() {
  const { bagOpen, setBag } = useUI();
  const { bag, setQty, hydrated } = useShop();
  const rows = resolveBag(bag, bagItem);
  const total = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  return (
    <Dialog open={bagOpen} onClose={() => setBag(false)} label="Shopping bag" className="drawer">
      <div className="dcol">
        <div className="dhead">
          <div>
            <p className="eyebrow">Order summary</p>
            <h2 className="serif">Your bag</h2>
          </div>
          <button type="button" className="dx" aria-label="Close bag" onClick={() => setBag(false)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" /></svg>
          </button>
        </div>
        <div className="dbody">
          {!hydrated ? <div className="skel short" aria-hidden />
            : rows.length === 0 ? (
              <div className="empty"><p className="serif">Your bag is empty</p>
                <Link href="/collection" onClick={() => setBag(false)} className="btn"><span>Explore the collection</span></Link></div>
            ) : (
              <ul className="rows">
                {rows.map(({ product: p, qty }) => (
                  <li key={p.slug} className="bagline">
                    <Link href={`/product/${p.baseSlug}`} onClick={() => setBag(false)} className="thumb" tabIndex={-1} aria-hidden="true">
                      <Image src={p.image} alt="" width={80} height={103} />
                    </Link>
                    <div>
                      <Link href={`/product/${p.baseSlug}`} onClick={() => setBag(false)} className="nm">{p.name}</Link>
                      <div className="unit">
                        <button type="button" aria-label={`Decrease ${p.name}`} onClick={() => setQty(p.slug, qty - 1)}>−</button>
                        <span aria-live="polite">{qty} × {formatPrice(p.price)}</span>
                        <button type="button" aria-label={`Increase ${p.name}`} disabled={qty >= MAX_QTY} onClick={() => setQty(p.slug, qty + 1)}>+</button>
                      </div>
                    </div>
                    <div className="amt">
                      <span>{formatPrice(p.price * qty)}</span>
                      <button type="button" className="dtext" onClick={() => setQty(p.slug, 0)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
        {rows.length > 0 && (
          <div className="dfoot">
            <dl className="dsum">
              <div><dt>Subtotal</dt><dd>{formatPrice(total)}</dd></div>
              <div><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
            </dl>
            <Link href="/checkout" onClick={() => setBag(false)} className="btn p wide dgo"><span>Checkout</span><span>{formatPrice(total)} →</span></Link>
          </div>
        )}
      </div>
    </Dialog>
  );
}
