import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ClearBagOnMount } from '@/components/ClearBagOnMount';

export const metadata = { title: 'Order' };

export default async function OrderPage({
  params,
  searchParams,
}) {
  const { id } = await params;
  // Defence in depth: middleware already guards /account*, but a server client
  // must never be constructed without a project.
  if (!isSupabaseConfigured) redirect('/login');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/orders/${id}`);
  // RLS lets a user read only their own orders, so another user's id returns null → 404.
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  if (!order) notFound();
  const items = order.items;
  const a = order.address;

  // Only the redirect straight out of placeOrder carries ?placed=1. Revisiting
  // this same URL later (from /account/orders, a bookmark, or a page refresh)
  // must NOT re-run the "just placed" behaviour: ClearBagOnMount would wipe
  // out whatever the signed-in bag holds now, clobbering it with a later
  // add's qty-1 upsert.
  const { placed } = await searchParams;
  const justPlaced = placed === '1';

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 pb-16 pt-32">
      {justPlaced && <ClearBagOnMount />}
      {justPlaced ? (
        <>
          <p className="label text-gold-ink">Thank you</p>
          <h1 className="display mt-2 text-5xl">Order placed</h1>
        </>
      ) : (
        <h1 className="display text-5xl">Order details</h1>
      )}
      <ul className="mt-8 divide-y divide-stone border-y border-stone">
        {items.map((i) => <li key={i.slug} className="flex justify-between py-3"><span>{i.name} × {i.qty}</span><span>{formatPrice(i.unitPrice * i.qty)}</span></li>)}
      </ul>
      <p className="mt-4 flex justify-between text-lg"><span>Total</span><span>{formatPrice(order.total)}</span></p>
      <p className="mt-6 text-mute">Ships to {a.name}, {a.line1}, {a.city} {a.postcode}</p>
      <Link href="/collection" className="label mt-8 inline-block border border-ink px-6 py-3 hover:bg-gold">Keep shopping</Link>
    </main>
  );
}
