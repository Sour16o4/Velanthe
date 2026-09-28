// Checks Supabase's row-level security: users can't write other people's rows or orders directly.
// Run: node --env-file=.env.local scripts/rls-check.mjs
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await sb.auth.signInWithPassword({ email: process.env.NEXT_PUBLIC_DEMO_EMAIL, password: process.env.NEXT_PUBLIC_DEMO_PASSWORD });
if (error) throw error;
const me = data.user.id;
const other = '00000000-0000-0000-0000-000000000001';

// Postgres error codes: 42501 = insufficient_privilege (blocked by security rules), 23514 = check_violation.
const BLOCKED = '42501';
const CHECK_VIOLATION = '23514';

const cases = [
  ['inserting into orders is blocked', () => sb.from('orders').insert({ user_id: me, items: [], total: 1, address: {} }), BLOCKED],
  ['inserting a bag row for another user is blocked', () => sb.from('bag_items').insert({ user_id: other, product_slug: 'x', qty: 1 }), BLOCKED],
  ['qty 99 is rejected', () => sb.from('bag_items').insert({ user_id: me, product_slug: 'x', qty: 99 }), CHECK_VIOLATION],
  ['qty -5 is rejected', () => sb.from('bag_items').insert({ user_id: me, product_slug: 'x', qty: -5 }), CHECK_VIOLATION],
  ['your own valid row is allowed', () => sb.from('bag_items').upsert({ user_id: me, product_slug: 'rls-check', qty: 1 }), null],
];
let failed = 0;
for (const [name, run, wantCode] of cases) {
  const { error } = await run();
  const ok = wantCode ? error?.code === wantCode : !error;
  console.log(ok ? 'PASS' : 'FAIL', name, error ? `(${error.code}: ${error.message})` : '');
  if (!ok) failed++;
}
await sb.from('bag_items').delete().eq('product_slug', 'rls-check');
process.exit(failed ? 1 : 0);
