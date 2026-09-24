# Burger King India — Functional Spec

**Status:** analysis only. Not an implementation.

**Source of truth:** `design-reference/burgerking/source/`  
**Original ZIP (untouched):** `design-reference/burgerking/original/`  
**Do not modify the reference.**

This document records **every behavior present in the reference** and the **proposed production mapping**. Production behavior must match the reference UI/UX and user-visible flows unless you explicitly approve a change.

The current Next.js app on `main` is a foundation only (`app/page.tsx` heading “Application foundation”). No Burger King product UI exists yet.

**Reference stack:** Vite + React 19 SPA. One page. Overlays for cart, search, location, customizer, checkout, tracking, rewards. All catalog, cart, pricing, coupons, orders, and rewards run in React state. No network calls in `.ts`/`.tsx`.

**Legend for each feature**

| Field | Meaning |
|---|---|
| Reference | File(s) that implement it |
| Current behavior | What the reference actually does |
| Required production behavior | Match the reference unless you approve otherwise |
| Frontend | Next.js / React surface |
| Backend | Server actions / route handlers (proposed, not built) |
| Database | Proposed entities (not created) |
| External | Integrations (none added) |
| Mock? | Yes if the reference simulates it locally |
| Dependencies / assumptions | Gaps and decisions |

---

## Inventory of reference UI modules

**19 components** in `src/components/` plus **`App.tsx`** (state owner), **`src/types/index.ts`**, **`src/data/mockData.ts`**, **`src/index.css`**, **`index.html`**.

| # | File |
|---|---|
| 1 | `App.tsx` |
| 2 | `Header.tsx` |
| 3 | `MobileBottomNav.tsx` |
| 4 | `HeroSection.tsx` |
| 5 | `FeaturedOffers.tsx` |
| 6 | `MenuSection.tsx` |
| 7 | `ProductCard.tsx` |
| 8 | `FoodTypeBadge.tsx` |
| 9 | `SmartComboBuilder.tsx` |
| 10 | `RestaurantFinder.tsx` |
| 11 | `AppPromotion.tsx` |
| 12 | `Footer.tsx` |
| 13 | `LocationModal.tsx` |
| 14 | `ProductCustomizerModal.tsx` |
| 15 | `CartDrawer.tsx` |
| 16 | `CheckoutModal.tsx` |
| 17 | `OrderTrackingModal.tsx` |
| 18 | `RewardsDashboard.tsx` |
| 19 | `SearchModal.tsx` |
| 20 | `BurgerKingLogo.tsx` |

`theme-library/` is **not** present in this repository. Production components would be **New** (or Adapt from the reference), subject to your approval before reusable shared components are added.

---

## 1. Pages / screens

| Field | Detail |
|---|---|
| Reference | `index.html`, `src/main.tsx`, `src/App.tsx`, section components |
| Current behavior | Single HTML document. Logical screens are in-page sections plus overlays. No React Router. No URL per screen. |
| Required production behavior | Same visual screens. **Decision needed:** keep overlay SPA vs real App Router URLs. |
| Frontend | Home shell + overlays (and optional routes if you approve) |
| Backend | Catalog/offers/restaurants fetch for the home shell |
| Database | products, categories, offers, restaurants |
| External | None for page shell |
| Mock? | Yes — all data is local |
| Dependencies / assumptions | Overlay vs routes affects shareable order/tracking links |

**Logical screens**

| Screen | How it appears | DOM / component |
|---|---|---|
| Home / hero | Default | `HeroSection` |
| Offers | Section `#offers` | `FeaturedOffers` |
| Menu | Section `#menu` | `MenuSection` |
| Combo builder | Section `#combo-builder` | `SmartComboBuilder` |
| Restaurant finder | Section `#restaurants` | `RestaurantFinder` |
| App download promo | Section (no id) | `AppPromotion` |
| Footer | Page bottom | `Footer` |
| Location | Modal | `LocationModal` |
| Search | Modal | `SearchModal` |
| Product customizer | Modal / mobile bottom sheet | `ProductCustomizerModal` |
| Cart | Right drawer | `CartDrawer` |
| Checkout | Modal, steps 1–2 | `CheckoutModal` |
| Order tracking | Modal | `OrderTrackingModal` |
| King Club (rewards / orders / addresses) | Modal with tabs | `RewardsDashboard` |
| Toast | Fixed top-right | inline in `App.tsx` |
| Mobile cart bar | Fixed above bottom nav | `MobileBottomNav` |
| Mobile bottom nav | Fixed | `MobileBottomNav` |

There is **no** login, signup, password reset, nutrition page, allergen page, privacy page, or terms page as real screens. Footer lists those as **static text**.

---

## 2. Navigation

| Field | Detail |
|---|---|
| Reference | `Header.tsx`, `App.tsx` `handleNavigate`, `Footer.tsx`, `BurgerKingLogo.tsx` |
| Current behavior | Sticky header. Desktop (`lg+`) links: Home, Menu, Offers & Deals, Meal Builder, Restaurants, King Rewards. Logo → `home` (scroll top). Offers → `#offers`. Meal Builder → `#combo-builder`. Menu → `#menu`. Restaurants → `#restaurants`. King Rewards / Account open rewards modal (no scroll). Search and cart open overlays. `activeSection` is set on click only; it is **not** updated by IntersectionObserver while scrolling. |
| Required production behavior | Same labels, order, and targets. |
| Frontend | Sticky header client component |
| Backend | None for nav itself |
| Database | None |
| External | None |
| Mock? | Scroll is real; rewards/account identity is mock |
| Dependencies / assumptions | Header `onNavigate('offers')` matches `FeaturedOffers` `id="offers"`. |

