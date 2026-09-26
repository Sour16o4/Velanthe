// Lets every entry point work as a guest-only store when no Supabase project
// is configured (e.g. local dev or a fresh checkout with no env vars set).
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
