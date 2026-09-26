'use client';
import { useUI } from '@/store/ui';

export function LiveRegion() {
  const message = useUI((s) => s.message);
  return <div aria-live="polite" role="status" className="sr-only">{message}</div>;
}
