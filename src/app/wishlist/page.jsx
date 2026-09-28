import { WishlistGrid } from '@/components/WishlistGrid';

export const metadata = { title: 'Wishlist' };

export default function Wishlist() {
  return (
    <main id="main" className="pg">
      <span className="eyebrow">Saved for later</span>
      <h1 className="serif pgh">Wishlist</h1>
      <WishlistGrid />
    </main>
  );
}
