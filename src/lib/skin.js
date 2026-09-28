// Skin types and simple product recommendations. Pure functions, no DOM, so they are easy to test.

export const skinTypes = [
  { key: 'dry', label: 'Dry', blurb: 'Tight, rough or flaky. Needs comfort and rich moisture.' },
  { key: 'oily', label: 'Oily', blurb: 'Shiny, with visible pores. Needs balance without heaviness.' },
  { key: 'combination', label: 'Combination', blurb: 'Oily in the T-zone, drier on the cheeks. Needs lightweight balance.' },
  { key: 'sensitive', label: 'Sensitive', blurb: 'Reacts easily. Needs gentle, calming formulas.' },
  { key: 'normal', label: 'Normal', blurb: 'Balanced and even. Needs simple, steady care.' },
];

// A product suits a skin type if it lists that type, or lists 'all'.
export const suits = (product, type) => Array.isArray(product.skin) && (product.skin.includes('all') || product.skin.includes(type));

// Products suited to one skin type; with no type (or an unknown one) every product is returned.
export function forSkin(type, list) {
  if (!skinTypes.some((t) => t.key === type)) return list;
  return list.filter((p) => suits(p, type));
}

// The collection's price slider runs from PRICE_MIN to PRICE_MAX rupees in PRICE_STEP steps; PRICE_MAX means "no limit".
export const PRICE_MIN = 1000, PRICE_MAX = 4500, PRICE_STEP = 100;

// Products costing at most `maxRupees` (product prices are paise, see products.js).
export const forPrice = (maxRupees, list) => list.filter((p) => p.price <= maxRupees * 100);

// Words a product can be found by, e.g. "dry skin", "all skin types", "lavender", "vegan".
export function skinWords(product) {
  return (product.skin ?? []).map((k) => (k === 'all' ? 'all skin types' : `${k} skin`));
}

// A daily routine for one skin type: cleanse, treat, moisturise (each picks the first product that suits).
// A step with no suitable product is left out. `more` are other products that suit the same skin.
const STEPS = [
  { label: 'Cleanse', categories: ['Cleanser'] },
  { label: 'Treat', categories: ['Serum'] },
  { label: 'Moisturise', categories: ['Cream', 'Mist'] },
];
export function routine(type, list) {
  const matches = forSkin(type, list);
  if (matches === list) return { steps: [], more: [] };
  const steps = [];
  for (const step of STEPS) {
    // Prefer a product made for this type over an "all skin types" one; keep the category order.
    const product = step.categories.map((c) => {
      const inCat = matches.filter((p) => p.category === c);
      return inCat.find((p) => !p.skin.includes('all')) ?? inCat[0];
    }).find(Boolean);
    if (product) steps.push({ label: step.label, product });
  }
  const used = new Set(steps.map((s) => s.product.slug));
  return { steps, more: matches.filter((p) => !used.has(p.slug)) };
}
