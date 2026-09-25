-- Recreate coupon_discount with a non-ambiguous parameter name.
-- Applied after 001_init if that version used `code text`.

drop function if exists public.coupon_discount(text, integer);

create function public.coupon_discount(promo_code text, subtotal integer)
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

grant execute on function public.coupon_discount(text, integer) to anon, authenticated;
