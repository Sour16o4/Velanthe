import Image from 'next/image';
import { notFound } from 'next/navigation';
import { bySlug, products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { IngredientList } from '@/components/IngredientList';
import { AddToBagButton } from '@/components/AddToBagButton';
import { HeartButton } from '@/components/HeartButton';

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  const p = bySlug((await params).slug);
  return p ? { title: p.name, description: p.blurb, openGraph: { title: p.name, description: p.blurb } } : {};
}

export default async function ProductPage({ params }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  return (
    <main id="main" className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-28 md:grid-cols-2 md:gap-16 md:px-8 md:pt-36">
      <div className="grid gap-4">
        {p.images.map((src, i) => (
          <div key={src} className="relative aspect-[4/5] bg-stone">
            <Image src={src} alt={i === 0 ? p.name : ''} fill priority={i === 0} sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="md:sticky md:top-24 md:self-start">
        <p className="label text-gold-ink">{p.category}</p>
        <h1 className="display mt-3 text-5xl">{p.name}</h1>
        <p className="mt-5 text-xl">{formatPrice(p.price)}</p>
        <p className="mt-8 max-w-prose text-mute">{p.description}</p>
        <div className="mt-10"><AddToBagButton slug={p.slug} /></div>
        <div className="relative mt-3 h-10"><HeartButton slug={p.slug} className="absolute left-0 top-0" /></div>
        <h2 className="label mb-4 mt-16">Key ingredients</h2>
        <IngredientList ingredients={p.ingredients} />
      </div>
    </main>
  );
}
