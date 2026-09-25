-- Development demo users only. Not production credentials.

do $$
declare
  admin_id uuid := '11111111-1111-4111-8111-111111111111';
  customer_id uuid := '22222222-2222-4222-8222-222222222222';
  kitchen_id uuid := '33333333-3333-4333-8333-333333333333';
begin
  if not exists (select 1 from auth.users where email = 'admin@demo.local') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, email_change_confirm_status, is_sso_user, is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      'admin@demo.local', extensions.crypt('DemoAdmin123!', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Demo Admin","role":"admin"}'::jsonb,
      now(), now(), '', '', '', '', '', 0, false, false
    );
    insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), admin_id, admin_id::text, 'email',
      jsonb_build_object('sub', admin_id::text, 'email', 'admin@demo.local', 'email_verified', true), now(), now(), now());
  end if;

  if not exists (select 1 from auth.users where email = 'customer@demo.local') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, email_change_confirm_status, is_sso_user, is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000', customer_id, 'authenticated', 'authenticated',
      'customer@demo.local', extensions.crypt('DemoCustomer123!', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Vikram","role":"customer"}'::jsonb,
      now(), now(), '', '', '', '', '', 0, false, false
    );
    insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), customer_id, customer_id::text, 'email',
      jsonb_build_object('sub', customer_id::text, 'email', 'customer@demo.local', 'email_verified', true), now(), now(), now());
  end if;

  if not exists (select 1 from auth.users where email = 'kitchen@demo.local') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, email_change_confirm_status, is_sso_user, is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000', kitchen_id, 'authenticated', 'authenticated',
      'kitchen@demo.local', extensions.crypt('DemoKitchen123!', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Andheri Kitchen","role":"restaurant"}'::jsonb,
      now(), now(), '', '', '', '', '', 0, false, false
    );
    insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), kitchen_id, kitchen_id::text, 'email',
      jsonb_build_object('sub', kitchen_id::text, 'email', 'kitchen@demo.local', 'email_verified', true), now(), now(), now());
  end if;

  update public.profiles set role = 'admin', display_name = 'Demo Admin' where id = admin_id;
  update public.profiles set role = 'customer', display_name = 'Vikram' where id = customer_id;
  update public.profiles set role = 'restaurant', display_name = 'Andheri Kitchen', restaurant_id = 'loc-andheri' where id = kitchen_id;
  update public.reward_accounts set points = 1250 where user_id = customer_id;

  insert into public.addresses (user_id, label, flat_building, landmark, locality, city, is_default)
  select customer_id, 'Home', 'Flat 402, Sea Green Heights', 'Near Crystal Point Mall', 'Andheri West', 'Mumbai', true
  where not exists (select 1 from public.addresses a where a.user_id = customer_id and a.label = 'Home');

  insert into public.addresses (user_id, label, flat_building, landmark, locality, city, is_default)
  select customer_id, 'Office', 'Level 5, Platina Tower', 'Bandra Kurla Complex (BKC)', 'Bandra East', 'Mumbai', false
  where not exists (select 1 from public.addresses a where a.user_id = customer_id and a.label = 'Office');
end $$;
