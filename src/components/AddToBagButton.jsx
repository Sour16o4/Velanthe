'use client';
import { bagItem, bagKey } from '@/data/products';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';

// "Add to bag": puts one in the bag and shows the toast (the bag button in the header bounces and counts up).
export function AddToBagButton({ slug }) {
  const add = useShop((s) => s.add);
  const bagSize = useShop((s) => Object.values(s.bag).reduce((a, b) => a + b, 0));
  const say = useUI((s) => s.say);
  const size = useUI((s) => s.pdpSize);
  const key = bagKey(slug, size);
  const p = bagItem(key);
  if (!p) return null;
  return (
    <button type="button" className="btn p wide" onClick={(e) => { add(key); const n = bagSize + 1; say(`${p.name} added. ${n} ${n === 1 ? 'item' : 'items'} in your bag`); }}>
      <span>Add to bag</span>
    </button>
  );
}
