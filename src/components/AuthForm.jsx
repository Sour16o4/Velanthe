'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { safeNext } from '@/lib/safe-next';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useShop } from '@/store/shop';
import { cleanName } from '@/lib/user';

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

  async function submit(email, password, fullName = '') {
    setBusy(true); setError(''); setNotice('');
    const sb = createClient();
    try {
      const res = mode === 'login'
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({ email, password, options: { data: { full_name: cleanName(fullName) }, emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
      if (res.error) throw res.error;
      if (mode === 'signup' && !res.data.session) { setNotice('Check your email to confirm your account.'); return; }
      // Wait for the guest-bag merge before navigating, so /checkout never shows
      // an empty bag while the merge is still running.
      if (res.data.user) await useShop.getState().signIn(res.data.user.id);
      router.push(next); router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  }

  if (!isSupabaseConfigured) {
    return (
      <div>
        <span className="eyebrow">Account</span>
        <h1 className="serif pgh">{title}</h1>
        <p className="lede">Accounts are not configured in this copy of the store. Browse and use the bag as a guest.</p>
        <p className="muted small"><Link className="ulink" href="/">Return to the store</Link></p>
      </div>
    );
  }

  return (
    <div>
      <span className="eyebrow">Account</span>
      <h1 className="serif pgh">{title}</h1>
      <form className="fgrid" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); submit(String(f.get('email')), String(f.get('password')), String(f.get('name') ?? '')); }}>
        {mode === 'signup' && (
          <>
            <label className="eyebrow" htmlFor="name">Your name</label>
            <input id="name" name="name" type="text" required maxLength={80} autoComplete="name" className="fld" />
          </>
        )}
        <label className="eyebrow" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="fld" />
        <label className="eyebrow" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="fld" />
        {error && <p role="alert" className="err">{error}</p>}
        {notice && <p role="status" className="okmsg">{notice}</p>}
        <button disabled={busy} className="btn p wide"><span>{busy ? (mode === 'login' ? 'Logging in…' : 'Signing up…') : (mode === 'login' ? 'Log in' : 'Sign up')}</span></button>
      </form>
      {mode === 'login' && demoReady && (
        <button type="button" disabled={busy} onClick={() => submit(process.env.NEXT_PUBLIC_DEMO_EMAIL, process.env.NEXT_PUBLIC_DEMO_PASSWORD)}
          className="btn wide demo"><span>Try demo account</span></button>
      )}
      <p className="muted small links">
        {mode === 'login' ? <>New here? <Link className="ulink" href="/signup">Create an account</Link></> : <>Already registered? <Link className="ulink" href="/login">Log in</Link></>}
      </p>
      {mode === 'login' && (
        <p className="muted small"><Link className="ulink" href="/forgot-password">Forgot password?</Link></p>
      )}
    </div>
  );
}
