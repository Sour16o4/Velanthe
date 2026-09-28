'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { bagItem, bySlug } from '@/data/products';
import { clampQty, mergeBags, mergeLists, sanitizeBag, sanitizeList } from '@/lib/bag';
import { remote } from '@/lib/remote';
import { useUI } from './ui';

const known = (s) => !!bySlug(s); // wishlist: plain product slugs
const knownBag = (k) => !!bagItem(k); // bag: plain slug or "slug~l" (large size)
const STORAGE_KEY = 'shop-v1';

// Bumped by signOut so a signIn merge whose network calls finish after a sign-out
// (Log out button, or a SIGNED_OUT event from another tab) can notice and discard
// itself, instead of writing another account's bag into a signed-out store.
let authEpoch = 0;

// On login, AuthForm awaits signIn and StoreProvider's SIGNED_IN listener also
// calls it. Share one in-flight promise per user so the merge only runs once.
let inflight = null;

// zustand's createJSONStorage only guards the *lookup* of the storage object,
// not each call. A throwing getItem/setItem/removeItem (quota exceeded, Safari
// private mode) would otherwise bubble out of every store action.
const safeStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch {}
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch {}
  },
};

// Guests: the bag and wishlist live in this browser (localStorage).
// Signed-in users: they live in Supabase and this store mirrors them.
export const useShop = create(
  persist(
    (set, get) => ({
      userId: null,
      hydrated: false,
      bag: {},
      wishlist: [],

      async add(slug) {
        await get().setQty(slug, (get().bag[slug] ?? 0) + 1);
      },

      // Writes the ABSOLUTE quantity; if saving fails, undoes only this product.
      async setQty(slug, qty) {
        if (!knownBag(slug)) return;
        const n = clampQty(qty);
        const prevQty = get().bag[slug] ?? 0;
        const apply = (q) => {
          const bag = { ...get().bag };
          if (q > 0) bag[slug] = q; else delete bag[slug];
          set({ bag });
        };
        apply(n);
        const { userId } = get();
        if (!userId) return;
        try {
          await remote.setQty(userId, slug, n);
        } catch {
          // Only undo if nothing newer has changed this product since we applied `n`.
          if ((get().bag[slug] ?? 0) === n) apply(prevQty);
          useUI.getState().say('We could not update your bag. Please try again.');
        }
      },

      async toggleWish(slug) {
        if (!known(slug)) return;
        const prev = get().wishlist;
        const on = !prev.includes(slug);
        set({ wishlist: on ? [...prev, slug] : prev.filter((s) => s !== slug) });
        const { userId } = get();
        if (!userId) return;
        try {
          await remote.setWish(userId, slug, on);
        } catch {
          if (get().wishlist.includes(slug) === on) {
            set({ wishlist: on ? get().wishlist.filter((s) => s !== slug) : [...new Set([...get().wishlist, slug])] });
          }
          useUI.getState().say('We could not update your wishlist. Please try again.');
        }
      },

      // Merge the guest bag with the account's saved bag, save the result, and only THEN
      // switch to "signed in" (so the guest copy is emptied only after the merge succeeded).
      async signIn(userId) {
        // Switching straight from account A to account B (signInWithPassword only ever
        // emits SIGNED_IN, never a SIGNED_OUT first) must not merge A's bag into B's.
        const cur = get().userId;
        if (cur && cur !== userId) get().signOut();
        if (get().userId === userId) return;
        if (inflight && inflight.userId === userId) return inflight.p;
        const epoch = authEpoch;
        const p = (async () => {
          try {
            const r = await remote.fetchAll();
            const bag = mergeBags(sanitizeBag(r.bag, knownBag), get().bag);
            const wishlist = mergeLists(sanitizeList(r.wishlist, known), get().wishlist);
            await remote.upsertAll(userId, bag, wishlist);
            // A sign-out happened while we were syncing: this merge is stale, drop it.
            if (epoch !== authEpoch) return;
            set({ userId, bag, wishlist });
          } catch {
            useUI.getState().say('Signed in, but we could not sync your bag yet.');
          } finally {
            if (inflight && inflight.userId === userId) inflight = null;
          }
        })();
        inflight = { userId, p };
        return p;
      },

      signOut() {
        authEpoch++;
        inflight = null;
        set({ userId: null, bag: {}, wishlist: [] });
        safeStorage.removeItem(STORAGE_KEY);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      // Signed-in users keep nothing locally: Supabase is the source of truth.
      partialize: (s) => (s.userId ? { bag: {}, wishlist: [] } : { bag: s.bag, wishlist: s.wishlist }),
      // Stored data is untrusted (hand-edited, corrupted, or from an older catalog).
      merge: (persisted, current) => {
        const p = persisted ?? {};
        return { ...current, bag: sanitizeBag(p.bag, knownBag), wishlist: sanitizeList(p.wishlist, known) };
      },
    },
  ),
);
