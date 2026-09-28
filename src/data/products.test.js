import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bagItem, bagKey, bySlug, products } from './products';

describe('product sizes', () => {
  it('every product has a small and a larger size, the larger costing more', () => {
    for (const p of products) {
      assert.equal(p.sizes.length, 2, p.slug);
      assert.equal(p.sizes[0].price, p.price, p.slug);
      assert.ok(p.sizes[1].price > p.sizes[0].price, p.slug);
    }
  });

  it('body wash is 300 ml or 500 ml', () => {
    assert.deepEqual(bySlug('nourishing-body-wash').sizes.map((s) => s.label), ['300 ml', '500 ml']);
  });

  it('a bag key resolves to the right size, price and name; unknown keys resolve to nothing', () => {
    const small = bagItem('nourishing-body-wash');
    const large = bagItem(bagKey('nourishing-body-wash', 'l'));
    assert.equal(small.size, '300 ml');
    assert.equal(large.size, '500 ml');
    assert.equal(large.slug, 'nourishing-body-wash~l');
    assert.equal(large.baseSlug, 'nourishing-body-wash');
    assert.equal(large.name, 'Nourishing Body Wash · 500 ml');
    assert.ok(large.price > small.price);
    for (const bad of ['nope', 'nourishing-body-wash~x', undefined, '']) assert.equal(bagItem(bad), undefined, String(bad));
  });
});
