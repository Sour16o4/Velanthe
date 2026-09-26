import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { OrderError, buildOrder, parseAddress } from './order';
import { bySlug } from '@/data/products';

const serum = bySlug('luminous-oil-serum');
const cream = bySlug('barrier-repair-cream');

describe('buildOrder', () => {
  it('computes items and total from the catalog', () => {
    const o = buildOrder([{ slug: serum.slug, qty: 2 }, { slug: cream.slug, qty: 1 }], bySlug);
    assert.equal(o.total, serum.price * 2 + cream.price);
    assert.deepEqual(o.items[0], { slug: serum.slug, name: serum.name, unitPrice: serum.price, qty: 2 });
  });
  it('ignores any client-supplied price', () => {
    const tampered = [{ slug: serum.slug, qty: 1, price: 1, unitPrice: 1, total: 1 }];
    assert.equal(buildOrder(tampered, bySlug).total, serum.price);
  });
  it('rejects an empty or malformed bag', () => {
    for (const bad of [[], null, 'x', {}]) assert.throws(() => buildOrder(bad, bySlug), OrderError);
  });
  it('rejects a slug that is not in the catalog', () => {
    assert.throws(() => buildOrder([{ slug: 'discontinued', qty: 1 }], bySlug), /no longer available/);
    assert.throws(() => buildOrder([null], bySlug), OrderError);
  });
  it('rejects zero, negative, fractional-below-one and non-numeric quantities; clamps large ones', () => {
    for (const qty of [0, -3, 0.4, NaN, '2']) {
      assert.throws(() => buildOrder([{ slug: serum.slug, qty }], bySlug), /Invalid quantity/);
    }
    assert.equal(buildOrder([{ slug: serum.slug, qty: 500 }], bySlug).items[0].qty, 10);
  });
});

describe('parseAddress', () => {
  const form = (o) => { const f = new FormData(); Object.entries(o).forEach(([k, v]) => f.set(k, v)); return f; };
  const good = { name: 'Asha Rao', line1: '12 Lake Road', city: 'Pune', postcode: '411001', phone: '9876543210' };

  it('trims and returns the address', () => {
    assert.equal(parseAddress(form({ ...good, name: '  Asha Rao  ' })).name, 'Asha Rao');
  });
  it('rejects whitespace-only, missing and oversized fields with a user-safe OrderError', () => {
    assert.throws(() => parseAddress(form({ ...good, city: '   ' })), /Please enter your city/);
    const { phone: _phone, ...missing } = good;
    assert.throws(() => parseAddress(form(missing)), /Please enter your phone number/);
    assert.throws(() => parseAddress(form({ ...good, line1: 'x'.repeat(121) })), OrderError);
  });
});
