import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { remote } from '@/lib/remote';

const workingStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, key: () => null, length: 0 };
const setStorage = (value) => Object.defineProperty(globalThis, 'localStorage', { value, configurable: true, writable: true });

let copy = 0;
// Each test loads its own fresh copy of the store (the ?n makes Node treat it as a new module).
const freshStore = async () => (await import(`./shop.js?copy=${++copy}`)).useShop;

// Replace the network calls with fakes (the store calls them through this one shared object).
const fakeRemote = (over = {}) => {
  const calls = { upsertAll: [], setQty: [], setWish: [] };
  Object.assign(remote, {
    fetchAll: async () => ({ bag: {}, wishlist: [] }),
    upsertAll: async (...a) => { calls.upsertAll.push(a); },
    setQty: async (...a) => { calls.setQty.push(a); },
    setWish: async (...a) => { calls.setWish.push(a); },
    ...over,
  });
  return calls;
};

const SERUM = 'luminous-oil-serum';
const CREAM = 'barrier-repair-cream';

describe('guest bag and wishlist', () => {
  beforeEach(() => { setStorage(workingStorage); fakeRemote(); });

  it('ignores unknown slugs and removes an item at qty 0', async () => {
    const useShop = await freshStore();
    await useShop.getState().setQty('not-a-product', 3);
    assert.deepEqual(useShop.getState().bag, {});
    await useShop.getState().setQty(SERUM, 2);
    await useShop.getState().setQty(SERUM, 0);
    assert.deepEqual(useShop.getState().bag, {});
  });

  it('never calls the network while signed out', async () => {
    const calls = fakeRemote();
    const useShop = await freshStore();
    await useShop.getState().setQty(SERUM, 2);
    await useShop.getState().toggleWish(SERUM);
    assert.equal(calls.setQty.length + calls.setWish.length, 0);
  });
});

describe('a throwing localStorage (quota exceeded / Safari private mode)', () => {
  beforeEach(() => {
    fakeRemote();
    setStorage({ ...workingStorage, setItem: () => { throw new Error('QuotaExceededError'); } });
  });

  it('setQty and toggleWish still update state', async () => {
    const useShop = await freshStore();
    await assert.doesNotReject(useShop.getState().setQty(SERUM, 2));
    assert.equal(useShop.getState().bag[SERUM], 2);
    await assert.doesNotReject(useShop.getState().toggleWish(SERUM));
    assert.deepEqual(useShop.getState().wishlist, [SERUM]);
  });
});

describe('signing in merges the guest bag into the account (once)', () => {
  beforeEach(() => setStorage(workingStorage));

  it('keeps the larger quantity per product and saves the merged bag', async () => {
    const calls = fakeRemote({ fetchAll: async () => ({ bag: { [SERUM]: 5, [CREAM]: 1 }, wishlist: [CREAM] }) });
    const useShop = await freshStore();
    await useShop.getState().setQty(SERUM, 2);
    await useShop.getState().toggleWish(SERUM);
    await useShop.getState().signIn('user-1');

    assert.equal(useShop.getState().userId, 'user-1');
    assert.deepEqual(useShop.getState().bag, { [SERUM]: 5, [CREAM]: 1 });
    assert.deepEqual([...useShop.getState().wishlist].sort(), [CREAM, SERUM].sort());
    assert.equal(calls.upsertAll.length, 1);
    assert.deepEqual(calls.upsertAll[0][1], { [SERUM]: 5, [CREAM]: 1 });
  });

  it('two overlapping signIn calls share a single merge', async () => {
    let fetches = 0;
    fakeRemote({ fetchAll: async () => { fetches++; return { bag: {}, wishlist: [] }; } });
    const useShop = await freshStore();
    await Promise.all([useShop.getState().signIn('user-1'), useShop.getState().signIn('user-1')]);
    assert.equal(fetches, 1);
  });

  it('drops unknown products that the server returns', async () => {
    fakeRemote({ fetchAll: async () => ({ bag: { 'discontinued-thing': 3, [SERUM]: 1 }, wishlist: ['gone'] }) });
    const useShop = await freshStore();
    await useShop.getState().signIn('user-1');
    assert.deepEqual(useShop.getState().bag, { [SERUM]: 1 });
    assert.deepEqual(useShop.getState().wishlist, []);
  });

  it('a failed merge keeps the guest bag and stays signed out', async () => {
    fakeRemote({ fetchAll: async () => { throw new Error('offline'); } });
    const useShop = await freshStore();
    await useShop.getState().setQty(SERUM, 2);
    await useShop.getState().signIn('user-1');
    assert.equal(useShop.getState().userId, null);
    assert.deepEqual(useShop.getState().bag, { [SERUM]: 2 });
  });
});

describe('signIn races with signOut', () => {
  beforeEach(() => setStorage(workingStorage));

  // Without a guard, a merge that finishes after the user logged out would put the
  // account's bag into a signed-out store, from where it could reach the next login.
  it('discards a merge whose network call finishes after signOut', async () => {
    let finishFetch;
    fakeRemote({ fetchAll: () => new Promise((resolve) => { finishFetch = resolve; }) });
    const useShop = await freshStore();

    const signingIn = useShop.getState().signIn('user-1');
    useShop.getState().signOut(); // the user logged out while the merge was still running
    finishFetch({ bag: { [SERUM]: 3 }, wishlist: [SERUM] });
    await signingIn;

    assert.equal(useShop.getState().userId, null);
    assert.deepEqual(useShop.getState().bag, {});
    assert.deepEqual(useShop.getState().wishlist, []);
  });

  // signInWithPassword only ever emits SIGNED_IN, so switching account A -> B has no sign-out
  // in between. A's bag must not be merged into B's.
  it('switching directly from account A to account B does not carry A\'s bag over', async () => {
    const calls = fakeRemote();
    const useShop = await freshStore();
    await useShop.getState().signIn('user-A');
    useShop.setState({ bag: { [SERUM]: 5 }, wishlist: [SERUM] });

    await useShop.getState().signIn('user-B');

    for (const [, bag] of calls.upsertAll) assert.ok(!(SERUM in bag), 'A\'s bag was uploaded for B');
    assert.equal(useShop.getState().userId, 'user-B');
    assert.deepEqual(useShop.getState().bag, {});
    assert.deepEqual(useShop.getState().wishlist, []);
  });
});

describe('saving a change fails while signed in', () => {
  beforeEach(() => setStorage(workingStorage));

  it('undoes the change', async () => {
    fakeRemote({ setQty: async () => { throw new Error('offline'); } });
    const useShop = await freshStore();
    await useShop.getState().signIn('user-1');
    await useShop.getState().setQty(SERUM, 2);
    assert.deepEqual(useShop.getState().bag, {});
  });

  it('does not undo a newer change made while the first save was still in flight', async () => {
    let failFirst;
    let n = 0;
    fakeRemote({ setQty: () => (++n === 1 ? new Promise((_, reject) => { failFirst = reject; }) : Promise.resolve()) });
    const useShop = await freshStore();
    await useShop.getState().signIn('user-1');

    const first = useShop.getState().setQty(SERUM, 2); // this save will fail...
    await useShop.getState().setQty(SERUM, 3);          // ...but a newer one already succeeded
    failFirst(new Error('offline'));
    await first;

    assert.equal(useShop.getState().bag[SERUM], 3);
  });
});