Header also has a **location pill** (locality + ETA) and **cart** showing count + subtotal (not grand total).

---

## 3. Mobile navigation

| Field | Detail |
|---|---|
| Reference | `MobileBottomNav.tsx`, `Header.tsx` (collapsed desktop nav) |
| Current behavior | Shown `md:hidden`. Tabs: Home, Menu, Offers, Cart, Rewards. Cart opens drawer (does not scroll). Rewards opens King Club modal. When `cartCount > 0`, a floating **VIEW ORDER** bar sits above the tab bar (`bottom-18`) showing item count and **grand total** (`totalAmount`, not subtotal). Header hides desktop nav below `lg`; Account button `hidden sm:flex`; location pill truncates. Footer uses `pb-24 md:pb-12` so content clears the tab bar. |
| Required production behavior | Same five tabs, floating cart bar, safe-area spacing. |
| Frontend | Client bottom nav + cart bar |
| Backend | Cart totals from server quote if cart is persisted |
| Database | cart |
| External | None |
| Mock? | Totals computed client-side today |
| Dependencies / assumptions | Header cart shows **subtotal**; mobile bar shows **total** (includes GST, delivery, discount). Confirm you want that inconsistency preserved. |

---

## 4. Product catalog

| Field | Detail |
|---|---|
| Reference | `mockData.ts` `PRODUCTS` (23 items), `MenuSection.tsx`, `ProductCard.tsx` |
| Current behavior | 23 products. Fields: `id`, `name`, `category`, `price`, optional `originalPrice`, `description`, `isVeg`, optional `badge`, optional `calories`, optional `spiceLevel` 0–3, `image`, `customizationOptions`. Images: 5 JPGs reused. Grid 1 / 2 / 3 columns (`sm` / `xl`). “Showing N items”. Click image or title opens customizer. ADD vs quantity stepper. |
| Required production behavior | Same cards, copy, prices, badges, veg marks, calories, spice display. |
| Frontend | Catalog grid |
| Backend | `GET` products (optionally by restaurant) |
| Database | `products`, categories, images, customization options |
| External | None |
| Mock? | Yes — static array |
| Dependencies / assumptions | Category chip counts (e.g. All Items 24) do **not** match 23 products. `value-meals` exists on Paneer Value Box but there is **no** `value-meals` chip (only `combos`). Confirm whether to keep static counts or derive them. |

**SKUs (ids)**

`prod-whopper-veg`, `prod-whopper-chicken`, `prod-whopper-mutton`, `prod-crispy-veg`, `prod-crispy-chicken`, `prod-paneer-royale`, `prod-fiery-chicken`, `prod-peri-peri-fries`, `prod-salted-fries`, `prod-chicken-wings`, `prod-veg-wrap`, `prod-chicken-wrap`, `prod-cold-coffee`, `prod-chocolate-shake`, `prod-chocolate-mousse`, `prod-softie-sundae`, `prod-combo-veg-feast`, `prod-combo-chicken-feast`, `prod-coke`, `prod-thums-up`, `prod-hot-cappuccino`, `prod-paneer-combo`, `prod-family-feast`.

Badges used: Bestseller, Flame-Grilled, Must Try, New, Value, Chef Pick.

---

## 5. Categories

| Field | Detail |
|---|---|
| Reference | `CATEGORIES` in `mockData.ts`, `MenuSection.tsx`, type `ProductCategory` |
| Current behavior | 12 chips: All Items, Best Sellers, Whopper®, Burgers & Wraps, King Gourmet, Chicken & Wings, Pure Veg, Sides & Fries, Beverages, Desserts, BK Café, Value Combos. Desktop: sticky vertical list with **static** `count`. Mobile: horizontal chips without counts. Filter is **exact** `product.category === chip.id`. Chip `bestsellers` therefore never matches a product (products use `badge`, not `category: 'bestsellers'`). Pure Veg chip also does not match `category: 'veg'` wait — there is category `'veg'` for Crispy Veg. Chip id `veg` = Pure Veg. Chip `bestsellers` is the broken one. Dietary “Veg Only” is a **separate** filter from the Pure Veg category. |
| Required production behavior | Same chips and layout. **Decision:** keep the bestsellers chip as a no-op vs wire it to badge. |
| Frontend | Sticky sidebar + mobile scroller |
| Backend | Category list + product.category |
| Database | `product_categories` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Type includes `'all' \| 'bestsellers' \| ... \| 'value-meals'`. Chip list omits `value-meals`. |

---

## 6. Search

