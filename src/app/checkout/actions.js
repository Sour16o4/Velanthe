'use server';
import { redirect } from 'next/navigation';
import { bySlug } from '@/data/products';
import { OrderError, buildOrder, parseAddress } from '@/lib/order';
import { admin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

// Used with useActionState: returns an error to show next to the form, or
// redirects to the confirmation page on success.
export async function placeOrder(_prev, formData) {
  if (!isSupabaseConfigured) redirect('/login');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/checkout');

  // Sent back so the form keeps what the user typed when there is an error.
  const values = Object.fromEntries(['name', 'line1', 'city', 'postcode', 'phone'].map((k) => [k, String(formData.get(k) ?? '')]));
  let orderId;
  try {
    const address = parseAddress(formData);
    const { items, total } = buildOrder(JSON.parse(String(formData.get('lines') ?? '[]')), bySlug);
    // `orders` has no insert policy for users, so only the server-side service-role client can write it.
    const { data: order, error } = await admin().from('orders')
      .insert({ user_id: user.id, items, total, address })
      .select('id').single();
    if (error || !order) throw new Error('insert failed');
    orderId = order.id;
  } catch (e) {
    return { error: e instanceof OrderError ? e.message : 'Something went wrong. Please try again.', values };
  }
  redirect(`/account/orders/${orderId}?placed=1`);
}
