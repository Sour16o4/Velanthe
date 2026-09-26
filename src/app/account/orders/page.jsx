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
    <main id="main" className="mx-auto max-w-2xl px-4 pb-16 pt-32">
      <h1 className="display text-5xl">Order history</h1>
      {!orders?.length ? <p className="mt-8 text-mute">No orders yet.</p> : (
        <ul className="mt-8 divide-y divide-stone border-y border-stone">
          {orders.map((o) => (
            <li key={o.id}><Link href={`/account/orders/${o.id}`} className="flex justify-between py-4">
              <span>{new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' })}</span><span>{formatPrice(o.total)}</span></Link></li>
          ))}
        </ul>
      )}
    </main>
  );
}
