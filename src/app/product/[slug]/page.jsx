import Image from 'next/image';
import { notFound } from 'next/navigation';
import { bySlug, products } from '@/data/products';
import { PdpPrice } from '@/components/PdpPrice';
import { IngredientList } from '@/components/IngredientList';
import { ProductBadges, ProductFacts } from '@/components/ProductFacts';
import { AddToBagButton } from '@/components/AddToBagButton';
import { BuyNowButton } from '@/components/BuyNowButton';
import { HeartButton } from '@/components/HeartButton';

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  const p = bySlug((await params).slug);
  return p ? { title: p.name, description: p.blurb, openGraph: { title: p.name, description: p.blurb, images: [p.image] } } : {};
}

export default async function ProductPage({ params }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  return (
    <main id="main" className="pg pdp">
      <div className="pdpimg"><Image src={p.image} alt={p.name} width={700} height={900} priority sizes="(min-width:900px) 45vw, 90vw" /></div>
      <div className="pdpinfo">
        <span className="eyebrow">{p.category}</span>
        <h1 className="serif pgh">{p.name}</h1>
        <PdpPrice product={p} />
        <p className="muted lede">{p.description}</p>
        <ProductBadges product={p} />
        <div className="pdpbuy"><AddToBagButton slug={p.slug} /><BuyNowButton slug={p.slug} /><HeartButton slug={p.slug} inline /></div>
        <h2 className="eyebrow ing-h">Key ingredients</h2>
        <IngredientList ingredients={p.ingredients} />
        <ProductFacts product={p} />
      </div>
    </main>
  );
}
