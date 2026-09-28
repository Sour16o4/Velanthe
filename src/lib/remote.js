import { createClient } from '@/lib/supabase/client';

// The signed-in user's bag and wishlist live in two Supabase tables (see supabase/schema.sql).
// Row-level security means every query only ever sees the current user's own rows.

async function fetchAll() {
  const sb = createClient();
  const [b, w] = await Promise.all([
    sb.from('bag_items').select('product_slug, qty'),
    sb.from('wishlist_items').select('product_slug'),
  ]);
  if (b.error) throw b.error;
  if (w.error) throw w.error;
  return {
    bag: Object.fromEntries(b.data.map((r) => [r.product_slug, r.qty])),
    wishlist: w.data.map((r) => r.product_slug),
  };
}

// Upsert (never delete), so running a merge twice, or from two tabs, is harmless.
async function upsertAll(userId, bag, wishlist) {
  const sb = createClient();
  const bagRows = Object.entries(bag).map(([product_slug, qty]) => ({ user_id: userId, product_slug, qty }));
  const wishRows = wishlist.map((product_slug) => ({ user_id: userId, product_slug }));
  if (bagRows.length) {
    const { error } = await sb.from('bag_items').upsert(bagRows, { onConflict: 'user_id,product_slug' });
    if (error) throw error;
  }
  if (wishRows.length) {
    const { error } = await sb.from('wishlist_items').upsert(wishRows, { onConflict: 'user_id,product_slug' });
    if (error) throw error;
  }
}

async function setQty(userId, slug, qty) {
  const sb = createClient();
  const { error } = qty > 0
    ? await sb.from('bag_items').upsert({ user_id: userId, product_slug: slug, qty }, { onConflict: 'user_id,product_slug' })
    : await sb.from('bag_items').delete().eq('user_id', userId).eq('product_slug', slug);
  if (error) throw error;
}

async function setWish(userId, slug, on) {
  const sb = createClient();
  const { error } = on
    ? await sb.from('wishlist_items').upsert({ user_id: userId, product_slug: slug }, { onConflict: 'user_id,product_slug' })
    : await sb.from('wishlist_items').delete().eq('user_id', userId).eq('product_slug', slug);
  if (error) throw error;
}

// One object (not four exports) so tests can swap the network calls for fakes.
export const remote = { fetchAll, upsertAll, setQty, setWish };
