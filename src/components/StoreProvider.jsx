'use client';
import { useEffect } from 'react';
import { useShop } from '@/store/shop';

// Loads the saved bag/wishlist after mount, so server and client render the same
// HTML first (no hydration mismatch); counts show once `hydrated` is true.
export function StoreProvider({ children }) {
  useEffect(() => {
    Promise.resolve(useShop.persist.rehydrate()).finally(() => useShop.setState({ hydrated: true }));
  }, []);
  return <>{children}</>;
}
