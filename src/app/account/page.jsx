import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata = { title: 'Account' };

export default async function Account() {
  // Defence in depth: middleware already redirects unconfigured/unauthenticated
  // requests, but a server client must never be constructed without a project.
  if (!isSupabaseConfigured) redirect('/login');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account');
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 pb-16 pt-32">
      <h1 className="display text-5xl">Your account</h1>
      <p className="mt-4 text-mute">{user.email}</p>
      <div className="mt-8 flex gap-4">
        <Link href="/account/orders" className="label border border-ink px-6 py-3 hover:bg-gold">Order history</Link>
        <LogoutButton />
      </div>
    </main>
  );
}