| Field | Detail |
|---|---|
| Reference | `SearchModal.tsx`, menu search in `MenuSection.tsx` / `App.tsx` `menuSearchQuery` |
| Current behavior | **Global:** header search opens modal. Empty query shows first 6 products labeled “Popular Flame-Grilled Choices” (not actually filtered by Bestseller). Query matches `name`, `description`, `category` (case-insensitive). Popular chips set query: Veg Whopper, Chicken Whopper, Peri Peri Fries, Cold Coffee, Paneer Royale. Row: Customise (opens customizer, closes search) or + ADD (adds default, closes search). Empty: “No items found”. **Menu search:** same fields including category; Clear button; independent of global search. |
| Required production behavior | Same two search surfaces and copy. |
| Frontend | Overlay + in-menu input |
| Backend | Optional `GET /search?q=` |
| Database | products (later FTS) |
| External | None |
| Mock? | Yes — client filter |
| Dependencies / assumptions | Global and menu searches do not share query state. |

---

## 7. Filters

| Field | Detail |
|---|---|
| Reference | `MenuSection.tsx`, `FeaturedOffers.tsx`, `RestaurantFinder.tsx`, `LocationModal.tsx` |
| Current behavior | **Menu:** category, dietary all/veg/non-veg (veg/non-veg toggle off returns to all), Bestsellers toggle (`badge` is Bestseller **or** Flame-Grilled), search text. Reset Filters clears all. **Offers:** All Offers, Under ₹99, Meal Upgrades, Family Feasts, App Exclusive. Type also has `'burgers'` but **no burgers tab**. **Restaurants:** city All / Mumbai / Bengaluru / Delhi NCR / Gurugram / Pune. `selectedService` exists in state (`All`, Delivery, Takeaway, Dine-In, Drive-Thru) but **there is no service-filter UI**; it stays `All`. **Location modal:** text filter on locality, city, name. |
| Required production behavior | Match visible filters. Do not add service chips unless you ask. |
| Frontend | Filter chips |
| Backend | Query params on catalog/restaurants |
| Database | flags on products/restaurants |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Offer tab `under99` matches `offer.category === 'under99'`, not computed from `minOrder`. |

---

## 8. Product details

| Field | Detail |
|---|---|
| Reference | `ProductCard.tsx`, `ProductCustomizerModal.tsx` |
| Current behavior | No dedicated product page. Details live on the card (name, description 2-line clamp, price, strikethrough original, veg badge, marketing badge, calories on hover overlay, spice peppers if `spiceLevel > 1`) and in the customizer (full description, calories, base price). Hero shows a hardcoded Double Whopper visual with ₹219 / ₹249 and CUSTOMIZE (scrolls to **menu**, does not open a product). |
| Required production behavior | Same: overlay customizer, no separate PDP unless you approve a URL. |
| Frontend | Card + modal |
| Backend | Product by id |
| Database | `products` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Hero CUSTOMIZE is a menu CTA, not a product customizer. |

---

## 9. Product customization

| Field | Detail |
|---|---|
| Reference | `ProductCustomizerModal.tsx`, `App.tsx` `handleCustomizerConfirm`, `SelectedCustomizations` |
| Current behavior | Opens from card image/title/Customise, and from search. Mobile: bottom sheet (`items-end`); desktop: centered modal. Reset on product change. Options driven by `customizationOptions`: extra cheese ₹25, extra patty ₹90, size grid, sauces (single-select toggle off), removable toppings (free), make-it-a-meal. Quantity min 1. Footer shows live **unitPrice × qty**. Confirm always **appends a new cart line** (never merges). |
| Required production behavior | Same UI. Server must recompute extras. |
| Frontend | Customizer modal |
| Backend | Price quote for customization payload |
| Database | option catalog + prices |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | **Pricing gap:** customizer UI includes sauce and size in `unitPrice`, but `handleCustomizerConfirm` only adds cheese 25 + patty 90 + meal 99. Sauce/size deltas are **dropped** on add. Meal fries “Cheesy Liquid Fries (+₹20)” and drink “BK Cold Coffee (+₹30)” are **labels only** — not added to price. Confirm whether production should match the **UI math** or the **App.tsx cart math**. |

---

## 10. Add-ons / options

| Field | Detail |
|---|---|
| Reference | `Product.customizationOptions` in `mockData.ts`, customizer, cart line pills |
| Current behavior | Cheese, extra patty, sauces with prices, size `priceDelta`, removable toppings, meal fries/drink selects. Cart shows meal fries+drink, extra cheese, extra patty, selectedSauce, selectedSize, “No {toppings}”. |
| Required production behavior | Same options per SKU. |
| Frontend | Option groups |
| Backend | Validate allowed options per product |
| Database | `product_option_groups`, `product_options` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | See pricing gap in §9. |

---

## 11. Combo builder

| Field | Detail |
|---|---|
| Reference | `SmartComboBuilder.tsx`, `App.tsx` `handleAddComboToCart`, catalog combo products |
| Current behavior | **Interactive builder** (`#combo-builder`): 3 steps. Burgers: Veg Whopper ₹189, Chicken Whopper ₹219 (default), Crispy Veg ₹79, Paneer Royale ₹199. Fries deltas: Peri Peri +40, Salted +30, Cheesy Melt +55. Drinks deltas: Thums Up +30 (default), Coke Zero +30, Cold Coffee +65, Hazelnut shake +75. `comboPrice = burger.price + fries.delta + drink.delta`. `separatePrice = burger.price + 119 + 60`. `savings = max(25, separatePrice - comboPrice)`. Adds cart line `"{burger} Royal Meal"`, `isMeal: true`, `productId: combo-{burger.id}`, opens cart. **Catalog combos** (separate products): Veg/Chicken Whopper meals, Paneer value box, Family 4-burger feast — added like normal products. |
| Required production behavior | Same builder UI and catalog combo SKUs. |
| Frontend | Builder section |
| Backend | Combo price quote |
| Database | combo recipes or price rules |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Builder fries/drink are **not** the catalog SKU prices (₹119 fries / ₹60 drink). Confirm the delta model. |

