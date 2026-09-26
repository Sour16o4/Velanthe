import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { HeartButton } from './HeartButton';

export function ProductCard({ product: p, actions }) {
  const second = p.images[1];
  return (
    <article className="group relative">
      <HeartButton slug={p.slug} />
      <Link href={`/product/${p.slug}`} className="block" aria-label={`${p.name}, ${formatPrice(p.price)}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          <Image src={p.images[0]} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
          {second && (
            <Image src={second} alt="" fill sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100" />
          )}
        </div>
        <h3 className="mt-4">{p.name}</h3>
        <p className="text-mute">{formatPrice(p.price)}</p>
      </Link>
      {actions}
    </article>
  );
}
