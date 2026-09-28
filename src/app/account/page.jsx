import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { displayName } from '@/lib/user';

export const metadata = { title: 'Account' };

export default async function Account() {
  // Defence in depth: middleware already redirects unconfigured/unauthenticated
  // requests, but a server client must never be constructed without a project.
  if (!isSupabaseConfigured) redirect('/login');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account');
  return (
    <main id="main" className="pg narrow">
      <span className="eyebrow">Account</span>
      <h1 className="serif pgh">Hello, <em>{displayName(user)}</em></h1>
      <p className="muted lede">{user.email}</p>
      <div className="btnrow">
        <Link href="/account/orders" className="btn"><span>Order history</span></Link>
        <LogoutButton />
      </div>
    </main>
  );
}
