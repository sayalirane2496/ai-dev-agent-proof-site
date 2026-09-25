-- Versioned schema for the Burger King-style ordering app.
-- Applied to the connected development project only. No destructive statements.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'restaurant')),
  restaurant_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id text primary key,
  name text not null,
  locality text not null,
  city text not null,
  address text not null,
  distance_km numeric not null default 0,
  eta_min text not null,
  is_open boolean not null default true,
  timing text not null,
  services text[] not null default '{}',
  rating numeric(2,1) not null default 4.5,
  reviews_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_restaurant_fk
  foreign key (restaurant_id) references public.restaurants (id);

create table if not exists public.delivery_settings (
  id text primary key default 'default',
  delivery_fee_inr integer not null default 35,
  free_delivery_threshold_inr integer not null default 299,
  tax_rate numeric not null default 0.05,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  label text not null,
  icon text not null default '',
  sort_order integer not null default 0,
  display_count integer not null default 0
);

create table if not exists public.products (
  id text primary key,
  category_id text not null references public.categories (id),
  name text not null,
  description text not null,
  price_inr integer not null check (price_inr >= 0),
  original_price_inr integer,
  is_veg boolean not null,
  badge text,
  calories text,
  spice_level smallint check (spice_level between 0 and 3),
  image_path text not null,
  is_active boolean not null default true,
  cheese_allowed boolean not null default false,
  extra_patty_allowed boolean not null default false,
  can_make_meal boolean not null default false,
  is_combo_burger boolean not null default false,
  is_upsell boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products (id) on delete cascade,
  group_key text not null check (group_key in ('sauce', 'size', 'topping')),
  name text not null,
  price_delta_inr integer not null default 0,
  sort_order integer not null default 0
);

create index if not exists product_options_product_idx on public.product_options (product_id, group_key);

create table if not exists public.combo_sides (
  id text primary key,
  kind text not null check (kind in ('fries', 'drink')),
  name text not null,
  price_delta_inr integer not null,
  image_path text,
  tag text,
  is_hot boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists public.coupons (
  id text primary key,
  code text not null unique,
  title text not null,
  description text not null,
  discount_badge text not null,
  min_order_inr integer not null default 0,
  discount_type text not null check (discount_type in ('percentage', 'flat')),
  discount_value integer not null,
  max_discount_inr integer,
  category text not null default 'all',
  image_path text not null,
  is_active boolean not null default true,
  is_personal boolean not null default false,
  owner_id uuid references public.profiles (id) on delete cascade
);

create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_code text not null,
  user_id uuid references public.profiles (id),
  order_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  flat_building text not null,
  landmark text not null default '',
  locality text not null default '',
  city text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  user_id uuid references public.profiles (id),
  restaurant_id text not null references public.restaurants (id),
  fulfillment_type text not null check (fulfillment_type in ('delivery', 'pickup')),
  status text not null check (status in ('Confirmed', 'Grilling', 'Out for Delivery', 'Delivered', 'Cancelled')),
  contact_name text not null,
  contact_phone text not null,
  delivery_address text not null default '',
  delivery_note text not null default '',
  subtotal_inr integer not null,
  delivery_fee_inr integer not null,
  tax_inr integer not null,
  discount_inr integer not null,
  total_inr integer not null,
  coupon_code text,
  payment_method text not null,
  payment_status text not null,
  rider_name text,
  rider_phone text,
  placed_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, placed_at desc);
create index if not exists orders_restaurant_idx on public.orders (restaurant_id, placed_at desc);
create index if not exists orders_code_idx on public.orders (public_code);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text,
  product_name text not null,
  is_veg boolean not null,
  unit_price_inr integer not null,
  quantity integer not null check (quantity > 0),
  image_path text,
  customizations jsonb not null default '{}'
);

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  method text not null,
  upi_app text,
  provider text not null default 'sandbox_mock',
  provider_ref text,
  status text not null,
  amount_inr integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reward_accounts (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.reward_catalog (
  id text primary key,
  name text not null,
  points_cost integer not null,
  icon text not null,
  credit_inr integer not null default 0
);

create table if not exists public.reward_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  delta integer not null,
  reason text not null,
  catalog_id text,
  order_id uuid,
  created_at timestamptz not null default now()
);

-- Auth profile bootstrap
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'guest'), '@', 1)),
    new.phone,
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;

  insert into public.reward_accounts (user_id, points)
  values (new.id, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_kitchen()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'restaurant')
  );
$$;

create or replace function public.coupon_discount(promo_code text, subtotal integer)
returns integer
language plpgsql
stable
as $$
declare
  c public.coupons%rowtype;
  amt integer := 0;
