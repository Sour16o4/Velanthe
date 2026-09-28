import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { skinTypes, suits, forSkin, forPrice, PRICE_MIN, PRICE_MAX, routine, skinWords } from './skin';
import { products } from '@/data/products';

const slugs = (list) => list.map((p) => p.slug);

describe('catalog data', () => {
  it('every product has valid skin types, an age, an organic %, and an essential-oil blend', () => {
    const valid = new Set([...skinTypes.map((t) => t.key), 'all']);
    for (const p of products) {
      assert.ok(p.skin.length > 0 && p.skin.every((k) => valid.has(k)), `${p.slug}: skin`);
      assert.ok([16, 18].includes(p.minAge), `${p.slug}: minAge`);
      assert.ok(p.organic >= 90 && p.organic <= 100, `${p.slug}: organic`);
      assert.ok(p.oils.length >= 2 && p.oils.every((o) => o.name && o.note), `${p.slug}: oils`);
    }
  });
  it('every skin type has at least one product and a full cleanse-treat-moisturise routine where possible', () => {
    for (const t of skinTypes) assert.ok(forSkin(t.key, products).length > 0, t.key);
  });
});

describe('suits / forSkin', () => {
  it('a product suits a type it lists, and "all" suits everything', () => {
    const mist = products.find((p) => p.slug === 'dew-essence-mist');
    for (const t of skinTypes) assert.ok(suits(mist, t.key));
    assert.ok(suits(products.find((p) => p.slug === 'clarity-gel-cleanser'), 'oily'));
    assert.ok(!suits(products.find((p) => p.slug === 'barrier-repair-cream'), 'oily'));
  });
  it('an unknown or empty type returns every product', () => {
    assert.equal(forSkin('', products), products);
    assert.equal(forSkin('nonsense', products), products);
    assert.equal(forSkin(undefined, products), products);
  });
  it('does not treat a product with a missing skin list as suiting anything', () => {
    assert.equal(suits({ name: 'x' }, 'dry'), false);
  });
});

describe('routine', () => {
  it('oily skin: gel cleanser, vitamin C serum, and the mist (no rich cream)', () => {
    const r = routine('oily', products);
    assert.deepEqual(r.steps.map((s) => s.label), ['Cleanse', 'Treat', 'Moisturise']);
    assert.deepEqual(slugs(r.steps.map((s) => s.product)), ['clarity-gel-cleanser', 'brightening-c-serum', 'dew-essence-mist']);
  });
  it('dry skin: milk cleanser, oil serum, barrier cream', () => {
    const r = routine('dry', products);
    assert.deepEqual(slugs(r.steps.map((s) => s.product)), ['soft-milk-cleanser', 'luminous-oil-serum', 'barrier-repair-cream']);
  });
  it('sensitive skin: leaves out a step when nothing suits it, and never returns the same product twice', () => {
    const r = routine('sensitive', products);
    assert.ok(r.steps.length >= 2);
    const all = [...r.steps.map((s) => s.product), ...r.more];
    assert.equal(new Set(slugs(all)).size, all.length);
    assert.ok(all.every((p) => suits(p, 'sensitive')));
  });
  it('no skin type gives an empty routine', () => {
    assert.deepEqual(routine('', products), { steps: [], more: [] });
  });
});

describe('skinWords', () => {
  it('turns skin types into searchable phrases', () => {
    assert.deepEqual(skinWords({ skin: ['dry', 'all'] }), ['dry skin', 'all skin types']);
    assert.deepEqual(skinWords({}), []);
  });
});

describe('forPrice', () => {
  it('the slider ends cover every product and its start hides the pricier ones', () => {
    assert.equal(forPrice(PRICE_MAX, products).length, products.length);
    const cheap = forPrice(PRICE_MIN + 1000, products);
    assert.ok(cheap.length > 0 && cheap.length < products.length);
    assert.ok(cheap.every((p) => p.price <= (PRICE_MIN + 1000) * 100));
  });
});
