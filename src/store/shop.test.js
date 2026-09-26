import { describe, it, expect, beforeEach, vi } from 'vitest';

// A throwing setItem simulates quota-exceeded / Safari private mode: store
// actions must still work instead of throwing.
describe('useShop with a throwing localStorage', () => {
  beforeEach(() => {
    vi.resetModules();
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => { throw new Error('QuotaExceededError'); },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
  });

  it('setQty and toggleWish still update state', async () => {
    const { useShop } = await import('./shop');
    expect(() => useShop.getState().setQty('luminous-oil-serum', 2)).not.toThrow();
    expect(useShop.getState().bag['luminous-oil-serum']).toBe(2);
    expect(() => useShop.getState().toggleWish('luminous-oil-serum')).not.toThrow();
    expect(useShop.getState().wishlist).toEqual(['luminous-oil-serum']);
  });

  it('ignores unknown slugs and removes an item at qty 0', async () => {
    const { useShop } = await import('./shop');
    useShop.getState().setQty('not-a-product', 3);
    expect(useShop.getState().bag).toEqual({});
    useShop.getState().setQty('luminous-oil-serum', 2);
    useShop.getState().setQty('luminous-oil-serum', 0);
    expect(useShop.getState().bag).toEqual({});
  });
});
