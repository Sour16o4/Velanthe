import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats minor units as rupees with Indian grouping', () => {
    assert.equal(formatPrice(349900), '₹3,499');
    assert.equal(formatPrice(12345600), '₹1,23,456');
  });
  it('formats zero', () => {
    assert.equal(formatPrice(0), '₹0');
  });
});
