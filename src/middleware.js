import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function redirectToLogin(request) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export async function middleware(request) {
  // No Supabase project configured: protected paths still gate behind /login,
  // but without ever constructing a client (which needs a real URL/key).
  if (!isSupabaseConfigured) return redirectToLogin(request);

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirectToLogin(request);
  return response;
}

export const config = { matcher: ['/account/:path*', '/checkout/:path*'] };
