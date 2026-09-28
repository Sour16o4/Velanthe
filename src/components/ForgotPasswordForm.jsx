'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) {
    return <p className="lede">Accounts are not configured in this copy of the store.</p>;
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const email = String(new FormData(e.currentTarget).get('email'));
      // The email link goes through /auth/callback, which signs the user in and then opens the "new password" page.
      const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/account/update-password` });
      if (error) setError(error.message); else setSent(true);
    } catch {
      setError('We could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // Same wording whether or not the email has an account, so the form can't be used to find out who is registered.
  if (sent) return <p role="status" className="okmsg lede">If that email has an account, a reset link is on its way.</p>;

  return (
    <form className="fgrid" onSubmit={submit}>
      <label className="eyebrow" htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="email" spellCheck={false} className="fld" />
      {error && <p role="alert" className="err">{error}</p>}
      <button disabled={busy} className="btn p wide"><span>Send link</span></button>
    </form>
  );
}