begin
  if promo_code is null or btrim(promo_code) = '' or subtotal <= 0 then
    return 0;
  end if;

  select * into c from public.coupons where upper(coupons.code) = upper(btrim(promo_code)) and is_active = true;
  if not found then
    return 0;
  end if;

  if upper(c.code) = 'KING50' then
    if subtotal >= 199 then
      amt := least(coalesce(c.max_discount_inr, 100), round(subtotal * 0.5)::int);
    end if;
  elsif upper(c.code) = 'BOGO79' then
    amt := 59;
  elsif upper(c.code) = 'MEALUP' then
    amt := 99;
  elsif upper(c.code) = 'FEAST150' then
    if subtotal >= 499 then amt := 150; end if;
  elsif upper(c.code) = 'SWEETKING' then
    if subtotal >= 299 then amt := 99; end if;
  else
    if subtotal < c.min_order_inr then
      amt := 0;
    elsif c.discount_type = 'percentage' then
      amt := round(subtotal * c.discount_value / 100.0)::int;
      if c.max_discount_inr is not null then
        amt := least(amt, c.max_discount_inr);
      end if;
    else
      amt := c.discount_value;
    end if;
  end if;

  return greatest(0, amt);
end;
$$;

create or replace function public.compute_unit_price(p public.products, cust jsonb)
returns integer
language plpgsql
stable
as $$
declare
  unit integer;
  sauce_name text;
  size_name text;
  sauce_delta integer := 0;
  size_delta integer := 0;
begin
  unit := p.price_inr;
  if coalesce((cust->>'extraCheese')::boolean, false) then
    unit := unit + 25;
  end if;
  if coalesce((cust->>'extraPatty')::boolean, false) then
    unit := unit + 90;
  end if;
  if coalesce((cust->>'isMeal')::boolean, false) then
    unit := unit + 99;
  end if;

  sauce_name := nullif(cust->>'selectedSauce', '');
  size_name := nullif(cust->>'selectedSize', '');

  if sauce_name is not null then
    select po.price_delta_inr into sauce_delta
    from public.product_options po
    where po.product_id = p.id and po.group_key = 'sauce' and po.name = sauce_name;
    unit := unit + coalesce(sauce_delta, 0);
  end if;

  if size_name is not null and size_name <> 'Regular' then
    select po.price_delta_inr into size_delta
    from public.product_options po
    where po.product_id = p.id and po.group_key = 'size' and po.name = size_name;
    unit := unit + coalesce(size_delta, 0);
  end if;

  return unit;
end;
$$;

