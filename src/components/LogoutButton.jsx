'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useShop } from '@/store/shop';
import { useSession } from '@/store/session';
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
      // Reset the store directly rather than relying on the SIGNED_OUT event's timing.
      useShop.getState().signOut();
      useSession.getState().setUser(null);
      router.push('/');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button disabled={busy} className="btn" onClick={logout}>
      <span>Log out</span>
    </button>
  );
}
