'use client';
import { bySlug } from '@/data/products';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';

export function AddToBagButton({ slug, variant = 'full' }) {
  const add = useShop((s) => s.add);
  const { setBag, say } = useUI();
  const p = bySlug(slug);
  if (!p) return null;
  const onClick = () => { add(slug); say(`${p.name} added to your bag`); setBag(true); };
  return variant === 'full'
    ? <button onClick={onClick} className="label w-full border border-ink bg-ink px-8 py-4 text-ivory hover:bg-gold hover:text-ink">Add to bag</button>
    : <button onClick={onClick} aria-label={`Add ${p.name} to bag`} className="label absolute bottom-16 right-2 bg-ivory px-3 py-2 text-ink shadow [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 group-focus-within:opacity-100 group-focus-within:translate-y-0">Add +</button>;
}
