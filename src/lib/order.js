import { clampQty } from './bag';

// Errors whose message is safe to show the user. Anything else is replaced by a
// generic message, so raw server/database errors never reach the page.
export class OrderError extends Error {}

const FIELD_LABELS = {
  name: 'full name', line1: 'address', city: 'city', postcode: 'postcode', phone: 'phone number',
};

// `lines` comes from the browser, so it is untrusted: only slug and qty are read,
// and prices always come from the catalog.
export function buildOrder(lines, lookup) {
  if (!Array.isArray(lines) || lines.length === 0) throw new OrderError('Your bag is empty.');
  const items = lines.map((l) => {
    const p = lookup(l?.slug);
    if (!p) throw new OrderError('An item in your bag is no longer available.');
    if (typeof l.qty !== 'number' || !Number.isFinite(l.qty) || Math.floor(l.qty) < 1) throw new OrderError('Invalid quantity.');
    return { slug: p.slug, name: p.name, unitPrice: p.price, qty: clampQty(l.qty) };
  });
  return { items, total: items.reduce((s, i) => s + i.unitPrice * i.qty, 0) };
}

export function parseAddress(fd) {
  const get = (k) => String(fd.get(k) ?? '').trim();
  const a = { name: get('name'), line1: get('line1'), city: get('city'), postcode: get('postcode'), phone: get('phone') };
  for (const [k, v] of Object.entries(a)) {
    if (!v) throw new OrderError(`Please enter your ${FIELD_LABELS[k]}`);
    if (v.length > 120) throw new OrderError(`Please shorten your ${FIELD_LABELS[k]}`);
  }
  return a;
}
