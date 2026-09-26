import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Service-role key: bypasses RLS, so this must never be imported by client code
// (the `server-only` import above makes that a build-time error) and must never
// be constructed unless the key is actually present.
export const admin = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
