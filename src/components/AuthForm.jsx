'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { safeNext } from '@/lib/safe-next';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function AuthForm({ mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));
  const [error, setError] = useState(
    searchParams.get('error') === 'callback' ? 'That link has expired or is invalid. Please log in again.' : '',
  );
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const title = mode === 'login' ? 'Welcome back' : 'Create account';
  const demoReady = Boolean(process.env.NEXT_PUBLIC_DEMO_EMAIL && process.env.NEXT_PUBLIC_DEMO_PASSWORD);

  async function submit(email, password) {
    setBusy(true); setError(''); setNotice('');
    const sb = createClient();
    try {
      const res = mode === 'login'
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
      if (res.error) throw res.error;
      if (mode === 'signup' && !res.data.session) { setNotice('Check your email to confirm your account.'); return; }
      router.push(next); router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-sm">
        <h1 className="display text-5xl">{title}</h1>
        <p className="mt-8 text-ink">Accounts are not configured in this copy of the store. Browse and use the bag as a guest.</p>
        <p className="mt-6 text-sm text-mute"><Link className="underline" href="/">Return to the store</Link></p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="display text-5xl">{title}</h1>
      <form className="mt-8 grid gap-4" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); submit(String(f.get('email')), String(f.get('password'))); }}>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="border border-ink bg-transparent px-4 py-3" />
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="border border-ink bg-transparent px-4 py-3" />
        {error && <p role="alert" className="text-sm text-[#9b2c2c]">{error}</p>}
        {notice && <p role="status" className="text-sm text-ink">{notice}</p>}
        <button disabled={busy} className="label border border-ink bg-ink px-6 py-4 text-ivory hover:bg-gold hover:text-ink disabled:opacity-50">{mode === 'login' ? 'Log in' : 'Sign up'}</button>
      </form>
      {mode === 'login' && demoReady && (
        <button disabled={busy} onClick={() => submit(process.env.NEXT_PUBLIC_DEMO_EMAIL, process.env.NEXT_PUBLIC_DEMO_PASSWORD)}
          className="label mt-4 w-full border border-ink px-6 py-4 hover:bg-gold">Try demo account</button>
      )}
      <p className="mt-6 text-sm text-mute">
        {mode === 'login' ? <>New here? <Link className="underline" href="/signup">Create an account</Link></> : <>Already registered? <Link className="underline" href="/login">Log in</Link></>}
      </p>
    </div>
  );
}
