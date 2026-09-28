'use client';
import { create } from 'zustand';

// say clears then re-sets the message so repeating the same text is re-announced

export const useUI = create((set) => ({
  bagOpen: false, searchOpen: false, menuOpen: false, message: '', pdpSize: '',
  setPdpSize: (pdpSize) => set({ pdpSize }),
  setBag: (bagOpen) => set({ bagOpen }),
  setSearch: (searchOpen) => set({ searchOpen }),
  setMenu: (menuOpen) => set({ menuOpen }),
  say: (message) => { set({ message: '' }); setTimeout(() => set({ message }), 30); },
}));
