'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { bySlug } from '@/data/products';
import { clampQty, sanitizeBag, sanitizeList } from '@/lib/bag';

const known = (s) => !!bySlug(s);

// zustand's createJSONStorage only guards the *lookup* of the storage object,
// not each call — a throwing getItem/setItem (quota exceeded, Safari private
// mode) would otherwise bubble out of every store action.
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

// The bag and wishlist live in this browser only (localStorage).
export const useShop = create(
  persist(
    (set, get) => ({
      hydrated: false,
      bag: {},
      wishlist: [],

      add(slug) {
        get().setQty(slug, (get().bag[slug] ?? 0) + 1);
      },

      setQty(slug, qty) {
        if (!known(slug)) return;
        const n = clampQty(qty);
        const bag = { ...get().bag };
        if (n > 0) bag[slug] = n; else delete bag[slug];
        set({ bag });
      },

      toggleWish(slug) {
        if (!known(slug)) return;
        const w = get().wishlist;
        set({ wishlist: w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug] });
      },
    }),
    {
      name: 'shop-v1',
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s) => ({ bag: s.bag, wishlist: s.wishlist }),
      // Stored data is untrusted (hand-edited, corrupted, or from an older catalog).
      merge: (persisted, current) => {
        const p = (persisted ?? {});
        return { ...current, bag: sanitizeBag(p.bag, known), wishlist: sanitizeList(p.wishlist, known) };
      },
    },
  ),
);
