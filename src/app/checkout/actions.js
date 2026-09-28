'use server';
import { redirect } from 'next/navigation';
import { bagItem } from '@/data/products';
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

    // The bag is read from the database (the user's own rows), never taken from the browser.
    // ponytail: two tabs submitting at the same moment can both read the same rows and each
    // place an order. Upgrade: delete the bag_items rows first with .select() and build the
    // order from the rows that come back, so the delete acts as a lock.
    const { data: rows, error } = await supabase.from('bag_items').select('product_slug, qty');
    if (error) throw new Error('could not read the bag');

    // A product removed from the catalog after it was added to a bag would fail the order
    // forever (the summary hides it, so the user could not remove it). Drop such rows here.
    const unknown = rows.filter((r) => !bagItem(r.product_slug)).map((r) => r.product_slug);
    if (unknown.length) {
      const { error: deleteError } = await supabase.from('bag_items').delete().eq('user_id', user.id).in('product_slug', unknown);
      if (deleteError) throw new Error('could not clean the bag');
      throw new OrderError('An item in your bag is no longer available and was removed. Please review your bag and try again.');
    }

    const { items, total } = buildOrder(rows.map((r) => ({ slug: r.product_slug, qty: r.qty })), bagItem);

    // `orders` has no insert policy for users, so only this server-side service-role client can write it.
    const db = admin();
    const { data: order, error: insertError } = await db.from('orders')
      .insert({ user_id: user.id, items, total, address })
      .select('id').single();
    if (insertError || !order) throw new Error('insert failed');

    // The order is already saved here, so a failure to empty the bag leaves stale rows
    // instead of losing the order. Log it and carry on.
    const { error: clearError } = await db.from('bag_items').delete().eq('user_id', user.id);
    if (clearError) console.error('Failed to clear bag_items after order', clearError);
    orderId = order.id;
  } catch (e) {
    return { error: e instanceof OrderError ? e.message : 'Something went wrong. Please try again.', values };
  }
  redirect(`/account/orders/${orderId}?placed=1`);
}
