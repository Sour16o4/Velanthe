'use client';
import { useState } from 'react';
import { bySlug } from '@/data/products';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';

// Save to wishlist. It pops once, only on the click that saves it (never when a saved heart first renders).
export function HeartButton({ slug, inline = false }) {
  const on = useShop((s) => s.wishlist.includes(slug));
  const toggle = useShop((s) => s.toggleWish);
  const say = useUI((s) => s.say);
  const name = bySlug(slug)?.name ?? 'product';
  const [pop, setPop] = useState(false);
  return (
    <button type="button" aria-pressed={on} aria-label={`Wishlist ${name}`} className={`heart${inline ? ' inline' : ''}${pop ? ' pop' : ''}`}
      onAnimationEnd={() => setPop(false)}
      onClick={() => {
        toggle(slug);
        say(on ? `${name} removed from wishlist` : `${name} saved to wishlist`);
        setPop(!on);
      }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9Z" />
      </svg>
    </button>
  );
}
