-- Heal: role immutability, kitchen-scoped RLS, authoritative quote/order rules.

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role or new.restaurant_id is distinct from old.restaurant_id then
    raise exception 'PROFILE_ROLE_IMMUTABLE';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (
      o.user_id = auth.uid()
      or public.is_admin()
      or (
        public.is_kitchen()
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin', 'restaurant')
            and (p.role = 'admin' or p.restaurant_id = o.restaurant_id)
        )
      )
    )
  )
);

drop policy if exists order_events_select on public.order_status_events;
create policy order_events_select on public.order_status_events for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (
      o.user_id = auth.uid()
      or public.is_admin()
      or (
        public.is_kitchen()
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin', 'restaurant')
            and (p.role = 'admin' or p.restaurant_id = o.restaurant_id)
        )
      )
    )
  )
);

drop policy if exists coupon_redemptions_own on public.coupon_redemptions;
create policy coupon_redemptions_own on public.coupon_redemptions for select using (
  user_id = auth.uid() or public.is_admin()
);

create or replace function public.quote_cart(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  settings public.delivery_settings%rowtype;
  item jsonb;
  p public.products%rowtype;
  burger public.products%rowtype;
  fries public.combo_sides%rowtype;
  drink public.combo_sides%rowtype;
  coupon_row public.coupons%rowtype;
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
  if fulfillment not in ('delivery', 'pickup') then
    raise exception 'INVALID_FULFILLMENT';
  end if;

  coupon := nullif(upper(btrim(coalesce(payload->>'couponCode', ''))), '');

  if coupon is not null then
    select * into coupon_row from public.coupons where upper(coupons.code) = coupon and is_active = true;
    if not found then
      raise exception 'COUPON_INVALID';
    end if;
    if coupon_row.is_personal and (auth.uid() is null or coupon_row.owner_id is distinct from auth.uid()) then
      raise exception 'COUPON_INVALID';
    end if;
  end if;

  for item in select jsonb_array_elements(coalesce(payload->'items', '[]'::jsonb))
  loop
    pid := item->>'productId';
    if pid is null or btrim(pid) = '' then
      raise exception 'PRODUCT_NOT_FOUND';
    end if;

    begin
      qty := coalesce((item->>'quantity')::int, 1);
    exception when others then
      raise exception 'INVALID_QUANTITY';
    end;
    if qty < 1 or qty > 99 then
      raise exception 'INVALID_QUANTITY';
    end if;

    cust := coalesce(item->'customizations', '{}'::jsonb);

    if pid like 'combo-%' then
      select * into burger from public.products where id = replace(pid, 'combo-', '') and is_active;
      if not found then
        raise exception 'PRODUCT_NOT_FOUND';
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
        raise exception 'PRODUCT_NOT_FOUND';
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

  payment_method := lower(coalesce(payload->>'paymentMethod', 'cod'));
  if payment_method not in ('upi', 'card', 'cod') then
    raise exception 'INVALID_PAYMENT_METHOD';
  end if;
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
    oid, code, uid, restaurant_id, coalesce(q->>'fulfillmentType', 'delivery'), 'Confirmed',
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

  if nullif(q->>'appliedCoupon', '') is not null then
    insert into public.coupon_redemptions (coupon_code, user_id, order_id)
    values (q->>'appliedCoupon', uid, oid);
  end if;

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

grant execute on function public.quote_cart(jsonb) to anon, authenticated;
grant execute on function public.place_order(jsonb) to anon, authenticated;