---

## 12. Offers

| Field | Detail |
|---|---|
| Reference | `FeaturedOffers.tsx`, `OFFERS` in `mockData.ts` |
| Current behavior | 5 cards: BOGO79, KING50, MEALUP, FEAST150, SWEETKING. Image, badge, code, min order, “Valid Today”, APPLY DEAL / APPLIED. Apply sets `appliedCouponCode` and toast. Does **not** add free items (dessert/fries) to cart. Unused prop `onSelectDealProduct`. |
| Required production behavior | Same cards. Production should not claim a free item unless the engine actually adds it. |
| Frontend | Offers section |
| Backend | List offers; apply coupon |
| Database | `offers` / `coupons` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Offer copy (free dessert, free meal upgrade, 2-for-79) does not match the **flat/percent cart discount** in `App.tsx`. |

---

## 13. Coupons

| Field | Detail |
|---|---|
| Reference | `App.tsx` `discountAmount`, `CartDrawer.tsx` apply form, default `KING50` |
| Current behavior | Default applied: `KING50`. Cart accepts KING50, BOGO79, MEALUP, FEAST150, SWEETKING (uppercase). Invalid: “Invalid promo code. Try KING50, BOGO79 or FEAST150” (omits MEALUP/SWEETKING). Empty submit is a no-op. Remove coupon toast. **KING50:** 50% off, cap ₹100, only if subtotal ≥ 199 else **₹0 while still “applied”**. **BOGO79:** always ₹59 if applied. **MEALUP:** always ₹99. **FEAST150:** ₹150 if subtotal ≥ 499 else 0. **SWEETKING:** ₹99 if subtotal ≥ 299 else 0. `OfferDeal.discountType` / `discountValue` are **not** used by the calculator. App promo copy `BKAPP` ₹100 off is **not** in the calculator. |
| Required production behavior | Same codes and UI. Server must validate; never trust client discount. |
| Frontend | Offer apply + cart input |
| Backend | Coupon validate + quote |
| Database | coupons, redemptions |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Confirm first-order-only for KING50, BOGO item rules, and whether BKAPP exists. |

---

## 14. Cart

| Field | Detail |
|---|---|
| Reference | `App.tsx`, `CartDrawer.tsx`, `ProductCard` qty, `MobileBottomNav` |
| Current behavior | Seeded with Chicken Whopper + Peri Peri Fries. Default add **merges** quantity only if same `productId` and **no** extra cheese/patty/meal/sauce (size/toppings ignored for merge). Customizer always new line. Increment/decrement/remove by `cartItemId`. Product-card decrement finds **first** line with that `productId` (can hit the wrong customized line). Empty state + Browse Menu (closes drawer). Upsells: peri fries, cold coffee, mousse, wings. Free-delivery meter vs ₹299 **subtotal** even in pickup (fee is 0 but meter still shows). Checkout closes drawer then opens checkout. Cart does not persist on refresh. |
| Required production behavior | Same drawer UX. Persist cart (guest cookie/session or user) if you approve. |
| Frontend | Drawer + merchandising |
| Backend | Cart CRUD + quote |
| Database | `carts`, `cart_items` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Confirm seed cart vs empty cart on first visit. |

---

## 15. Pricing

| Field | Detail |
|---|---|
| Reference | `App.tsx` memos, customizer, combo builder |
| Current behavior | Line `unitPrice * quantity` → subtotal. Totals in INR whole rupees. Header cart: subtotal. Mobile bar / checkout: grand total. |
| Required production behavior | Same displayed numbers **after** server recomputation. |
| Frontend | Display only |
| Backend | Authoritative pricing service |
| Database | prices on products/options/coupons |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Integer rupees vs paise. Customizer vs App.tsx mismatch (§9). |

---

## 16. Discounts

| Field | Detail |
|---|---|
| Reference | `originalPrice` strikethrough, coupon discount line, combo SAVE badge, meal “SAVE ₹40” |
| Current behavior | Catalog strikethrough is cosmetic (cart uses `price`). Coupon is a single cart-level amount. Combo savings vs synthetic separate price. Meal save ₹40 is static copy. Rewards ₹200 feast voucher decrements points only — **does not** apply a cart coupon. |
| Required production behavior | Display the same lines; compute on server. |
| Frontend | Strikethrough + bill lines |
| Backend | Discount engine |
| Database | list vs promo vs coupon |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Multiple simultaneous discounts are not supported (one coupon). |

---

## 17. Taxes / fees shown in the reference

