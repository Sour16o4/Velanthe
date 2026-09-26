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

export const bagCount = (b) => Object.values(b).reduce((x, y) => x + y, 0);

export function resolveBag(b, lookup) {
  return Object.entries(b).flatMap(([slug, qty]) => {
    const product = lookup(slug);
    return product && qty > 0 ? [{ product, qty }] : [];
  });
}
