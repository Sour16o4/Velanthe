import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// A localStorage whose setItem throws simulates quota-exceeded / Safari private
// mode: store actions must still work instead of throwing.
const throwingStorage = {
  getItem: () => null,
  setItem: () => { throw new Error('QuotaExceededError'); },
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

let copy = 0;
// Each test loads its own fresh copy of the store module (the ?n makes Node treat it as a new module).
const freshStore = async () => (await import(`./shop.js?copy=${++copy}`)).useShop;

describe('useShop with a throwing localStorage', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', { value: throwingStorage, configurable: true, writable: true });
  });

  it('setQty and toggleWish still update state', async () => {
    const useShop = await freshStore();
    assert.doesNotThrow(() => useShop.getState().setQty('luminous-oil-serum', 2));
    assert.equal(useShop.getState().bag['luminous-oil-serum'], 2);
    assert.doesNotThrow(() => useShop.getState().toggleWish('luminous-oil-serum'));
    assert.deepEqual(useShop.getState().wishlist, ['luminous-oil-serum']);
  });

  it('ignores unknown slugs and removes an item at qty 0', async () => {
    const useShop = await freshStore();
    useShop.getState().setQty('not-a-product', 3);
    assert.deepEqual(useShop.getState().bag, {});
    useShop.getState().setQty('luminous-oil-serum', 2);
    useShop.getState().setQty('luminous-oil-serum', 0);
    assert.deepEqual(useShop.getState().bag, {});
  });
});
