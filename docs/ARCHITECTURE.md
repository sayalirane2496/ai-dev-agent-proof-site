# Proposed production architecture (Burger King rebuild)

**Status: proposal only. Not implemented.**  
No database tables, migrations, APIs, or product features were created in this task.

Stack required by the user:

- Next.js
- React
- TypeScript
- Supabase PostgreSQL
- Server-side APIs / server actions
- Playwright
- Vercel

Do **not** use WooCommerce.

The extracted Vite app under `design-reference/burgerking/source/` is the **UI/UX and functionality reference**. It is not production code and must not be copied in as the Next.js app.

---

## 1. Application shape

A Next.js App Router application on Vercel.

- **Server Components** for catalog, restaurant list, and marketing sections where data can be fetched on the server.
- **Client Components** for cart, customizer, drawers, checkout steps, maps UI, and other interactive overlays that match the reference.
- **Route handlers and/or server actions** for cart pricing, coupon validation, checkout, orders, rewards, and addresses. Browser never holds service-role keys.

Suggested mapping of reference overlays to production routes (subject to approval):

| Reference screen | Proposed production surface |
|---|---|
| Home + hero + offers + combo + restaurants + promo | `app/page.tsx` |
| Menu | `app/menu/page.tsx` and/or home `#menu` equivalent |
| Search | overlay + optional `app/search` |
| Cart | overlay + optional `app/cart` |
| Checkout | `app/checkout/page.tsx` (or modal if matching reference exactly) |
| Order tracking | `app/orders/[orderId]/page.tsx` |
| Rewards / orders / addresses | `app/account/*` |
| Restaurant finder | home section + `app/restaurants` |

**Decision needed:** keep the reference’s single-page overlay model, or split into real URLs for share/reload/SEO.

---

## 2. Proposed production folder structure

```text
app/                  # Next.js App Router pages, layouts, route handlers
components/           # Shared presentational UI (header, footer, buttons, badges)
features/             # Feature modules (cart, menu, checkout, rewards, location)
lib/                  # Server clients, pricing helpers, validation, types
database/             # SQL migrations only (none in this task)
tests/                # Playwright (+ future unit tests)
docs/                 # Specs and architecture
public/               # Static assets copied/exported from approved reference images
design-reference/     # Reference only; not imported by production app
  burgerking/original/
  burgerking/source/
```

Keep `AGENTS.md` and `.cursor/` at repo root.

`features/` grouping (proposed):

```text
features/menu/
features/cart/
features/checkout/
features/offers/
features/location/
features/restaurants/
features/orders/
features/rewards/
features/search/
```

---

## 3. Proposed backend areas

All of these would be **server-side**. None exist yet.

| Area | Responsibility |
|---|---|
| Catalog | Products, categories, badges, customization option catalog |
| Pricing | Unit price, extras, combo price, GST, delivery fee, coupon |
| Cart | Persist cart (cookie/session or user) with line customizations |
| Coupons | Validate code, min order, discount cap; do not trust client math |
| Locations | Restaurants, hours, services, delivery vs pickup eligibility |
| Checkout | Address, contact, order mode, create order |
| Payments | Provider session/intent; never treat UI selection as paid |
| Orders | Create, list, reorder, status |
| Tracking | Status updates (later: realtime) |
| Rewards | Points balance, catalog, redeem |
| Addresses | Saved addresses CRUD |
| Search | Product search (and later restaurant search) |

---

## 4. Proposed database entities (Supabase Postgres)

**Not created.** Names only, for approval:

- `restaurants`
- `products`
- `product_categories`
- `product_customization_options` (cheese, patty, toppings, sauces, sizes, meal)
- `offers` / `coupons`
- `users` (or Supabase Auth `auth.users` + `profiles`)
- `addresses`
- `carts` / `cart_items`
- `orders` / `order_items`
- `order_status_events`
- `rewards_accounts` / `reward_redemptions`
- `payments` (provider id, status; no PAN/UPI secrets)

India-specific fields to confirm: GST rate (reference uses 5%), INR amounts in integer paise or rupees, veg/non-veg flag, spice level.

---

## 5. Proposed integrations (require explicit approval)

| Integration | Why it appeared | Production note |
|---|---|---|
| Supabase Postgres | User-required | Catalog, orders, users |
| Vercel | User-required | Hosting / preview |
| Playwright | User-required | QA |
| Payment provider (unset) | Checkout UI has UPI / card / COD | **Must choose** (e.g. Razorpay). Cost and account required before adding. |
| Maps | Outlet directions URL | Google Maps links vs Maps SDK |
| SMS / WhatsApp | Not in reference except fake rider phone | Ask before adding |
| Gemini / `@google/genai` | In reference `package.json` / `.env.example` / metadata, **unused in UI code** | Do **not** add unless requested |
| Auth | Rewards/account UI implies a signed-in user | Email/OTP vs magic link vs none for guest checkout |

---

## 6. Data and security rules for later implementation

- Recompute prices on the server at checkout.
- Service role only on the server.
- Guest checkout vs King Club account is an open product decision.
- Do not port Vite `express` or Gemini packages unless approved.

---

## 7. QA (when implementation is authorized)

- `npm run typecheck`, `lint`, `build`, `qa` (Playwright).
- Functional: menu, cart, customizer, combo, coupons, checkout UI, tracking.
- Responsive: 390 / 768 / 1024 / 1440.
- Visual QA against `design-reference/burgerking/source/`.
