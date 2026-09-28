export const MAX_QTY = 10;

export const clampQty = (n) =>
  typeof n === 'number' && Number.isFinite(n) ? Math.min(MAX_QTY, Math.max(0, Math.floor(n))) : 0;

export function sanitizeBag(raw, isKnown) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [slug, q] of Object.entries(raw)) {
    const n = clampQty(q);
    if (n > 0 && isKnown(slug)) out[slug] = n;
  }
  return out;
}

export function sanitizeList(raw, isKnown) {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter((s) => typeof s === 'string' && isKnown(s)))];
}

// Combine a guest's bag with the account's saved bag: the larger quantity per product wins.
// Running it again with the same inputs changes nothing, so a repeated login merge is harmless.
export function mergeBags(a, b) {
  const out = {};
  for (const slug of new Set([...Object.keys(a), ...Object.keys(b)])) {
    out[slug] = clampQty(Math.max(a[slug] ?? 0, b[slug] ?? 0));
  }
  return out;
}

export const mergeLists = (a, b) => [...new Set([...a, ...b])];

export const bagCount = (b) => Object.values(b).reduce((x, y) => x + y, 0);

export function resolveBag(b, lookup) {
  return Object.entries(b).flatMap(([slug, qty]) => {
    const product = lookup(slug);
    return product && qty > 0 ? [{ product, qty }] : [];
  });
}
