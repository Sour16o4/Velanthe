import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { AddToBagButton } from '@/components/AddToBagButton';

export const metadata = { title: 'Collection' };

export default function Collection() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 pb-24 pt-32 md:px-8 md:pt-40">
      <h1 className="display text-5xl md:text-7xl">Collection</h1>
      <h2 className="sr-only">All products</h2>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-20 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.slug} product={p} actions={<AddToBagButton slug={p.slug} variant="icon" />} />)}
      </div>
    </main>
  );
}
