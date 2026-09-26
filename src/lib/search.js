export function searchProducts(q, list) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return list.filter((p) =>
    [p.name, p.category, p.blurb, ...p.ingredients.map((i) => i.name)].join(' ').toLowerCase().includes(t));
}
