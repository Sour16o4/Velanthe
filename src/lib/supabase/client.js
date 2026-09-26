import { createBrowserClient } from '@supabase/ssr';

// Only ever called from paths guarded by `isSupabaseConfigured` (AuthForm, LogoutButton).
export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
