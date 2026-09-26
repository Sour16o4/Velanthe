import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats minor units as rupees with Indian grouping', () => {
    expect(formatPrice(349900)).toBe('₹3,499');
    expect(formatPrice(12345600)).toBe('₹1,23,456');
  });
  it('formats zero', () => {
    expect(formatPrice(0)).toBe('₹0');
  });
});
