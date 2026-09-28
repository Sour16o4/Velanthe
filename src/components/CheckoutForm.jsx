'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { placeOrder } from '@/app/checkout/actions';
import { bagItem } from '@/data/products';
import { resolveBag } from '@/lib/bag';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/store/shop';
import { PlaceOrderButton } from './PlaceOrderButton';

const FIELDS = [
  ['name', 'Full name', 'name', 'text'],
  ['line1', 'Address', 'street-address', 'text'],
  ['city', 'City', 'address-level2', 'text'],
  ['postcode', 'Postcode', 'postal-code', 'text'],
  ['phone', 'Phone', 'tel', 'tel'],
];

export function CheckoutForm() {
  const [state, action] = useActionState(placeOrder, {});
  const { bag, hydrated } = useShop();
  const rows = resolveBag(bag, bagItem);
  const total = rows.reduce((s, r) => s + r.product.price * r.qty, 0);

  if (!hydrated) return <main id="main" className="pg"><div className="skel" aria-hidden /></main>;
  if (rows.length === 0) return (
    <main id="main" className="pg empty">
      <h1 className="serif pgh">Your bag is <em>empty</em></h1>
      <Link href="/collection" className="btn"><span>Explore the collection</span></Link>
    </main>
  );

  return (
    <main id="main" className="pg two">
      <form action={action} className="fgrid">
        <span className="eyebrow">Almost there</span>
        <h1 className="serif pgh">Checkout</h1>
        {state.error && <p role="alert" className="err">{state.error}</p>}
        {FIELDS.map(([n, l, ac, type]) => (
          <div key={n} className="fgrid tight"><label className="eyebrow" htmlFor={n}>{l}</label><input id={n} name={n} type={type} required maxLength={120} autoComplete={ac} defaultValue={state.values?.[n]} className="fld" /></div>
        ))}
        <p className="muted small">Demo store: no payment is taken and nothing is shipped. The demo account is shared, so please don&apos;t enter real details.</p>
        <PlaceOrderButton total={formatPrice(total)} />
      </form>
      <aside aria-label="Order summary">
        <h2 className="eyebrow sumh">Summary</h2>
        <ul className="rows">
          {rows.map(({ product: p, qty }) => (
            <li key={p.slug}><span>{p.name} × {qty}</span><span>{formatPrice(p.price * qty)}</span></li>
          ))}
        </ul>
        <p className="sub"><span>Total</span><span>{formatPrice(total)}</span></p>
      </aside>
    </main>
  );
}
