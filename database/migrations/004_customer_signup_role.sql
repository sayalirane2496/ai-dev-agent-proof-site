-- Customer signup must always create a customer profile.
-- Ignore any role passed in user metadata so signup cannot self-assign admin/restaurant.

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
    coalesce(
      nullif(btrim(new.raw_user_meta_data->>'display_name'), ''),
      split_part(coalesce(new.email, 'guest'), '@', 1)
    ),
    new.phone,
    'customer'
  )
  on conflict (id) do nothing;

  insert into public.reward_accounts (user_id, points)
  values (new.id, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;
