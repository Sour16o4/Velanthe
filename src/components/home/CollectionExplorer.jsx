'use client';
import { useState } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { forPrice, forSkin, PRICE_MAX, PRICE_MIN, PRICE_STEP, routine, skinTypes } from '@/lib/skin';
import { ProductTile } from '@/components/ProductTile';

// The collection page: pick a skin type to see only the products that suit it, plus a simple daily routine.
export function CollectionExplorer() {
  const [type, setType] = useState('');
  const [max, setMax] = useState(PRICE_MAX);
  const shown = forPrice(max, forSkin(type, products));
  const t = skinTypes.find((x) => x.key === type);
  const plan = routine(type, products);

  return (
    <>
      <div className="finder">
        <div className="seg" role="group" aria-label="Skin type">
          <button type="button" aria-pressed={type === ''} onClick={() => setType('')}>All</button>
          {skinTypes.map((s) => (
            <button key={s.key} type="button" aria-pressed={type === s.key} onClick={() => setType(s.key)}>{s.label}</button>
          ))}
        </div>
        <div className="rng">
          <label htmlFor="price-max"><span>Price up to</span><b>{formatPrice(max * 100)}</b></label>
          <input id="price-max" type="range" min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={max}
            style={{ '--p': `${((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%` }}
            onChange={(e) => setMax(Number(e.target.value))} />
        </div>
      </div>

      {t && (
        <section className="skinpanel" aria-live="polite">
          <div>
            <h2 className="serif">Ritual for <em>{t.label.toLowerCase()}</em> skin</h2>
            <p className="muted">{t.blurb}</p>
          </div>
          <ol className="steps">
            {plan.steps.map((s, i) => (
              <li key={s.label}>
                <span className="n">{i + 1}</span>
                <span className="k">{s.label}</span>
                <Link href={`/product/${s.product.slug}`}>{s.product.name}</Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="muted small count" role="status">{shown.length === products.length ? `All ${shown.length} products` : `${shown.length} ${shown.length === 1 ? 'product' : 'products'}${t ? ` for ${t.label.toLowerCase()} skin` : ''}`}</p>
      {shown.length === 0 && <p className="muted">Nothing at this price for that skin type. Raise the price limit.</p>}
      <div className="pgrid" id="pgrid">
        {shown.map((p, i) => <ProductTile key={p.slug} product={p} className={`s${i}`} priority={i < 2} />)}
      </div>
    </>
  );
}