| Field | Detail |
|---|---|
| Reference | `App.tsx` `taxes`, `deliveryFee`; labels in `CartDrawer.tsx`, `CheckoutModal.tsx` |
| Current behavior | **GST:** `Math.round(subtotal * 0.05)` labeled “Restaurant GST & Taxes (5%)” / “GST & Taxes (5%)”. Applied on **subtotal only** (not delivery). **Delivery Partner Fee:** ₹0 if pickup **or** empty cart; else ₹35 if subtotal &lt; 299, else ₹0. Header micro-banner: “Free Delivery &gt; ₹299”. Copy: “zero convenience fees”. No packaging fee, surge, tip, or GST on delivery. |
| Required production behavior | Same line items and 5% unless you change tax policy. |
| Frontend | Bill breakdown |
| Backend | Tax + fee rules |
| Database | fee rules / restaurant tax profile |
| External | None unless a tax API is later approved |
| Mock? | Yes |
| Dependencies / assumptions | Confirm 5% GST, ₹35 fee, ₹299 threshold, tax base (subtotal vs subtotal+fee). |

---

## 18. Delivery

| Field | Detail |
|---|---|
| Reference | `App.tsx` `orderMode`, `LocationModal.tsx`, `CheckoutModal.tsx`, header banner, tracking |
| Current behavior | Default `orderMode = 'delivery'`. Location modal: “Delivery (30 Mins)”. Checkout step 1: “Deliver to Me (30 min)” — **local `deliveryMode`, not wired to `orderMode`**, so toggling checkout pickup **does not** zero the fee shown (fee still from App `orderMode`). Delivery fields: flat, landmark, notes (Leave at door / Avoid ringing bell / Leave with guard). Default note string is `'Leave at door, contactless'` which **matches none** of the three chips until clicked. Contact copy: “Live SMS Updates” but no SMS is sent. Tracking assumes a rider. |
| Required production behavior | Same UI. Wire fee to a single mode if you approve fixing the split state. |
| Frontend | Mode toggle + address |
| Backend | Delivery quote, zone check |
| Database | restaurants, addresses, orders.fulfillment |
| External | Maps / SMS only if you approve |
| Mock? | Yes |
| Dependencies / assumptions | No geo-fence. ETA is restaurant `etaMin` string. |

---

## 19. Pickup

| Field | Detail |
|---|---|
| Reference | `LocationModal` Takeaway / Dine-In, `CheckoutModal` Pick up at Outlet, `orderMode === 'pickup'` fee = 0 |
| Current behavior | Pickup is a toggle. It does **not** hide address fields. It does **not** change tracking copy (still “Out for Delivery” / rider). Restaurant services include Takeaway / Dine-In / Drive-Thru as badges only. |
| Required production behavior | Same toggles unless you approve pickup-specific tracking/address UX. |
| Frontend | Mode switch |
| Backend | Pickup slot / store availability (not in reference) |
| Database | `fulfillment_type` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Dine-in and drive-thru are labels, not flows. |

---

## 20. Location selection

| Field | Detail |
|---|---|
| Reference | `LocationModal.tsx`, default `POPULAR_LOCATIONS[0]` Andheri West, Header/Hero pills |
| Current behavior | Opens from header pill, hero Change. Search restaurants. Select sets location, toast “Delivery location set to {locality}, {city}”, closes. START ORDER just closes. **Use Current Location (GPS):** 600ms spinner, **always** Andheri West, no Geolocation API. Selecting a restaurant does **not** change the menu or prices. |
| Required production behavior | Same modal. Real GPS/places only if you approve. |
| Frontend | Location modal |
| Backend | List outlets; optional geo sort |
| Database | `restaurants` |
| External | Browser Geolocation / Places API **only if approved** |
| Mock? | Yes |
| Dependencies / assumptions | Menu is global, not per-store. |

---

## 21. Restaurant finder

| Field | Detail |
|---|---|
| Reference | `RestaurantFinder.tsx`, `POPULAR_LOCATIONS` (7 outlets) |
| Current behavior | Cards: city, rating, reviewsCount, name, address, timing, distanceKm, etaMin, service badges. ORDER HERE sets selected location + toast “Now ordering from {name}”. Selected: “DELIVERING FROM HERE”. Directions: `https://maps.google.com/?q={address}` new tab. Cities: Mumbai (2), Bengaluru (2), Delhi NCR (1), Gurugram (1), Pune (1). All `isOpen: true`. Phone icon imported unused. |
| Required production behavior | Same cards and Maps link behavior. |
| Frontend | Finder section |
| Backend | Restaurant list |
| Database | `restaurants` |
| External | Google Maps **URL** already; Maps SDK not used |
| Mock? | Yes |
| Dependencies / assumptions | Confirm Maps links vs embedded map. |

---

## 22. Checkout

| Field | Detail |
|---|---|
| Reference | `CheckoutModal.tsx`, `App.tsx` `handleOrderSuccess` |
| Current behavior | Modal. Step 1: mode, address, contact, notes → CONTINUE TO PAYMENT (no validation). Step 2: payment UI → PAY & PLACE ORDER. Defaults: Vikram Malhotra, 9820143210, Flat 402 Sea Green Heights, Near Crystal Point Mall. 1200ms spinner “Securing Flame-Grilled Order...”. Order id `BK-IN-{5 digits}`. Snapshot cart into `pastOrders` status Confirmed, rider “Ramesh K. (Valet)”, phone `+91 98201 43210`, clear cart, open tracking, toast. Stepper labels 1–2; `step` type includes 3 but UI never shows step 3 (processing is the button spinner). Backdrop click does not close. No required fields. Phone `maxLength={10}` only. |
| Required production behavior | Same steps and copy. Production must **not** mark paid without a real payment result (see §23). |
| Frontend | Checkout modal or `/checkout` |
| Backend | Create order + payment intent |
| Database | orders, order_items, payments, addresses |
| External | Payments PSP if approved |
| Mock? | Yes |
| Dependencies / assumptions | Guest vs account. Address not saved to Rewards list. |