create or replace function public.quote_cart(payload jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  item jsonb;
  p public.products%rowtype;
  settings public.delivery_settings%rowtype;
  burger public.products%rowtype;
  fries public.combo_sides%rowtype;
  drink public.combo_sides%rowtype;
  cust jsonb;
  qty integer;
  unit integer;
  subtotal integer := 0;
  delivery_fee integer := 0;
  tax integer := 0;
  discount integer := 0;
  fulfillment text;
  coupon text;
  lines jsonb := '[]'::jsonb;
  pid text;
begin
  select * into settings from public.delivery_settings where id = 'default';
  if not found then
    settings.delivery_fee_inr := 35;
    settings.free_delivery_threshold_inr := 299;
    settings.tax_rate := 0.05;
  end if;

  fulfillment := coalesce(payload->>'fulfillmentType', 'delivery');
  coupon := nullif(upper(btrim(coalesce(payload->>'couponCode', ''))), '');

  for item in select jsonb_array_elements(coalesce(payload->'items', '[]'::jsonb))
  loop
    pid := item->>'productId';
    qty := greatest(1, coalesce((item->>'quantity')::int, 1));
    cust := coalesce(item->'customizations', '{}'::jsonb);

    if pid like 'combo-%' then
      select * into burger from public.products where id = replace(pid, 'combo-', '') and is_active;
      if not found then
        continue;
      end if;
      select * into fries from public.combo_sides where name = coalesce(cust->>'mealFries', '') and kind = 'fries';
      select * into drink from public.combo_sides where name = coalesce(cust->>'mealDrink', '') and kind = 'drink';
      unit := burger.price_inr + coalesce(fries.price_delta_inr, 40) + coalesce(drink.price_delta_inr, 30);
      lines := lines || jsonb_build_array(jsonb_build_object(
        'productId', pid,
        'productName', burger.name || ' Royal Meal',
        'isVeg', burger.is_veg,
        'unitPrice', unit,
        'quantity', qty,
        'image', burger.image_path,
        'customizations', cust
      ));
      subtotal := subtotal + unit * qty;
    else
      select * into p from public.products where id = pid and is_active;
      if not found then
        continue;
      end if;
      unit := public.compute_unit_price(p, cust);
      lines := lines || jsonb_build_array(jsonb_build_object(
        'productId', p.id,
        'productName', p.name,
        'isVeg', p.is_veg,
        'unitPrice', unit,
        'quantity', qty,
        'image', p.image_path,
        'customizations', cust
      ));
      subtotal := subtotal + unit * qty;
    end if;
  end loop;

  if fulfillment = 'pickup' or subtotal = 0 then
    delivery_fee := 0;
  elsif subtotal >= settings.free_delivery_threshold_inr then
    delivery_fee := 0;
  else
    delivery_fee := settings.delivery_fee_inr;
  end if;

  tax := round(subtotal * settings.tax_rate)::int;
  discount := public.coupon_discount(coupon, subtotal);

  return jsonb_build_object(
    'lines', lines,
    'subtotal', subtotal,
    'deliveryFee', delivery_fee,
    'taxes', tax,
    'discountAmount', discount,
    'totalAmount', greatest(0, subtotal + delivery_fee + tax - discount),
    'appliedCoupon', coupon,
    'fulfillmentType', fulfillment
  );
end;
$$;

create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  q jsonb;
  oid uuid;
  code text;
  line jsonb;
  restaurant_id text;
  payment_method text;
  payment_status text;
  uid uuid;
begin
  q := public.quote_cart(payload);
  if coalesce((q->>'subtotal')::int, 0) <= 0 then
    raise exception 'CART_EMPTY';
  end if;

  restaurant_id := coalesce(payload->>'restaurantId', 'loc-andheri');
  if not exists (select 1 from public.restaurants r where r.id = restaurant_id) then
    raise exception 'RESTAURANT_NOT_FOUND';
  end if;

  payment_method := coalesce(payload->>'paymentMethod', 'cod');
  if payment_method = 'cod' then
    payment_status := 'cod_pending';
  else
    payment_status := 'sandbox_recorded';
  end if;

  uid := auth.uid();
  oid := gen_random_uuid();
  code := 'BK-IN-' || lpad((floor(random() * 90000) + 10000)::int::text, 5, '0');

  insert into public.orders (
    id, public_code, user_id, restaurant_id, fulfillment_type, status,
    contact_name, contact_phone, delivery_address, delivery_note,
    subtotal_inr, delivery_fee_inr, tax_inr, discount_inr, total_inr, coupon_code,
    payment_method, payment_status, rider_name, rider_phone
  ) values (
    oid, code, uid, restaurant_id, coalesce(payload->>'fulfillmentType', 'delivery'), 'Confirmed',
    coalesce(nullif(payload->>'contactName', ''), 'Guest'),
    coalesce(nullif(payload->>'contactPhone', ''), '0000000000'),
    coalesce(payload->>'deliveryAddress', ''),
    coalesce(payload->>'deliveryNote', ''),
    (q->>'subtotal')::int, (q->>'deliveryFee')::int, (q->>'taxes')::int,
    (q->>'discountAmount')::int, (q->>'totalAmount')::int, q->>'appliedCoupon',
    payment_method, payment_status, 'Ramesh K. (Valet)', '+91 98201 43210'
  );

  insert into public.order_status_events (order_id, status) values (oid, 'Confirmed');

  for line in select jsonb_array_elements(q->'lines')
  loop
    insert into public.order_items (
      order_id, product_id, product_name, is_veg, unit_price_inr, quantity, image_path, customizations
    ) values (
      oid, line->>'productId', line->>'productName', coalesce((line->>'isVeg')::boolean, true),
      (line->>'unitPrice')::int, (line->>'quantity')::int, line->>'image', coalesce(line->'customizations', '{}'::jsonb)
    );
  end loop;

  insert into public.payments (order_id, method, upi_app, provider, provider_ref, status, amount_inr)
  values (
    oid, payment_method, payload->>'upiApp', 'sandbox_mock', 'mock-' || code,
    payment_status, (q->>'totalAmount')::int
  );

  if uid is not null then
    insert into public.reward_transactions (user_id, delta, reason, order_id)
    values (uid, ((q->>'totalAmount')::int / 100) * 10, 'earn', oid);
    update public.reward_accounts
      set points = points + ((q->>'totalAmount')::int / 100) * 10, updated_at = now()
      where user_id = uid;
  end if;

  return jsonb_build_object(
    'orderId', oid,
    'publicCode', code,
    'status', 'Confirmed',
    'paymentStatus', payment_status,
    'paymentProvider', 'sandbox_mock',
    'totalAmount', (q->>'totalAmount')::int,
    'isSandboxPayment', payment_method <> 'cod'
  );
end;
$$;

create or replace function public.redeem_reward(catalog_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  pts integer;
  item public.reward_catalog%rowtype;
  personal_code text;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into item from public.reward_catalog where id = catalog_id;
  if not found then
    raise exception 'REWARD_NOT_FOUND';
  end if;

  select points into pts from public.reward_accounts where user_id = uid for update;
  if pts is null then
    insert into public.reward_accounts (user_id, points) values (uid, 0);
    pts := 0;
  end if;

  if pts < item.points_cost then
    raise exception 'INSUFFICIENT_POINTS';
  end if;

  update public.reward_accounts set points = points - item.points_cost, updated_at = now() where user_id = uid;
  insert into public.reward_transactions (user_id, delta, reason, catalog_id)
  values (uid, -item.points_cost, 'redeem', catalog_id);

  personal_code := 'RWD' || substr(replace(catalog_id, 'rew-', ''), 1, 6) || substr(uid::text, 1, 4);
  insert into public.coupons (
    id, code, title, description, discount_badge, min_order_inr, discount_type, discount_value,
    category, image_path, is_active, is_personal, owner_id
  ) values (
    gen_random_uuid()::text, upper(personal_code), item.name, 'King Club redemption',
    'REWARD', 0, 'flat', item.credit_inr, 'all', '/images/product_peri_peri_fries_1790177579321.jpg',
    true, true, uid
  )
  on conflict (code) do nothing;

  return jsonb_build_object('ok', true, 'points', pts - item.points_cost, 'couponCode', upper(personal_code), 'name', item.name);
end;
$$;

create or replace function public.admin_set_order_status(order_public_code text, next_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
  staff public.profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into staff from public.profiles where id = auth.uid();
  if staff.role not in ('admin', 'restaurant') then
    raise exception 'FORBIDDEN';
  end if;

  if next_status not in ('Confirmed', 'Grilling', 'Out for Delivery', 'Delivered', 'Cancelled') then
    raise exception 'INVALID_STATUS';
  end if;

  select * into o from public.orders where public_code = order_public_code;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if staff.role = 'restaurant' and staff.restaurant_id is not null and o.restaurant_id <> staff.restaurant_id then
    raise exception 'FORBIDDEN';
  end if;

  update public.orders set status = next_status where id = o.id;
  insert into public.order_status_events (order_id, status) values (o.id, next_status);

  return jsonb_build_object('ok', true, 'publicCode', o.public_code, 'status', next_status);
end;
$$;

grant execute on function public.quote_cart(jsonb) to anon, authenticated;
grant execute on function public.place_order(jsonb) to anon, authenticated;
grant execute on function public.redeem_reward(text) to authenticated;
grant execute on function public.admin_set_order_status(text, text) to authenticated;
grant execute on function public.coupon_discount(text, integer) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.delivery_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_options enable row level security;
alter table public.combo_sides enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;
alter table public.payments enable row level security;
alter table public.reward_accounts enable row level security;
alter table public.reward_catalog enable row level security;
alter table public.reward_transactions enable row level security;

create policy restaurants_read on public.restaurants for select using (true);
create policy categories_read on public.categories for select using (true);
create policy products_read on public.products for select using (is_active or public.is_admin());
create policy product_options_read on public.product_options for select using (true);
create policy combo_sides_read on public.combo_sides for select using (true);
create policy delivery_settings_read on public.delivery_settings for select using (true);
create policy coupons_read on public.coupons for select using (is_active and (not is_personal or owner_id = auth.uid() or public.is_admin()));
create policy reward_catalog_read on public.reward_catalog for select using (true);

create policy profiles_self on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy addresses_own on public.addresses for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy orders_own_select on public.orders for select using (
  user_id = auth.uid()
  or public.is_admin()
  or (public.is_kitchen() and exists (
    select 1 from public.profiles p where p.id = auth.uid() and (p.role = 'admin' or p.restaurant_id = orders.restaurant_id)
  ))
);

create policy order_items_select on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (
    o.user_id = auth.uid() or public.is_admin() or public.is_kitchen()
  ))
);

create policy order_events_select on public.order_status_events for select using (
  exists (select 1 from public.orders o where o.id = order_id and (
    o.user_id = auth.uid() or public.is_admin() or public.is_kitchen()
  ))
);

create policy payments_select on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

create policy rewards_own on public.reward_accounts for select using (user_id = auth.uid() or public.is_admin());
create policy reward_tx_own on public.reward_transactions for select using (user_id = auth.uid() or public.is_admin());

create policy catalog_admin_write_categories on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy catalog_admin_write_products on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy catalog_admin_write_options on public.product_options for all using (public.is_admin()) with check (public.is_admin());
create policy catalog_admin_write_coupons on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy catalog_admin_write_restaurants on public.restaurants for all using (public.is_admin()) with check (public.is_admin());
create policy catalog_admin_write_delivery on public.delivery_settings for all using (public.is_admin()) with check (public.is_admin());
