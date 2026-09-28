'use client';
import { useEffect } from 'react';
import { formatPrice } from '@/lib/format';
import { useUI } from '@/store/ui';

// Price plus the size chooser. The chosen size is shared with the buy buttons through the UI store;
// it starts on the small size each time a product page opens.
export function PdpPrice({ product: p }) {
  const size = useUI((s) => s.pdpSize);
  const setSize = useUI((s) => s.setPdpSize);
  useEffect(() => { setSize(''); }, [p.slug, setSize]);
  const cur = p.sizes.find((s) => s.key === size) ?? p.sizes[0];
  return (
    <>
      <p className="pdpprice">{formatPrice(cur.price)}</p>
      <div className="sizes" role="group" aria-label="Size">
        {p.sizes.map((s) => (
          <button key={s.key} type="button" className="size" aria-pressed={s.key === cur.key} onClick={() => setSize(s.key)}>
            <span>{s.label}</span><small>{formatPrice(s.price)}</small>
          </button>
        ))}
      </div>
    </>
  );
}
