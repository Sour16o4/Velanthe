'use client';
import { useEffect } from 'react';
import { bagItem, bySlug } from '@/data/products';
import { sanitizeBag, sanitizeList } from '@/lib/bag';
import { remote } from '@/lib/remote';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useShop } from '@/store/shop';
import { useSession } from '@/store/session';
import { displayName, firstName } from '@/lib/user';

const isKnown = (s) => !!bySlug(s);
const isKnownBag = (k) => !!bagItem(k);
const toSession = (u) => (u ? { id: u.id, email: u.email, name: displayName(u), first: firstName(u) } : null);

// Reloads the bag/wishlist when the tab regains focus, so a change made in
// another tab or on another device shows up without a full reload.
async function refetchOnFocus() {
  const before = useShop.getState();
  if (!before.userId || document.visibilityState !== 'visible') return;
  try {
    const r = await remote.fetchAll();
    // Skip if anything changed while we were fetching: a sign-out (here or in
    // another tab) would otherwise let this stale result put user A's bag into a
    // signed-out store, and a click made meanwhile would be overwritten.
    const after = useShop.getState();
    if (after.userId !== before.userId || after.bag !== before.bag || after.wishlist !== before.wishlist) return;
    useShop.setState({ bag: sanitizeBag(r.bag, isKnownBag), wishlist: sanitizeList(r.wishlist, isKnown) });
  } catch { /* keep the current state */ }
}

export function StoreProvider({ children }) {
  useEffect(() => {
    let cancelled = false;
    let unsub = () => {};
    (async () => {
      // Always load the saved guest bag/wishlist, whether or not Supabase is set up.
      await Promise.resolve(useShop.persist.rehydrate());
      if (cancelled) return;
      useShop.setState({ hydrated: true });
      if (!isSupabaseConfigured) return;
      try {
        const sb = createClient();
        const { data: { user } } = await sb.auth.getUser();
        if (cancelled) return;
        useSession.getState().setUser(toSession(user));
        if (user) await useShop.getState().signIn(user.id);
        if (cancelled) return;
        const { data } = sb.auth.onAuthStateChange((event, session) => {
          if (session?.user) useSession.getState().setUser(toSession(session.user));
          if (event === 'SIGNED_IN' && session?.user) useShop.getState().signIn(session.user.id);
          if (event === 'SIGNED_OUT') { useSession.getState().setUser(null); useShop.getState().signOut(); }
        });
        if (cancelled) { data.subscription.unsubscribe(); return; }
        window.addEventListener('focus', refetchOnFocus);
        unsub = () => { data.subscription.unsubscribe(); window.removeEventListener('focus', refetchOnFocus); };
      } catch { /* Supabase unreachable: the guest experience keeps working */ }
    })();
    return () => { cancelled = true; unsub(); };
  }, []);
  return <>{children}</>;
}
