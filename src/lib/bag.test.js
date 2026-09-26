import { describe, it, expect } from 'vitest';
import { clampQty, sanitizeBag, sanitizeList, bagCount, resolveBag, MAX_QTY } from './bag';
import { bySlug } from '@/data/products';

const known = (s) => ['a', 'b', 'c'].includes(s);

describe('clampQty', () => {
  it('clamps to 0..MAX_QTY and floors', () => {
    expect(clampQty(3.9)).toBe(3);
    expect(clampQty(99)).toBe(MAX_QTY);
    expect(clampQty(-5)).toBe(0);
  });
  it('rejects non-numbers', () => {
    for (const bad of ['3', NaN, Infinity, null, undefined, true, {}, []]) expect(clampQty(bad)).toBe(0);
  });
});

describe('sanitizeBag (corrupted or hostile storage)', () => {
  it('drops unknown slugs, bad quantities and non-objects', () => {
    expect(sanitizeBag({ a: 2, zzz: 3, b: -1, c: '4' }, known)).toEqual({ a: 2 });
    for (const bad of [null, undefined, 'x', 5, [], [1, 2]]) expect(sanitizeBag(bad, known)).toEqual({});
  });
  it('caps quantities', () => {
    expect(sanitizeBag({ a: 500 }, known)).toEqual({ a: MAX_QTY });
  });
});

describe('sanitizeList', () => {
  it('keeps unique known string slugs only', () => {
    expect(sanitizeList(['a', 'a', 'zzz', 5, null, 'b'], known)).toEqual(['a', 'b']);
    expect(sanitizeList('nope', known)).toEqual([]);
  });
});

describe('bagCount', () => {
  it('sums quantities', () => expect(bagCount({ a: 2, b: 3 })).toBe(5));
});

describe('resolveBag (product removed from catalog)', () => {
  it('skips slugs that no longer exist instead of crashing', () => {
    const rows = resolveBag({ 'luminous-oil-serum': 2, 'discontinued-thing': 1 }, bySlug);
    expect(rows).toHaveLength(1);
    expect(rows[0].product.slug).toBe('luminous-oil-serum');
    expect(rows[0].qty).toBe(2);
  });
});
