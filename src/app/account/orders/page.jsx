import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata = { title: 'Order history' };

export default async function Orders() {
  // Defence in depth: middleware already guards /account*, but a server client
  // must never be constructed without a project.
  if (!isSupabaseConfigured) redirect('/login');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account/orders');
  const { data: orders } = await supabase.from('orders').select('id, total, created_at').order('created_at', { ascending: false });
  return (
    <main id="main" className="pg narrow">
      <span className="eyebrow">Account</span>
      <h1 className="serif pgh">Order history</h1>
      {!orders?.length ? <p className="muted lede">No orders yet.</p> : (
        <ul className="rows">
          {orders.map((o) => (
            <li key={o.id}><Link href={`/account/orders/${o.id}`} className="rowlink">
              <span>{new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' })}</span><span>{formatPrice(o.total)}</span></Link></li>
          ))}
        </ul>
      )}
    </main>
  );
}
