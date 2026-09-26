'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { placeOrder } from '@/app/checkout/actions';
import { bySlug } from '@/data/products';
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
  const rows = resolveBag(bag, bySlug);
  const total = rows.reduce((s, r) => s + r.product.price * r.qty, 0);

  if (!hydrated) return <main id="main" className="mx-auto max-w-5xl px-4 pb-16 pt-32"><div className="h-64 animate-pulse bg-stone" aria-hidden /></main>;
  if (rows.length === 0) return (
    <main id="main" className="mx-auto max-w-xl px-4 pb-16 pt-36 text-center">
      <h1 className="display text-4xl">Your bag is empty</h1>
      <Link href="/collection" className="label mt-6 inline-block border border-ink px-6 py-3">Explore the collection</Link>
    </main>
  );

  return (
    <main id="main" className="mx-auto grid max-w-5xl gap-12 px-4 pb-16 pt-32 md:grid-cols-2">
      <form action={action} className="grid gap-4">
        <h1 className="display text-5xl">Checkout</h1>
        {state.error && <p role="alert" className="text-[#9b2c2c]">{state.error}</p>}
        <input type="hidden" name="lines" value={JSON.stringify(rows.map((r) => ({ slug: r.product.slug, qty: r.qty })))} />
        {FIELDS.map(([n, l, ac, type]) => (
          <div key={n} className="grid gap-1"><label className="label" htmlFor={n}>{l}</label><input id={n} name={n} type={type} required maxLength={120} autoComplete={ac} defaultValue={state.values?.[n]} className="border border-ink bg-transparent px-4 py-3" /></div>
        ))}
        <p className="text-sm text-mute">Demo store: no payment is taken and nothing is shipped. The demo account is shared, so please don&apos;t enter real details.</p>
        <PlaceOrderButton total={formatPrice(total)} />
      </form>
      <aside aria-label="Order summary">
        <h2 className="label mb-4">Summary</h2>
        <ul className="divide-y divide-stone border-y border-stone">
          {rows.map(({ product: p, qty }) => (
            <li key={p.slug} className="flex justify-between py-3"><span>{p.name} × {qty}</span><span>{formatPrice(p.price * qty)}</span></li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-lg"><span>Total</span><span>{formatPrice(total)}</span></p>
      </aside>
    </main>
  );
}
