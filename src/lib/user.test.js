import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanName, displayName, firstName } from './user';

describe('cleanName', () => {
  it('trims, collapses spaces and caps the length', () => {
    assert.equal(cleanName('  Asha   Rao  '), 'Asha Rao');
    assert.equal(cleanName('x'.repeat(200)).length, 80);
  });
  it('turns non-strings into an empty string', () => {
    for (const bad of [null, undefined, 5, {}, []]) assert.equal(cleanName(bad), '');
  });
});

describe('displayName / firstName', () => {
  it('uses the name saved at signup', () => {
    const u = { email: 'a@b.com', user_metadata: { full_name: 'Asha Rao' } };
    assert.equal(displayName(u), 'Asha Rao');
    assert.equal(firstName(u), 'Asha');
  });
  it('falls back to the email name for older accounts', () => {
    assert.equal(displayName({ email: 'priya.sharma@example.com' }), 'Priya Sharma');
    assert.equal(firstName({ email: 'priya.sharma@example.com', user_metadata: {} }), 'Priya');
  });
  it('never returns an empty name', () => {
    for (const u of [null, undefined, {}, { email: '' }, { email: '@x.com' }, { user_metadata: { full_name: '   ' } }]) {
      assert.equal(displayName(u), 'friend');
    }
  });
});
