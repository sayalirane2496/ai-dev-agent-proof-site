# Burger King India — Functional Spec (from design reference)

Source of truth: extracted files under `design-reference/burgerking/source/`.  
Original ZIP (untouched): `design-reference/burgerking/original/burger-king-india-—-online-ordering-redesign.zip`.

This document describes what the **reference app actually implements**. It is not a production implementation plan.

The reference is a **single-page Vite + React** app. Navigation is in-page section scrolling plus overlays (modals/drawers). There are no separate production routes.

---

## 1. Pages / screens

There is one HTML page (`index.html` + `src/App.tsx`). Logical screens:

| Screen | How it appears | Section / overlay |
|---|---|---|
| Home / marketing landing | Default view | `HeroSection` (scroll top) |
| Featured offers | Home page section | `FeaturedOffers` |
| Menu browse | Home page section `#menu` | `MenuSection` |
| Smart combo builder | Home page section | `SmartComboBuilder` (`#combos` via nav) |
| Restaurant finder | Home page section | `RestaurantFinder` |
| App download promo | Home page section | `AppPromotion` |
| Footer / legal-style links | Home page footer | `Footer` |
| Location selector | Modal | `LocationModal` |
| Product customizer | Modal (mobile: bottom sheet) | `ProductCustomizerModal` |
| Global search | Modal | `SearchModal` |
| Cart | Right drawer | `CartDrawer` |
| Checkout | Modal, 2 form steps + processing | `CheckoutModal` |
| Order tracking | Modal | `OrderTrackingModal` |
| King Club rewards / orders / addresses | Modal with tabs | `RewardsDashboard` |
| Toast notification | Fixed overlay | inline in `App.tsx` |
| Mobile cart mini-bar | Fixed above bottom nav (`md:hidden`) | `MobileBottomNav` |
| Mobile bottom navigation | Fixed (`md:hidden`) | `MobileBottomNav` |

Header nav targets: `home`, `menu`, `combos`, `restaurants`, plus overlay actions for search, rewards, cart.

---

## 2. Components (reference)

| File | Role |
|---|---|
| `BurgerKingLogo.tsx` | Brand lockup |
| `Header.tsx` | Sticky header, location chip, nav, search, rewards, cart |
| `MobileBottomNav.tsx` | Mobile tabs + floating cart summary |
| `HeroSection.tsx` | Hero, CTAs, location/time/rating chips |
| `FeaturedOffers.tsx` | Offer cards + coupon apply |
| `MenuSection.tsx` | Category chips, dietary filters, in-menu search, product grid |
| `ProductCard.tsx` | Product tile, veg/non-veg badge, qty, customize |
| `FoodTypeBadge.tsx` | Veg / non-veg indicator |
| `SmartComboBuilder.tsx` | Burger + fries + drink combo picker |
| `RestaurantFinder.tsx` | Outlet list, city filter, select / directions |
| `AppPromotion.tsx` | App download marketing banner |
| `Footer.tsx` | Footer nav and legal-style copy |
| `LocationModal.tsx` | Delivery vs pickup, locate me, search locations |
| `ProductCustomizerModal.tsx` | Cheese, patty, toppings, sauces, size, meal add-on |
| `CartDrawer.tsx` | Line items, upsells, coupon input, totals, checkout CTA |
| `CheckoutModal.tsx` | Address/contact, payment UI, place order |
| `OrderTrackingModal.tsx` | Status timeline, map placeholder, rider actions |
| `RewardsDashboard.tsx` | Points, redeem, past orders, reorder, addresses |
| `SearchModal.tsx` | Product search overlay |

---

## 3. Interactions

- Smooth-scroll section navigation (`scrollIntoView` / `scrollTo`).
- Sticky header background change after 20px scroll.
- Open/close location, search, cart, customizer, checkout, tracking, rewards.
- Add / increment / decrement / remove cart items.
- Apply coupon from offer card or cart text field; remove coupon.
- Toggle delivery vs pickup in location modal (and again in checkout).
- Filter menu by category, veg/non-veg, bestsellers, search text.
- Filter restaurants by city (`All`, Mumbai, Bengaluru, Delhi NCR, Pune).
- Filter offers by category tabs.
- Select restaurant from finder; updates “ordering from” location + toast.
- Customize product then confirm add-to-cart.
- Build a combo and add as a meal cart line.
- Place order (client timeout mock) then open tracking.
- Reorder past order items into cart.
- Track a past order from rewards.
- Redeem Crown points (client-side points decrement) or `alert` if insufficient.
- Toast auto-dismiss after 3200ms; can dismiss with X.
- Call rider / chat support via `alert()` stubs.
- Google Maps link for outlet address (`maps.google.com`).
- “Use current location” in location modal: 800ms spinner then toast (does not change GPS).

