create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total int not null check (total > 0),
  address jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Users may read their own orders only. There is NO insert/update/delete policy:
-- orders are written only by the server (service role), which prices them itself.
create policy "orders: read own" on public.orders for select to authenticated
  using (user_id = (select auth.uid()));

-- Supabase grants ALL on new tables to anon/authenticated by default; revoke that
-- and grant back only reading.
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