---

## 23. Payment UI

| Field | Detail |
|---|---|
| Reference | `CheckoutModal.tsx` step 2 |
| Current behavior | Methods: `upi` (default) with GPay / PhonePe / Paytm chips (UI only), `card` (Visa, Mastercard, RuPay, Diners — **no card fields**), `cod` Cash / UPI on Delivery. Shield copy. No Razorpay/Stripe. No UPI VPA. Place order succeeds for every method after timeout. |
| Required production behavior | Same visual methods. Charging requires you to **choose and approve** a provider. Do not add paid services without approval. COD can remain unpaid-at-placement if you approve. |
| Frontend | Method selector |
| Backend | Payment abstraction |
| Database | `payments` |
| External | **Unset** — needs your approval (e.g. Razorpay). Not WooCommerce. |
| Mock? | Yes |
| Dependencies / assumptions | UPI app choice is not sent anywhere. |

---

## 24. Orders

| Field | Detail |
|---|---|
| Reference | `UserOrder` type, `handleOrderSuccess`, `RewardsDashboard` orders tab |
| Current behavior | In-memory `pastOrders`. Seed `BK-IND-90241` Delivered. New orders prepended. Status union: Confirmed, Grilling, Out for Delivery, Delivered. New orders stay Confirmed (tracking modal uses its **own** simulated step, not `order.status`). |
| Required production behavior | Persist orders; status from server. |
| Frontend | History + tracking |
| Backend | Create/list/get |
| Database | `orders`, `order_items`, `order_status_events` |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Id formats differ: seed `BK-IND-90241` vs new `BK-IN-#####`. |

---

## 25. Order history

| Field | Detail |
|---|---|
| Reference | `RewardsDashboard.tsx` tab `orders` |
| Current behavior | List: id, status badge, date string, total, line items with veg badge, Track, Reorder. Empty copy if none. No pagination, invoice, or cancel. |
| Required production behavior | Same list UI; data from DB. |
| Frontend | History tab |
| Backend | `GET` orders for user/session |
| Database | orders |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Requires identity (guest phone vs account). |

---

## 26. Reorder

| Field | Detail |
|---|---|
| Reference | `App.tsx` `handleReorder` |
| Current behavior | Replaces **entire** cart with past `items` (does not merge). Opens cart. Toast “Reordered N items…”. Closes rewards. |
| Required production behavior | Same UX; re-price against current catalog (items may be unavailable). |
| Frontend | Reorder button |
| Backend | Reprice + cart replace |
| Database | order_items → cart_items |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Confirm replace vs merge. |

---

## 27. Order tracking

| Field | Detail |
|---|---|
| Reference | `OrderTrackingModal.tsx` |
| Current behavior | Opens after checkout or Track. Banner ETA `{n}–{n+8} MINS` starting at 24, decrements 1 every 10s (floor 5). Fake SVG map; rider `left%` starts 45, +3 every 10s cap 85. Timeline 4 steps; **Simulate Progress** buttons 1–4 (demo). Default `simulatedStep = 2` (Flame-Grilling) even for Delivered seed order. Rider card; Call → `alert`; Chat → `alert`. Item list + “Paid ₹{total}”. LIVE badge always. |
| Required production behavior | Same visual tracker. Real map/telephony only if you approve. Simulate buttons are demo — confirm keep vs hide in production. |
| Frontend | Tracking modal or `/orders/[id]` |
| Backend | Status + optional realtime |
| Database | `order_status_events` |
| External | Maps SDK, SMS, chat, dialer — **not** in reference except `alert` and Maps URL elsewhere |
| Mock? | Yes |
| Dependencies / assumptions | No WebSocket in reference. |

---

## 28. Rewards

| Field | Detail |
|---|---|
| Reference | `RewardsDashboard.tsx`, header King Rewards / Account |
| Current behavior | Always “Hi, Vikram · Crown Gold Member”. Start **1250** points. Copy: earn 10 points per ₹100. Progress to 1400 (free Whopper). No login. Points do not increase after checkout. Catalog: fries 350, shake 600, Whopper 1400, ₹200 feast off 1800. |
| Required production behavior | Same UI. Real balances need auth + ledger. |
| Frontend | King Club modal |
| Backend | Balance + catalog |
| Database | `reward_accounts`, `reward_catalog`, ledger |
| External | Auth provider if you approve |
| Mock? | Yes |
| Dependencies / assumptions | Guest checkout vs King Club is undecided. |

---

## 29. Reward redemption

| Field | Detail |
|---|---|
| Reference | `handleRedeem` in `RewardsDashboard.tsx` |
| Current behavior | If points ≥ cost: decrement, green banner 4s “Redeemed voucher… Check your SMS!” — **no SMS, no cart coupon, no free SKU**. Else `alert` with points shortfall. Whopper (1400) and ₹200 off (1800) are unaffordable at 1250. |
| Required production behavior | Same buttons; production should attach a real voucher/cart effect if you want redemption to matter. |
| Frontend | Redeem CTAs |
| Backend | Atomic redeem |
| Database | `reward_redemptions` |
| External | SMS only if approved |
| Mock? | Yes |
| Dependencies / assumptions | Confirm whether redeem adds a coupon or a free line item. |

