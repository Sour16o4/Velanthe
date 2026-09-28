create table public.bag_items (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product_slug text not null check (char_length(product_slug) between 1 and 80),
  qty int not null check (qty between 1 and 10),
  primary key (user_id, product_slug)
);
create table public.wishlist_items (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product_slug text not null check (char_length(product_slug) between 1 and 80),
  primary key (user_id, product_slug)
);
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total int not null check (total > 0),
  address jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.bag_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;

-- Users can read and change only their own bag and wishlist rows.
create policy "bag: own rows" on public.bag_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "wishlist: own rows" on public.wishlist_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
-- Orders: users can only read their own. There is NO insert/update/delete policy:
-- orders are written only by the server (service role), which prices them itself.
create policy "orders: read own" on public.orders for select to authenticated
  using (user_id = (select auth.uid()));

-- Supabase grants ALL on new tables to anon/authenticated by default. Revoke that and
-- grant back only what the app needs, so nothing depends on project-level defaults.
revoke all on public.bag_items, public.wishlist_items, public.orders from anon, authenticated;
grant select, insert, update, delete on public.bag_items, public.wishlist_items to authenticated;
grant select on public.orders to authenticated;
