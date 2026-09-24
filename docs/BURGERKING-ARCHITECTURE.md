# Burger King — Production Architecture (Proposal)

**Status:** proposal only. Not implemented.  
**Branch for this analysis:** `feature/burgerking-development`  
**Do not merge to `main` until you approve.**

Authorized stack (from you): Next.js, React, TypeScript, Supabase PostgreSQL, server APIs / server actions, Playwright, Vercel.

Forbidden unless you ask: WooCommerce, Gemini, paid services, extra packages, schema creation, API implementation.

Reference (`design-reference/burgerking/source/`) is UI/UX and behavior truth. It is a Vite SPA and must **not** be imported as the Next.js app.

---

## 1. Next.js structure

Current repo (foundation):

```text
app/layout.tsx
app/page.tsx          # "Application foundation"
app/globals.css
lib/supabase.ts       # env key names only
tests/playwright/smoke.spec.ts
database/             # empty placeholder
components/           # empty placeholder
features/             # empty placeholder
public/               # empty placeholder
design-reference/     # reference only; tsconfig excludes it
docs/
```

Proposed (when implementation is approved):

```text
app/
  layout.tsx                 # fonts, metadata matching index.html
  page.tsx                   # home shell
  api/                       # optional route handlers
  (optional routes if you approve Option B)
components/                  # logo, badge, toast, header, footer
features/
  home/
  menu/
  offers/
  combos/
  cart/
  checkout/
  location/
  restaurants/
  orders/
  rewards/
  search/
lib/
  supabase/server.ts         # service role, server only
  supabase/browser.ts        # publishable key, only if you approve client SDK
  pricing/                   # server quote helpers
  validation/
  types/
database/migrations/         # none until you approve schema
tests/playwright/
public/images/               # copies of approved reference assets
```

**Rendering**

- Server Components: catalog, offers, restaurant list, marketing sections when data is fetchable.
- Client Components: header scroll, cart, customizer, drawers, checkout steps, search, tracking, combo builder, location modal.
- No service-role key in the browser.

**Decision:** overlay-only `/` vs App Router URLs (see component map).

---

## 2. React component architecture

- **Presentational** pieces (logo, veg badge, chips) in `components/`.
- **Feature modules** own their modal/section + hooks.
- **Cart/session state** must not remain a single `App.tsx` God component in production. Proposed: React context **or** server-backed cart with a thin client cache. Choice needs approval.
- Do not copy Vite `App.tsx` state machine as-is; port behavior, not the file.
- Do not add `motion` (unused in reference).

---

## 3. Feature architecture

| Feature | Client | Server | Notes |
|---|---|---|---|
| Home / hero | tilt, CTAs | none | Static copy from reference |
| Menu | filters, qty, customizer | list products | Filters can be client on a page of ~23 items; still load from DB |
| Search | modal | optional search API | Client filter OK at this catalog size |
| Offers / coupons | apply UI | validate + quote | Never trust client discount |
| Combo builder | picker UI | combo quote | Deltas are business rules |
| Cart | drawer | persist + quote | Guest vs user |
| Location / restaurants | modal + finder | list outlets | GPS/places optional |
| Checkout | steps | create order | Payment abstraction |
| Tracking | modal | get status | Realtime optional |
| Rewards | tabs | ledger | Needs identity |
| Addresses | list | CRUD | Edit is inert in reference |

---

## 4. Server-side architecture

All money, stock, coupons, points, and order creation run on the server.

Proposed layers:

1. **Route handlers** (`app/api/...`) and/or **server actions** for mutations.
2. **Domain services** in `lib/` (pricing, coupons, checkout) — no UI imports.
3. **Supabase** for persistence (user-required). RLS for user-owned rows; service role only on the server for checkout if RLS cannot express the write.
4. **Webhooks** later for payment provider (not now).

Do not implement until you approve the API proposal.

---

## 5. Supabase architecture

**Connected project (read-only inspection):**

| Field | Value |
|---|---|
| Name | `ai-dev-agent-proof-site` |
| Ref | `rekkhdmqqztoddptgzry` |
| Status | `ACTIVE_HEALTHY` |
| Region | `ap-northeast-1` |
| Org | `sayali's Org` (free) |
| `public` tables | **none** |

Auth/storage/realtime platform tables exist (empty app data).

**Proposed usage (not created):**

- Postgres for catalog, carts, orders, addresses, rewards.
- `auth.users` if you approve authentication.
- Storage buckets later for images if you do not want `public/` git assets.
- Realtime later for tracking — not required to match the reference’s fake map.

`lib/supabase.ts` currently only lists `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. A publishable/anon key is also required for browser auth if you approve it. Do not add the JS client package until approved.

---

## 6. API / server-action areas

See `docs/BURGERKING-API-PROPOSAL.md`. Summary:

- Catalog read
- Restaurant read
- Cart quote / mutate
- Coupon apply
- Checkout
- Payments (abstract)
- Orders + tracking
- Rewards
- Addresses

---

## 7. Authentication area

Reference: **no login**. Account / King Rewards always shows “Vikram · Crown Gold”.

Proposed options (you must choose):

1. **Guest-only** — phone + name at checkout; rewards remain decorative or local.
2. **Guest checkout + optional account** — match overlay; add sign-in later.
3. **Required auth** — does **not** match the reference (would need your explicit OK).

Provider unset (Clerk/Supabase Auth/etc.). Do not add an auth package until approved.

---

## 8. Payments abstraction

Reference: UPI / card / COD **UI only**; every place-order succeeds.

Proposed interface (not implemented):

```text
createPayment({ orderId, amountInr, method: 'upi' | 'card' | 'cod' })
  → { status: 'pending' | 'requires_action' | 'succeeded' | 'cod_pending' }

handleProviderWebhook(payload)
  → mark payment + order
```

- COD: create order as unpaid / `cod_pending`.
- UPI/card: **cannot** be real without a PSP you approve (often paid). Until then, UI-only with a visible mock is a product decision — default recommendation: **do not** tell the user they paid if no provider exists.
- Never store PAN / UPI PIN / full card data.
- Not WooCommerce.

---

## 9. Order flow

```text
Browse → (location) → add/customize/combo → cart → coupon
  → checkout contact/address/mode → payment method
  → server: reprice + validate → persist order
  → payment (or COD) → clear cart → tracking
  → history / reorder
```

Reference short-circuits with `setTimeout(1200)` and a random id. Production must insert rows and return a durable `order_id`.

---

## 10. Data flow

```text
Browser UI  →  Server action / route  →  Pricing service
                                    →  Supabase (RLS)
                                    →  Payment adapter (optional)
             ←  quote / order DTO
```

Catalog can be Server Component fetch. Cart lines still need a client for interactivity.

**Images:** copy from reference assets into `public/` when implementing (do not edit files under `design-reference/`).

---

## 11. QA architecture

Required by AGENTS.md when implementation starts:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run qa` (Playwright)

Proposed proof coverage (not written yet):

- Home sections visible (hero, offers, menu, combo, restaurants).
- Add to cart, customizer, combo add.
- Coupon apply/remove.
- Location select (not real GPS).
- Checkout UI steps (mock or sandbox payment per your decision).
- Responsive 390 / 768 / 1024 / 1440.
- Visual comparison against the reference.

Current smoke test only asserts the foundation `h1`. It will need replacement when the home page is rebuilt — do not change it in this analysis-only task.

---

## 12. Explicit non-goals for this phase

- No schema
- No APIs
- No UI rebuild
- No dependency adds
- No Vercel/config changes
- No production deploy
- No merge to `main`
- No branch deletion
- No Gemini
- No WooCommerce
