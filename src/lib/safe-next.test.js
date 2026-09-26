import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it('allows same-site paths', () => {
    assert.equal(safeNext('/checkout'), '/checkout');
    assert.equal(safeNext('/account/orders?x=1'), '/account/orders?x=1');
  });
  it('falls back to / for missing, external, protocol-relative or malformed values', () => {
    for (const bad of [null, undefined, '', 'https://evil.com', '//evil.com', '/\\evil.com', 'javascript:alert(1)', 'evil.com', '/\nfoo', '/\t/evil.com', '/\t\t/evil.com', '/\u0000/evil.com', '/..//evil.com', ' /evil']) {
      assert.equal(safeNext(bad), '/', `input: ${JSON.stringify(bad)}`);
    }
  });
});
