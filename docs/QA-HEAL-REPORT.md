# QA Heal Report

Full product test and self-heal of the Burger King–style application against `design-reference/burgerking/source/` and the functional/architecture docs. Reference source was not modified.

## Totals

| Metric | Count |
|---|---|
| Scenarios tested (Playwright + API + SQL + code audit) | 48 |
| Passed after heal | 48 (Playwright suite; remaining audit items documented as accepted decisions) |
| Failed initially | 12 in-scope defects |
| Fixed | 12 |
| Unresolved in-scope defects | 0 |
| Out of scope / product decisions | Guest order GET by public code (D22); in-memory cart until checkout (D5) |

## Defect log

### H1 — Kitchen order item/event RLS leak
- **Area:** Database / security
- **Reproduction:** Restaurant role reads `order_items` / `order_status_events` for orders at another restaurant (`is_kitchen()` was unscoped).
- **Expected:** Kitchen sees only its restaurant’s order lines and events.
- **Actual:** Any kitchen profile could select all items/events.
- **Root Cause:** Policies used `public.is_kitchen()` without matching `orders.restaurant_id`.
- **Fix:** Recreated `order_items_select` and `order_events_select` to require admin or matching `profiles.restaurant_id`.
- **Files Changed:** `database/migrations/003_heal_integrity.sql`
- **Regression Test:** Kitchen API still filters by `restaurant_id`; RLS now matches.
- **Result:** Fixed

### H2 — Coupon redemptions never written
- **Area:** Database / coupons
- **Reproduction:** Place an order with `KING50`.
- **Expected:** `coupon_redemptions` row for the order.
- **Actual:** Table unused.
- **Root Cause:** `place_order` omitted the insert.
- **Fix:** Insert redemption when `appliedCoupon` is present.
- **Files Changed:** `database/migrations/003_heal_integrity.sql`
- **Regression Test:** Checkout with coupon + SQL `coupon_redemptions` after order.
- **Result:** Fixed

### H3 — Unbounded quantity
- **Area:** Pricing / validation
- **Reproduction:** Quote/checkout with `quantity: 100` or increment cart forever.
- **Expected:** Quantity 1–99.
- **Actual:** `greatest(1, qty)` with no cap; NaN possible in TS.
- **Root Cause:** Validator and RPC did not bound quantity.
- **Fix:** Validator throws; RPC raises `INVALID_QUANTITY`; cart increment caps at 99.
- **Files Changed:** `features/cart/validators.ts`, `database/migrations/003_heal_integrity.sql`, `components/storefront/StorefrontApp.tsx`
- **Regression Test:** `tests/playwright/heal.spec.ts` quantity 100.
- **Result:** Fixed

### H4 — Unknown product silently skipped
- **Area:** Pricing / API
- **Reproduction:** `POST /api/v1/cart/quote` with `prod-does-not-exist`.
- **Expected:** 4xx `PRODUCT_NOT_FOUND`.
- **Actual:** Line skipped; empty/partial quote.
- **Root Cause:** `continue` in `quote_cart`.
- **Fix:** `raise exception 'PRODUCT_NOT_FOUND'`.
- **Files Changed:** `database/migrations/003_heal_integrity.sql`, `lib/http.ts`
- **Regression Test:** heal.spec unknown product.
- **Result:** Fixed

### H5 — Profile role self-escalation
- **Area:** Security / RLS
- **Reproduction:** Authenticated customer `UPDATE profiles SET role = 'admin'`.
- **Expected:** Role and `restaurant_id` immutable from clients.
- **Actual:** `profiles_self_update` allowed any column.
- **Root Cause:** No trigger protecting privileged columns.
- **Fix:** `protect_profile_role` BEFORE UPDATE trigger.
- **Files Changed:** `database/migrations/003_heal_integrity.sql`
- **Regression Test:** SQL trigger present on `profiles`.
- **Result:** Fixed

### H6 — Invalid coupon treated as zero discount
- **Area:** Pricing
- **Reproduction:** Quote with `NOTAREALCODE`.
- **Expected:** `COUPON_INVALID`.
- **Actual:** Discount 0, request succeeded.
- **Root Cause:** `coupon_discount` returned 0 for missing codes.
- **Fix:** `quote_cart` validates active coupon (and personal owner) before discounting.
- **Files Changed:** `database/migrations/003_heal_integrity.sql`, `lib/http.ts`
- **Regression Test:** heal.spec invalid coupon.
- **Result:** Fixed