---

## 4. Modals, drawers, forms

**Modals:** Location, Product customizer, Search, Checkout, Order tracking, Rewards.

**Drawer:** Cart (right).

**Forms / fields:**

- Menu search input; global search input.
- Location search input.
- Cart coupon input.
- Checkout: name, phone, flat/building, landmark, delivery note presets, UPI app choice, place-order button.
- Rewards: redeem buttons (not a traditional form).

---

## 5. Product behavior

- Catalog of 23 products in `PRODUCTS` (categories include Whopper, burgers/wraps, gourmet, chicken, veg, sides, beverages, desserts, BK Café, combos, value-meals).
- Fields: id, name, category, price, optional originalPrice, description, isVeg, badge, calories, spiceLevel, image, customizationOptions.
- Badges: Bestseller, Flame-Grilled, Must Try, New, Value, Chef Pick.
- Product card: add to cart, quantity stepper when already in cart, Customize CTA.
- Default add-to-cart stacks quantity only for **uncustomized** matching `productId`.

---

## 6. Product customization

`ProductCustomizerModal` + `SelectedCustomizations`:

- Extra cheese (+₹25).
- Extra patty (+₹90).
- Remove toppings from `removableToppings`.
- Optional paid sauces.
- Optional size `priceDelta`.
- Make it a meal (+₹99) with fries choice (Peri Peri / Salted) and drink (Coke Zero / Thums Up).
- Quantity stepper in the modal.
- Live unit price preview.

---

## 7. Combo functionality

- **Catalog combos:** Veg/Chicken Whopper meals, Paneer value box, Family 4-burger feast (products).
- **Smart Combo Builder:** pick burger (Veg Whopper, Chicken Whopper, Crispy Veg, Paneer Royale), fries variant, drink variant; combo price = burger.price + fries.priceDelta + drink.priceDelta; savings vs burger + ₹119 fries + ₹60 drink.
- Combo cart line: `isMeal: true`, stores `mealFries` and `mealDrink`, `unitPrice` = combo price.

---

## 8. Cart functionality

- Seeded with Chicken Whopper + Peri Peri Fries.
- Per-line increment / decrement / remove.
- Upsell strip from `UPSELL_ITEMS` (fries, cold coffee, mousse, wings).
- Free-delivery progress vs ₹299 subtotal.
- Empty cart state.
- Proceed to checkout.

---

## 9. Pricing behavior (client-side)

- Line `unitPrice` × quantity → subtotal.
- Delivery fee: ₹0 if pickup or empty cart; else ₹35 if subtotal &lt; ₹299, else ₹0.
- GST: `Math.round(subtotal * 0.05)`.
- Total: `max(0, subtotal + deliveryFee + taxes - discount)`.
- Customizer extras: cheese 25, patty 90, meal 99 (sauce/size deltas calculated in customizer UI).

---

## 10. Coupon behavior

Hardcoded codes in `App.tsx` / cart:

| Code | Rule in `App.tsx` |
|---|---|
| `KING50` | 50% off, max ₹100, only if subtotal ≥ ₹199 |
| `BOGO79` | flat ₹59 |
| `MEALUP` | flat ₹99 |
| `FEAST150` | ₹150 if subtotal ≥ ₹499 else ₹0 |
| `SWEETKING` | ₹99 if subtotal ≥ ₹299 else ₹0 |

Default applied coupon: `KING50`.  
Invalid cart codes show: `Invalid promo code. Try KING50, BOGO79 or FEAST150`.  
Offer objects also have `minOrder`, `discountType`, `discountValue` (not always used by the discount calculator).

---

## 11. Search

- Header / mobile search opens `SearchModal`; filters `PRODUCTS` by name/description.
- Menu section has its own search bound to `menuSearchQuery`.

---

## 12. Filters

- Menu categories (`CATEGORIES` chips).
- Dietary: all / veg / non-veg.
- Bestsellers toggle (badge Bestseller or Flame-Grilled).
- Offers tabs: all, under99, meals, burgers, family, exclusive.
- Restaurant city filter.

Empty menu state copy: no items matching filters/search.

---

## 13. Offers

`OFFERS` (5 deals): BOGO79, KING50, MEALUP, FEAST150, SWEETKING. Apply sets `appliedCouponCode` and toast.

---

## 14. Restaurant / location

`POPULAR_LOCATIONS` (7 outlets): Andheri, Bandra, Koramangala, Indiranagar, Connaught Place, Cyber Hub, FC Road.

Fields: name, locality, city, distanceKm, etaMin, address, isOpen, timing, services (Delivery / Takeaway / Dine-In / Drive-Thru), rating, reviewsCount.