---

## 30. Addresses

| Field | Detail |
|---|---|
| Reference | Rewards tab Addresses; checkout fields |
| Current behavior | Two hardcoded rows: Home (default) Andheri, Office BKC. **Edit does nothing**. No add/delete. Checkout address is separate state and is not written to this list. |
| Required production behavior | Same list UI; Edit/Add need your approval for real CRUD. |
| Frontend | Address tab + checkout fields |
| Backend | Address CRUD |
| Database | `addresses` |
| External | Places autocomplete only if approved |
| Mock? | Yes |
| Dependencies / assumptions | Default address vs checkout defaults. |

---

## 31. Modals

| Field | Detail |
|---|---|
| Reference | Location, Search, Customizer, Checkout, Tracking, Rewards |
| Current behavior | `fixed` overlay `bg-black/60–70` + blur. Close via X (and some primary buttons). **Backdrop click does not close** (`stopPropagation` on panel; overlay has no `onClose`). No focus trap, no Escape handler. Customizer is bottom sheet on small screens. Search autoFocus. |
| Required production behavior | Same open/close. A11y extras need approval if they change UX. |
| Frontend | Dialogs |
| Backend | None |
| Database | None |
| External | None |
| Mock? | N/A |
| Dependencies / assumptions | Confirm backdrop-click and Escape. |

---

## 32. Drawers

| Field | Detail |
|---|---|
| Reference | `CartDrawer.tsx` |
| Current behavior | Right drawer `max-w-md` full height. Only one drawer. Same backdrop rules as modals. |
| Required production behavior | Same cart drawer. |
| Frontend | Cart drawer |
| Backend | Cart APIs |
| Database | carts |
| External | None |
| Mock? | Cart contents mock |
| Dependencies / assumptions | None |

---

## 33. Toasts

| Field | Detail |
|---|---|
| Reference | `App.tsx` toast |
| Current behavior | Single toast. 3200ms auto-dismiss. Manual X. Green check on dark brown. Messages: add to cart, customized add, combo add, coupon apply/remove, location set, restaurant selected, order confirmed, reorder. New toast replaces previous (one `toastMessage`). Rewards redeem uses **in-modal** banner, not this toast. Errors use inline text or `alert`. |
| Required production behavior | Same placement and timing. |
| Frontend | Toast host |
| Backend | None |
| Database | None |
| External | None |
| Mock? | N/A |
| Dependencies / assumptions | No error toast variant. |

---

## 34. Loading / error states

| Field | Detail |
|---|---|
| Reference | Location GPS, checkout place-order, menu/search/location empty, coupon error, rewards alert, tracking simulate |
| Current behavior | **Loading:** 600ms locate spinner; 1200ms place-order spinner. No catalog skeletons. No retry. **Errors:** empty menu with Reset Filters; empty search; empty locations; invalid coupon; insufficient points `alert`; empty order history. Checkout has **no** field errors. Images have no `onError` handler (comment mentions fallback but none implemented). |
| Required production behavior | Keep these states; add network errors when APIs exist. |
| Frontend | Empty/error/loading UI |
| Backend | Typed error payloads |
| Database | N/A |
| External | None |
| Mock? | Timers simulate loading |
| Dependencies / assumptions | No offline handling. |

---

## 35. Responsive behavior

| Field | Detail |
|---|---|
| Reference | Tailwind breakpoints in all components; fonts in `index.html` |
| Current behavior | Breakpoints used: `sm`, `md`, `lg`, `xl`. Header 3-zone at `lg`. Bottom nav `md:hidden`. Category rail vs sticky sidebar at `lg`. Offers 1/2/3 cols. Menu products 1/2/3. Combo burger grid 2 then 4. Hero stack then 12-col at `lg`. Checkout 1 col then 7+5 at `lg`. Location pill `max-w-[140px] sm:max-w-[200px]`. Micro-banner extra copy `hidden sm` / `hidden md`. Customizer sheet vs centered `md`. |
| Required production behavior | Match; QA at 390 / 768 / 1024 / 1440 per AGENTS.md. |
| Frontend | Tailwind (production currently has **no** Tailwind package — adding it needs approval) |
| Backend | None |
| Database | None |
| External | Google Fonts (Outfit, Plus Jakarta Sans) as in reference |
| Mock? | N/A |
| Dependencies / assumptions | Current production `package.json` has Next/React/TS only. Styling stack must be approved (Tailwind vs existing CSS). |

---

## 36. Animations / interactions

| Field | Detail |
|---|---|
| Reference | `index.css` `flameGlow`; Tailwind animate-*; Hero mouse tilt; hover scales |
| Current behavior | Header bg after scrollY &gt; 20. Hero image `perspective` tilt from mouse (desktop). Image `hover:scale-105`. Ping live dot. Flame glow keyframes. Fade-in overlays. Cart bar `animate-fade-in-up` (utility name; not defined in `index.css` — may no-op unless Tailwind v4 default). Tracking pulse/bounce. Buttons `active:scale-95`. Customizer/checkout spinners. `package.json` includes `motion` but **it is never imported**. `activeFlavorTag` in Hero is unused. |
| Required production behavior | Preserve listed animations. Do not add Framer Motion unless you approve (reference does not use it). |
| Frontend | CSS + small client handlers |
| Backend | None |
| Database | None |
| External | None |
| Mock? | Tracking motion is simulated |
| Dependencies / assumptions | Confirm `animate-fade-in` / `animate-fade-in-up` implementation in production CSS. |