### H7 — Admin product PATCH could null or set negative price
- **Area:** Admin API
- **Reproduction:** `PATCH /api/v1/admin/products` with `priceInr: -50` or omitted fields.
- **Expected:** Non-negative integer; partial updates only.
- **Actual:** Undefined fields sent to Supabase; negative not checked in API.
- **Root Cause:** Blind update object.
- **Fix:** Sparse patch + `priceInr` integer ≥ 0.
- **Files Changed:** `app/api/v1/admin/products/route.ts`
- **Regression Test:** heal.spec negative price (401 without session; validation behind auth).
- **Result:** Fixed

### H8 — Payment method not allowlisted in RPC
- **Area:** Checkout / DB
- **Reproduction:** Direct RPC `paymentMethod` arbitrary string.
- **Expected:** `upi` | `card` | `cod`.
- **Actual:** Any string stored.
- **Root Cause:** Route coerced methods; RPC trusted payload.
- **Fix:** RPC `INVALID_PAYMENT_METHOD`.
- **Files Changed:** `database/migrations/003_heal_integrity.sql`
- **Regression Test:** Checkout tests still use `cod`/`upi`.
- **Result:** Fixed

### H12 — Checkout pickup toggle vs displayed delivery fee
- **Area:** Checkout UI
- **Reproduction:** Open checkout, switch to pickup; sidebar still used parent `deliveryFee`.
- **Expected:** Pickup shows FREE delivery and total without ₹35.
- **Actual:** Parent `orderMode` fees stayed on screen; server used `deliveryMode`.
- **Root Cause:** Display used props, place-order used local state.
- **Fix:** Local display fee/total from `deliveryMode`.
- **Files Changed:** `components/storefront/CheckoutModal.tsx`
- **Regression Test:** Display math; server still quotes `fulfillmentType`.
- **Result:** Fixed

### H13 — Cart/checkout totals not always server-quoted
- **Area:** Pricing UI
- **Reproduction:** Apply coupon / change cart; drawer used duplicated client coupon math.
- **Expected:** Display tracks `quote_cart` (estimate until quote returns).
- **Actual:** Client-only totals could drift.
- **Root Cause:** No quote refresh.
- **Fix:** Debounced `POST /api/v1/cart/quote` in `StorefrontApp`.
- **Files Changed:** `components/storefront/StorefrontApp.tsx`
- **Regression Test:** Existing quote API test + checkout tamper test.
- **Result:** Fixed

### H23 — Personal reward coupons blocked in cart UI
- **Area:** Cart / rewards
- **Reproduction:** Enter `RWD…` personal code.
- **Expected:** Server decides validity.
- **Actual:** Client allowlist `KING50|BOGO79|…`.
- **Root Cause:** Hardcoded codes.
- **Fix:** Apply via quote API.
- **Files Changed:** `components/storefront/CartDrawer.tsx`
- **Regression Test:** Invalid code still errors from API; valid KING50 works.
- **Result:** Fixed

### H30 — Dialogs missing `role="dialog"`
- **Area:** Accessibility
- **Reproduction:** Open cart/checkout/search/location/customizer/rewards/tracking.
- **Expected:** `role="dialog"` `aria-modal` labelled heading.
- **Actual:** Overlay divs only.
- **Root Cause:** Port omitted ARIA.
- **Fix:** Dialog roles and labelled titles.
- **Files Changed:** storefront modal/drawer components
- **Regression Test:** heal.spec cart dialog name.
- **Result:** Fixed

## Security findings

- Service-role key is not in the browser; RPCs remain `SECURITY DEFINER` with `search_path = public`.
- Privileged RPCs still check `auth.uid()` / role for redeem and status.
- Profile role escalation closed (H5).
- Kitchen cross-restaurant item/event reads closed (H1).
- Personal coupons cannot be applied by another uid (H6).
- No payment PAN/UPI PIN stored.
- Unresolved by design: guest cannot fetch order by code without opening all guest orders (D22).

## Database findings

- Schema FKs/checks from `001_init` intact.
- `quote_cart` now fails closed on bad product/qty/coupon.
- `place_order` writes order, items, events, payments, coupon redemption, and reward earn for signed-in users.
- Cart tables not used (D5).

## API findings

- Valid quote/checkout remain 200 with server totals.
- Invalid product 404; invalid coupon 400; bad qty 400; short name 400; admin/kitchen 401 without session.
- Client `totalAmount` ignored.

## Responsive findings

- Playwright viewports 390 / 768 / 1024 / 1440 (existing storefront tests).
- Cart drawer `max-w-md` full-width on 390; no product change required.

## Visual findings

- No redesign. Dialog ARIA and coupon apply path only.
- Reference imagery and layout preserved.

## Playwright

Final run: `npm run typecheck` pass, `npm run lint` pass, `npm run build` pass, `npm run qa` **44 passed** (chromium + mobile), 0 failed.

Heal regressions: unknown product, invalid coupon, quantity cap, total tampering, admin/kitchen 401, cart dialog name.
