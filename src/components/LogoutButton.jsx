'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUI } from '@/store/ui';

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      const { error } = await createClient().auth.signOut();
      if (error) {
        useUI.getState().say('We could not log you out. Please try again.');
        return;
      }
      router.push('/');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button disabled={busy} className="label border border-ink px-6 py-3 hover:bg-gold disabled:opacity-50" onClick={logout}>
      Log out
    </button>
  );
}
