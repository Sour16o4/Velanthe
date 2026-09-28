import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { canCancel } from '@/lib/order';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ClearBagOnMount } from '@/components/ClearBagOnMount';
import { CancelOrderButton } from '@/components/CancelOrderButton';

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
    <main id="main" className="pg narrow">
      {justPlaced && <ClearBagOnMount />}
      {justPlaced ? (
        <>
          <span className="eyebrow">Thank you</span>
          <h1 className="serif pgh">Order placed</h1>
        </>
      ) : (
        <>
          <span className="eyebrow">Account</span>
          <h1 className="serif pgh">Order details</h1>
        </>
      )}
      <span className={`status ${order.status}`}>{order.status === 'cancelled' ? 'Cancelled' : 'Placed'}</span>
      <ul className="rows">
        {items.map((i) => <li key={i.slug}><span>{i.name} × {i.qty}</span><span>{formatPrice(i.unitPrice * i.qty)}</span></li>)}
      </ul>
      <p className="sub"><span>Total</span><span>{formatPrice(order.total)}</span></p>
      <p className="muted lede">Ships to {a.name}, {a.line1}, {a.city} {a.postcode}</p>
      <div className="btnrow">
        <Link href="/collection" className="btn"><span>Keep shopping</span></Link>
        {canCancel(order.status) && <CancelOrderButton orderId={order.id} />}
      </div>
    </main>
  );
}
