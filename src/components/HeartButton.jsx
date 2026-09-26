'use client';
import { useState } from 'react';
import { bySlug } from '@/data/products';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';

export function HeartButton({ slug, className = 'absolute right-2 top-2' }) {
  const on = useShop((s) => s.wishlist.includes(slug));
  const toggle = useShop((s) => s.toggleWish);
  const say = useUI((s) => s.say);
  const name = bySlug(slug)?.name ?? 'product';
  // Pop only on the click that saves it, never when a saved heart first renders.
  const [pop, setPop] = useState(false);
  return (
    <button type="button" aria-pressed={on} aria-label={`Wishlist ${name}`}
      className={`z-10 grid h-10 w-10 place-items-center bg-ivory/90 transition-transform active:scale-90 ${pop ? 'pop' : ''} ${className}`}
      onAnimationEnd={() => setPop(false)}
      onClick={() => {
        toggle(slug);
        say(on ? `${name} removed from wishlist` : `${name} saved to wishlist`);
        setPop(!on);
      }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill={on ? '#1A1815' : 'none'} stroke="#1A1815" strokeWidth="1.5" aria-hidden>
        <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9Z" />
      </svg>
    </button>
  );
}
