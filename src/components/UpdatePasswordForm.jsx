'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) {
    return <p className="lede">Accounts are not configured in this copy of the store.</p>;
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const password = String(new FormData(e.currentTarget).get('password'));
      const { error } = await createClient().auth.updateUser({ password });
      if (error) setError(error.message); else router.push('/account');
    } catch {
      setError('We could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="fgrid" onSubmit={submit}>
      <label className="eyebrow" htmlFor="password">New password</label>
      <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" className="fld" />
      {error && <p role="alert" className="err">{error}</p>}
      <button disabled={busy} className="btn p wide"><span>Update password</span></button>
    </form>
  );
}
