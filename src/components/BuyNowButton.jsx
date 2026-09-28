'use client';
import { useRouter } from 'next/navigation';
import { bagItem, bagKey } from '@/data/products';
import { useShop } from '@/store/shop';
import { useUI } from '@/store/ui';

// "Buy now": adds one to the bag and goes straight to checkout (which asks the visitor to log in first,
// same as adding normally and checking out by hand).
export function BuyNowButton({ slug }) {
  const router = useRouter();
  const add = useShop((s) => s.add);
  const key = bagKey(slug, useUI((s) => s.pdpSize));
  if (!bagItem(key)) return null;
  return (
    <button type="button" className="btn wide" onClick={() => { add(key); router.push('/checkout'); }}>
      <span>Buy now</span>
    </button>
  );
}
