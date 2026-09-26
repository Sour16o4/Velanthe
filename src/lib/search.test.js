import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts } from './search';
import { products } from '@/data/products';

const slugs = (q) => searchProducts(q, products).map((p) => p.slug);

describe('searchProducts', () => {
  it('matches name, category and ingredient case-insensitively', () => {
    assert.ok(slugs('LUMINOUS').includes('luminous-oil-serum'));
    assert.ok(slugs('cleanser').length >= 2);
    assert.ok(slugs('ceramides').includes('barrier-repair-cream'));
  });
  it('returns nothing for blank or whitespace-only input', () => {
    assert.deepEqual(slugs(''), []);
    assert.deepEqual(slugs('   '), []);
  });
  it('trims padding', () => {
    assert.ok(slugs('  serum  ').length > 0);
  });
  it('treats regex characters literally and never throws', () => {
    for (const q of ['(', '[', '.*', '\\', '+?', '$^']) assert.doesNotThrow(() => searchProducts(q, products));
    assert.deepEqual(slugs('.*'), []);
  });
});
