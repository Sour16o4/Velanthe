import { products } from '@/data/products';
import { ProductTile } from '@/components/ProductTile';

// The bento grid of products. The first product is the large feature card (see .s0 to .s8 in globals.css).
// `limit` shows only the first N (the homepage teaser); the full /collection page omits it and gets every product.
export function CollectionGrid({ limit } = {}) {
  const shown = limit ? products.slice(0, limit) : products;
  return (
    <div className="pgrid" id="pgrid">
      {shown.map((p, i) => <ProductTile key={p.slug} product={p} className={`s${i}`} priority={i < 2} />)}
    </div>
  );
}
