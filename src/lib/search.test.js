import { describe, it, expect } from 'vitest';
import { searchProducts } from './search';
import { products } from '@/data/products';

describe('searchProducts', () => {
  it('matches name, category and ingredient case-insensitively', () => {
    expect(searchProducts('LUMINOUS', products).map((p) => p.slug)).toContain('luminous-oil-serum');
    expect(searchProducts('cleanser', products).length).toBeGreaterThanOrEqual(2);
    expect(searchProducts('ceramides', products).map((p) => p.slug)).toContain('barrier-repair-cream');
  });
  it('returns nothing for blank or whitespace-only input', () => {
    expect(searchProducts('', products)).toEqual([]);
    expect(searchProducts('   ', products)).toEqual([]);
  });
  it('trims padding', () => {
    expect(searchProducts('  serum  ', products).length).toBeGreaterThan(0);
  });
  it('treats regex characters literally and never throws', () => {
    for (const q of ['(', '[', '.*', '\\', '+?', '$^']) expect(() => searchProducts(q, products)).not.toThrow();
    expect(searchProducts('.*', products)).toEqual([]);
  });
});
