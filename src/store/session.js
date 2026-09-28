'use client';
import { create } from 'zustand';

// Who is signed in (or null): { id, email, name, first }. Set by StoreProvider from Supabase.
export const useSession = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
