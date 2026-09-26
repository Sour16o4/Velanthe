import { WishlistGrid } from '@/components/WishlistGrid';

export const metadata = { title: 'Wishlist' };

export default function Wishlist() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 pb-16 pt-32">
      <h1 className="display text-5xl">Wishlist</h1>
      <div className="mt-10"><WishlistGrid /></div>
    </main>
  );
}
