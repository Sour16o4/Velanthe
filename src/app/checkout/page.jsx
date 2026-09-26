import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { CheckoutForm } from '@/components/CheckoutForm';

export const metadata = { title: 'Checkout' };

export default async function Checkout() {
  if (!isSupabaseConfigured) redirect('/login');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/checkout');
  return <CheckoutForm />;
}
