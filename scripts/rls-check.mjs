// Checks that a signed-in user cannot write orders directly (only the server may).
// Run: node --env-file=.env.local scripts/rls-check.mjs
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await sb.auth.signInWithPassword({ email: process.env.NEXT_PUBLIC_DEMO_EMAIL, password: process.env.NEXT_PUBLIC_DEMO_PASSWORD });
if (error) throw error;

const res = await sb.from('orders').insert({ user_id: data.user.id, items: [], total: 1, address: {} });
// 42501 = insufficient_privilege
const ok = res.error?.code === '42501';
console.log(ok ? 'PASS' : 'FAIL', 'a user cannot insert orders', res.error ? `(${res.error.code})` : '(insert succeeded!)');
process.exit(ok ? 0 : 1);