---

## 37. Existing mock data

| Field | Detail |
|---|---|
| Reference | `src/data/mockData.ts`, hardcoded UI strings |
| Current behavior | 5 images; 12 category chips; 23 products; 5 offers; 7 restaurants; 1 past order; 4 upsells. Hardcoded user Vikram; rider names; FSSAI `10014022002598`; support `1800-22-22-22`, `care@burgerking.in`; Play Store 4.8 / 10M+ downloads (marketing). |
| Required production behavior | Same content as seed data if you approve seeding; do not invent extra products. |
| Frontend | Seed for UI until APIs exist |
| Backend | Seed migrations later (not now) |
| Database | Proposed tables only |
| External | None |
| Mock? | Yes |
| Dependencies / assumptions | Images live under Vite `/src/assets/images/` paths; production needs `public/` copies (do not change reference files). |

---

## 38. Existing mock business logic

| Field | Detail |
|---|---|
| Reference | `App.tsx`, customizer, combo builder, cart coupon, checkout timeout, rewards points, tracking timers |
| Current behavior | All pricing, GST, delivery fee, coupons, order ids, points, GPS delay, tracking ETA are client-side. No inventory, no auth, no payment capture, no store hours enforcement (`isOpen` unused in UI beyond data). |
| Required production behavior | Move money-affecting logic to the server. Keep UI. |
| Frontend | Display + collect input |
| Backend | Quote, checkout, redeem, status |
| Database | As proposed |
| External | Payments/auth if approved |
| Mock? | Yes — **all of it** |
| Dependencies / assumptions | Client must not be trusted for totals. |

---

## 39. Existing external integrations

| Field | Detail |
|---|---|
| Reference | `package.json`, `.env.example`, `metadata.json`, Maps `<a>`, `alert()` |
| Current behavior | **Declared unused:** `@google/genai`, `GEMINI_API_KEY`, metadata `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, `express`, `dotenv`, `motion`, `APP_URL`. **Used:** Google Fonts CSS; lucide-react icons; Google Maps search URL for directions; `alert` for rider call, support chat, app install, insufficient points. No WooCommerce. No Supabase in the reference. |
| Required production behavior | Do **not** add Gemini. Do **not** use WooCommerce. Maps URL can stay. Real call/chat/app stores need approval. Production hosting: Vercel (already). DB: Supabase (connected, empty `public`). |
| Frontend | Links / alerts as in reference until replaced |
| Backend | None from reference |
| Database | None from reference |
| External | See decisions |
| Mock? | Call/chat/install are stubs |
| Dependencies / assumptions | User forbade Gemini and paid services in this phase. |

---

## 40. Any other behavior present in the reference

| Field | Detail |
|---|---|
| Reference | Header micro-banner, AppPromotion, Footer, FoodTypeBadge, logo, CSS tokens, metadata |
| Current behavior | Beef-free / separate veg line claims; Express 30-min; Flame Promise box; FSSAI number; copyright Restaurant Brands Asia / Burger King Corporation; app promo QR is a Lucide icon not a real QR; code BKAPP unused; veg/non-veg FSSAI-style squares; brand colors `#D62300` `#ED7117` `#FFB703` `#241812` cream `#FDFBF7`; selection highlight yellow; `overflow-x: hidden` on body; title/description in `index.html`. No i18n. No dark mode. No PWA. No analytics. No cookie banner. No auth gates. RestaurantFinder service filter state unused. Several unused imports. |
| Required production behavior | Preserve visible marketing/legal copy from the reference. Do not add analytics/cookie/PWA unless asked. |
| Frontend | Footer, promo, badges, tokens |
| Backend | None |
| Database | Optional CMS later — not requested |
| External | App stores if install should work |
| Mock? | App install, QR, BKAPP |
| Dependencies / assumptions | Legal/FSSAI copy is reference text, not verified here. |

---

## Cross-cutting defects in the reference (not fixed)

These are present in the source. Production should not “silently fix” them without your approval:

1. Sauce/size (and meal upcharge options) priced in the customizer but omitted in `handleCustomizerConfirm`.
2. Checkout `deliveryMode` vs App `orderMode` (fee mismatch).
3. Category chip `bestsellers` does not match product.category.
4. Static category counts vs 23 products.
5. Coupon engine ignores `OfferDeal` fields; offer copy vs discount math.
6. Header subtotal vs mobile cart **total**.
7. GPS does not use geolocation.
8. Address Edit is inert.
9. Tracking ignores `order.status`; includes “Simulate Progress”.
10. Rewards redeem does not affect cart.
11. `BKAPP` not a valid cart code.

---

## Current production vs reference

| Area | Production now |
|---|---|
| UI | `h1` Application foundation |
| Supabase | Project `ai-dev-agent-proof-site` / `rekkhdmqqztoddptgzry`, `public` has **no** tables |
| APIs | None |
| Theme library | Missing |
| Tests | Playwright smoke on foundation heading |
