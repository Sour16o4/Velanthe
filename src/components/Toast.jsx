'use client';
import { useEffect, useState } from 'react';
import { useUI } from '@/store/ui';

// A gold pill that slides up with the latest message ("Silk Body Lotion added to your bag").
// It is also the page's screen-reader announcement (role="status").
export function Toast() {
  const message = useUI((s) => s.message);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!message) return undefined;
    setShown(true);
    const t = setTimeout(() => setShown(false), 2600);
    return () => clearTimeout(t);
  }, [message]);

  return <div className={`toast${shown ? ' on' : ''}`} role="status" aria-live="polite">{message}</div>;
}
