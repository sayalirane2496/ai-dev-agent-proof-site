# Admin flow

Same Next.js app. Route: `/admin`. Role `profiles.role = admin`.

Capabilities:

- Dashboard counts (orders, customers, recent orders)
- Products (list + toggle active / price fields via `PATCH /api/v1/admin/products`)
- Coupons
- Restaurants (open flag, timing, ETA)
- Orders list
- Customers (profiles)

No default production credentials. Demo admin is seed-only.

Authorization: Supabase session + RLS write policies + API role checks.
