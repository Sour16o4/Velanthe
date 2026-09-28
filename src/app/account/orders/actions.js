'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { canCancel } from '@/lib/order';
import { admin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

// Cancels one of the signed-in user's own orders. There is no user-facing update policy on
// `orders` (see schema.sql), so this goes through the service-role client, the same way
// placeOrder writes the order in the first place — the ownership and status checks below
// are what keep it safe, not RLS.
export async function cancelOrder(orderId) {
  if (!isSupabaseConfigured) redirect('/login');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/orders/${orderId}`);

  // RLS lets a user read only their own orders, so this doubles as the ownership check.
  const { data: order } = await supabase.from('orders').select('id, status').eq('id', orderId).maybeSingle();
  if (order && canCancel(order.status)) {
    // The extra .eq('status', 'placed') stops a second, racing cancel click from doing anything.
    await admin().from('orders').update({ status: 'cancelled' }).eq('id', orderId).eq('user_id', user.id).eq('status', 'placed');
  }
  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath('/account/orders');
}
