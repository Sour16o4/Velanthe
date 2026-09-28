import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clampQty, sanitizeBag, sanitizeList, mergeBags, mergeLists, bagCount, resolveBag, MAX_QTY } from './bag';
import { bySlug } from '@/data/products';

const known = (s) => ['a', 'b', 'c'].includes(s);

describe('clampQty', () => {
  it('clamps to 0..MAX_QTY and floors', () => {
    assert.equal(clampQty(3.9), 3);
    assert.equal(clampQty(99), MAX_QTY);
    assert.equal(clampQty(-5), 0);
  });
  it('rejects non-numbers', () => {
    for (const bad of ['3', NaN, Infinity, null, undefined, true, {}, []]) assert.equal(clampQty(bad), 0);
  });
});

describe('sanitizeBag (corrupted or hostile storage)', () => {
  it('drops unknown slugs, bad quantities and non-objects', () => {
    assert.deepEqual(sanitizeBag({ a: 2, zzz: 3, b: -1, c: '4' }, known), { a: 2 });
    for (const bad of [null, undefined, 'x', 5, [], [1, 2]]) assert.deepEqual(sanitizeBag(bad, known), {});
  });
  it('caps quantities', () => {
    assert.deepEqual(sanitizeBag({ a: 500 }, known), { a: MAX_QTY });
  });
});

describe('sanitizeList', () => {
  it('keeps unique known string slugs only', () => {
    assert.deepEqual(sanitizeList(['a', 'a', 'zzz', 5, null, 'b'], known), ['a', 'b']);
    assert.deepEqual(sanitizeList('nope', known), []);
  });
});

describe('mergeBags', () => {
  it('takes the greater qty per slug, capped, over the union of slugs', () => {
    assert.deepEqual(mergeBags({ a: 2, b: 9 }, { a: 5, c: 1 }), { a: 5, b: 9, c: 1 });
    assert.deepEqual(mergeBags({ a: 10 }, { a: 10 }), { a: 10 });
  });
  it('is idempotent: merging the result again changes nothing', () => {
    const once = mergeBags({ a: 2, b: 3 }, { a: 4 });
    assert.deepEqual(mergeBags(once, { a: 4 }), once);
    assert.deepEqual(mergeBags(once, once), once);
  });
});

describe('mergeLists', () => {
  it('unions without duplicates and is idempotent', () => {
    const once = mergeLists(['a', 'b'], ['b', 'c']);
    assert.deepEqual(once, ['a', 'b', 'c']);
    assert.deepEqual(mergeLists(once, ['c']), once);
  });
});

describe('bagCount', () => {
  it('sums quantities', () => assert.equal(bagCount({ a: 2, b: 3 }), 5));
});

describe('resolveBag (product removed from catalog)', () => {
  it('skips slugs that no longer exist instead of crashing', () => {
    const rows = resolveBag({ 'luminous-oil-serum': 2, 'discontinued-thing': 1 }, bySlug);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].product.slug, 'luminous-oil-serum');
    assert.equal(rows[0].qty, 2);
  });
});
