import { describe, it, expect } from 'vitest';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it('allows same-site paths', () => {
    expect(safeNext('/checkout')).toBe('/checkout');
    expect(safeNext('/account/orders?x=1')).toBe('/account/orders?x=1');
  });
  it('falls back to / for missing, external, protocol-relative or malformed values', () => {
    for (const bad of [null, undefined, '', 'https://evil.com', '//evil.com', '/\\evil.com', 'javascript:alert(1)', 'evil.com', '/\nfoo', '/\t/evil.com', '/\t\t/evil.com', '/\u0000/evil.com', '/..//evil.com', ' /evil']) {
      expect(safeNext(bad)).toBe('/');
    }
  });
});
