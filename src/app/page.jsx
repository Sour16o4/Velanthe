import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/data/brand';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { AddToBagButton } from '@/components/AddToBagButton';

const principles = [
  ['Nothing hidden', 'Every ingredient named, every role explained.'],
  ['Nothing unnecessary', 'Fewer steps, better formulas.'],
  ['Gentle by design', 'Made for skin that is tired of being tested.'],
  ['Worth the ritual', 'Textures and scents that make care a pleasure.'],
];

export default function Home() {
  const spotlight = products.flatMap((p) => p.ingredients.map((i) => ({ ...i, product: p.name }))).slice(0, 8);
  return (
    <main id="main">
      <section className="relative h-[92svh] overflow-hidden bg-stone">
        <Image src="/img/hero.svg" alt="" fill priority sizes="100vw" className="hero-img object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/60 via-55% to-ink/30" aria-hidden />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 text-ivory md:px-8 md:pb-28">
          <h1 className="display max-w-3xl text-5xl leading-[1.05] md:text-8xl">{BRAND.tagline}</h1>
          <Link href="/collection" className="label mt-10 w-fit focus-visible:outline-ivory border border-ivory px-8 py-4 hover:bg-ivory hover:text-ink">Order now</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <div className="reveal"><h2 className="display max-w-2xl text-4xl md:text-6xl">The {BRAND.name} way</h2></div>
        <ol className="mt-16 grid gap-12 md:mt-24 md:grid-cols-4 md:gap-8">
          {principles.map(([t, d], i) => (
            <li key={t}>
              <div className="reveal">
                <div className="border-t border-gold pt-5"><span className="label text-gold-ink">0{i + 1}</span>
                  <h3 className="display mt-4 text-[1.75rem]">{t}</h3><p className="mt-3 max-w-[28ch] text-mute">{d}</p></div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8 md:pb-36" id="essentials">
        <div className="reveal"><h2 className="display text-4xl md:text-6xl">The essentials</h2></div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-20 lg:grid-cols-4 md:gap-x-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} actions={<AddToBagButton slug={p.slug} variant="icon" />} />
          ))}
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-7xl px-4 md:px-8"><div className="reveal"><h2 className="display text-4xl md:text-6xl">Ingredient spotlight</h2></div></div>
        <ul tabIndex={0} className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mt-20 md:px-8" aria-label="Ingredients">
          {spotlight.map((i) => (
            <li key={`${i.product}-${i.name}`} className="w-72 shrink-0 snap-start border border-stone p-8">
              <p className="label text-gold-ink">{i.product}</p><h3 className="display mt-4 text-[1.75rem]">{i.name}</h3><p className="mt-3 text-mute">{i.role}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