Default location: Andheri West.

---

## 15. Delivery / pickup

- `orderMode` in App (`delivery` | `pickup`) drives delivery fee.
- Location modal toggle Delivery / Pickup.
- Checkout has a **separate** `deliveryMode` state (not wired to App `orderMode`).
- Delivery notes: Leave at door, Ring bell, Call on arrival, Meet at lobby.

---

## 16. Checkout

Stepper: (1) Delivery & contact (2) Payment (3) processing spinner.

Contact defaults: Vikram Malhotra, 9820143210, Flat 402 Sea Green Heights, Near Crystal Point Mall.

Place order: 1200ms timeout, generates `BK-IN-{5 digits}`, clears cart, opens tracking.

---

## 17. Payment UI (mock only)

- UPI Instant Pay: Google Pay / PhonePe / Paytm (UI selection only).
- Credit / debit card (UI selection only; no card fields collected).
- Cash / UPI on delivery.
- Copy: zero convenience fees, ShieldCheck “secure”.
- No real PSP, no Razorpay/Stripe, no charge.

---

## 18. Orders / reorder / tracking

- `pastOrders` seeded with `INITIAL_ORDERS` (`BK-IND-90241`, Delivered).
- New orders prepended with status `Confirmed`.
- Reorder copies past `items` into cart and opens cart.
- Tracking modal: timeline Confirmed → Grilling → Out for Delivery → Delivered; fake map pin; rider name/phone; Call (`alert`) and Chat (`alert`).

---

## 19. Rewards

- Display name: Vikram, Crown Gold.
- Starting points: 1250.
- Catalog: fries 350 pts, shake 600, Whopper 1400, ₹200 feast off 1800.
- Redeem decrements points or `alert` if short.
- Crown Gold progress UI (static).

---

## 20. Addresses

Rewards tab **Addresses** uses two hardcoded entries (Home Andheri, Office BKC). No add/edit/delete persistence. Checkout uses its own address fields.

---

## 21. Mobile

- Bottom nav: Home, Menu, Rewards, Account (Account opens rewards).
- Floating cart bar when cart has items.
- Customizer as bottom sheet on small screens (`items-end md:items-center`).
- Header location/nav collapse; micro-banner hides some copy below `sm`/`md`.

---

## 22. Animations

- Tailwind `animate-fade-in`, `animate-fade-in-up`, `animate-spin` (locate / place order), `animate-pulse` / `animate-bounce` (tracking), `animate-ping` (hero).
- CSS `flameGlow` / `.flame-glow`.
- Header `transition-all duration-200`.
- `package.json` includes `motion` but it is not imported in the inspected source.

---

## 23. Loading states

- Location “Use current location”: 800ms `isLocating` spinner.
- Checkout place order: `isProcessing` spinner ~1200ms.
- No skeleton loaders, no network pending states (all data is local).

---

## 24. Error states

- Menu empty filter/search message.
- Location list empty: no matching restaurants.
- Invalid coupon string in cart.
- Insufficient Crown points `alert`.
- No API error handling (no fetch).
- No form validation beyond empty coupon skip; checkout does not validate phone/name before place order.

---

## 25. Mock data

In `src/data/mockData.ts`:

- 5 product images (reused across many SKUs).
- 12 category chips (counts are static display numbers, not always equal to filtered product counts).
- 23 products, 5 offers, 7 restaurants, 1 past order, 4 upsell products.

Hardcoded user/address/rider strings in App, Checkout, Rewards, tracking.

---

## 26. Mock business logic

All of: cart math, GST, delivery fee, coupons, combo pricing, customizer deltas, order id generation, points redeem, reorder, tracking status display, locate-me delay.

No server, no inventory, no real payments, no auth.

---

## 27. External integrations (declared vs used)

| Declared | Actual usage in extracted TS/TSX |
|---|---|
| `@google/genai` / `GEMINI_API_KEY` / metadata `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` | **Not used** in source `.ts`/`.tsx` |
| `APP_URL` in `.env.example` | Not used in app code |
| Google Maps URL | Outlet “directions” `href` |
| `alert()` | Rider call, support chat, insufficient points |
| Vite / Tailwind / lucide-react / express (package.json) | UI stack; Express not used in `src/` |

---

## 28. Accessibility / assets (as implemented)

- Some `aria-label="Close"` buttons.
- Veg/non-veg via `FoodTypeBadge`.
- Images are local JPGs under `src/assets/images/`.
- Fonts: Outfit + Plus Jakarta Sans (CSS variables).
- Brand colors: `#D62300`, `#ED7117`, `#FFB703`, `#241812`, cream `#FDFBF7`.
