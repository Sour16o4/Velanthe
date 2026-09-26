import { describe, it, expect } from 'vitest';
import { OrderError, buildOrder, parseAddress } from './order';
import { bySlug } from '@/data/products';

const serum = bySlug('luminous-oil-serum');
const cream = bySlug('barrier-repair-cream');

describe('buildOrder', () => {
  it('computes items and total from the catalog', () => {
    const o = buildOrder([{ slug: serum.slug, qty: 2 }, { slug: cream.slug, qty: 1 }], bySlug);
    expect(o.total).toBe(serum.price * 2 + cream.price);
    expect(o.items[0]).toEqual({ slug: serum.slug, name: serum.name, unitPrice: serum.price, qty: 2 });
  });
  it('ignores any client-supplied price', () => {
    const tampered = [{ slug: serum.slug, qty: 1, price: 1, unitPrice: 1, total: 1 }];
    expect(buildOrder(tampered, bySlug).total).toBe(serum.price);
  });
  it('rejects an empty or malformed bag', () => {
    for (const bad of [[], null, 'x', {}]) expect(() => buildOrder(bad, bySlug)).toThrow(OrderError);
  });
  it('rejects a slug that is not in the catalog', () => {
    expect(() => buildOrder([{ slug: 'discontinued', qty: 1 }], bySlug)).toThrow('no longer available');
    expect(() => buildOrder([null], bySlug)).toThrow(OrderError);
  });
  it('rejects zero, negative, fractional-below-one and non-numeric quantities; clamps large ones', () => {
    for (const qty of [0, -3, 0.4, NaN, '2']) {
      expect(() => buildOrder([{ slug: serum.slug, qty }], bySlug)).toThrow('Invalid quantity');
    }
    expect(buildOrder([{ slug: serum.slug, qty: 500 }], bySlug).items[0].qty).toBe(10);
  });
});

describe('parseAddress', () => {
  const form = (o) => { const f = new FormData(); Object.entries(o).forEach(([k, v]) => f.set(k, v)); return f; };
  const good = { name: 'Asha Rao', line1: '12 Lake Road', city: 'Pune', postcode: '411001', phone: '9876543210' };

  it('trims and returns the address', () => {
    expect(parseAddress(form({ ...good, name: '  Asha Rao  ' })).name).toBe('Asha Rao');
  });
  it('rejects whitespace-only, missing and oversized fields with a user-safe OrderError', () => {
    expect(() => parseAddress(form({ ...good, city: '   ' }))).toThrow('Please enter your city');
    const { phone, ...missing } = good; void phone;
    expect(() => parseAddress(form(missing))).toThrow('Please enter your phone number');
    expect(() => parseAddress(form({ ...good, line1: 'x'.repeat(121) }))).toThrow(OrderError);
  });
});
