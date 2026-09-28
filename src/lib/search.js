import { skinWords } from './skin';

// Words a product can be found by: its name, category, ingredients, essential oils, skin types
// ("dry skin"), and the brand-wide promises (organic, vegan, cruelty-free).
const haystack = (p) => [
  p.name, p.category, p.blurb, ...p.ingredients.map((i) => i.name), ...(p.oils ?? []).map((o) => o.name),
  ...skinWords(p), 'organic', 'vegan', 'cruelty-free',
].join(' ').toLowerCase();

export function searchProducts(q, list) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return list.filter((p) => haystack(p).includes(t));
}
