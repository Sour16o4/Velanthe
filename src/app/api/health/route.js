import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

// Pinged twice a week by .github/workflows/keepalive.yml so a free Supabase project doesn't pause.
export async function GET() {
  // No Supabase project (e.g. a fresh checkout): report healthy without creating a client.
  if (!isSupabaseConfigured) return NextResponse.json({ ok: true, configured: false });

  const supabase = await createClient();
  // A GET, not `head: true`: a HEAD response has no body, so Supabase's error code would never arrive.
  const { error } = await supabase.from('bag_items').select('product_slug').limit(1);
  // This request is anonymous and schema.sql gives anonymous users no table access, so a healthy
  // project answers 42501 (insufficient_privilege). That still means the request reached Postgres
  // and woke the project, which is all this checks.
  const ok = !error || error.code === '42501';
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 });
}
