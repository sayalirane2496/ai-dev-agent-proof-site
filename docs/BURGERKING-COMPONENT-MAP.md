# Burger King — Component Map

**Status:** production mapping for the implemented storefront.

| Lookup | Result |
|---|---|
| `theme-library/` | Not in this repository |
| Production UI | `components/storefront/*`, `app/page.tsx`, `/login`, `/admin`, `/kitchen` |

**Reference root:** `design-reference/burgerking/source/src/`

**Reuse policy (AGENTS.md):** search theme library and existing app before adding shared components.

| Lookup | Result |
|---|---|
| `theme-library/` | **Not in this repository** |
| Existing app UI | Foundation only (`app/page.tsx`, `app/layout.tsx`) |
| Existing shared components | None |

Therefore every production UI piece is **New** (built to match the reference) or **Adapt** (reference component rewritten as a Next.js Client/Server component). Nothing to **Reuse** from a design system yet.

**Proposed production roots (not created):** `components/` (shared presentational), `features/` (domain modules). Creating a new *reusable* shared component still requires your approval when it becomes a shared architecture choice.

Legend:

- **Reuse** — existing production component can be used as-is  
- **Adapt** — reference behavior/visuals ported into Next.js  
- **New** — no equivalent exists  

---

## Application shell

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `App.tsx` | `app/page.tsx` + feature providers (or overlay shell) | Home ordering shell, global UI state | New |
| `main.tsx` | `app/layout.tsx` | Root layout, fonts, metadata | Adapt (`layout.tsx` exists but is foundation-only) |
| `index.css` | `app/globals.css` (+ Tailwind **only if approved**) | Tokens, scrollbar, flame glow | Adapt |
| `index.html` | `app/layout.tsx` metadata | Title, description, viewport, Google Fonts | Adapt |

---

## Navigation and chrome

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/Header.tsx` | `components/Header.tsx` | Sticky header, location pill, nav, search, account, cart | New |
| `components/BurgerKingLogo.tsx` | `components/BurgerKingLogo.tsx` | Brand lockup | New |
| `components/MobileBottomNav.tsx` | `components/MobileBottomNav.tsx` | Mobile tabs + floating cart bar | New |
| `components/Footer.tsx` | `components/Footer.tsx` | Footer columns, legal copy | New |

---

## Home marketing sections

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/HeroSection.tsx` | `features/home/HeroSection.tsx` | Hero, CTAs, location chip, tilt image | New |
| `components/FeaturedOffers.tsx` | `features/offers/FeaturedOffers.tsx` | Offer cards, apply coupon | New |
| `components/AppPromotion.tsx` | `features/home/AppPromotion.tsx` | App download banner | New |

---

## Menu and catalog

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/MenuSection.tsx` | `features/menu/MenuSection.tsx` | Categories, dietary filters, search, grid | New |
| `components/ProductCard.tsx` | `features/menu/ProductCard.tsx` | Product tile, add, qty, customise | New |
| `components/FoodTypeBadge.tsx` | `components/FoodTypeBadge.tsx` | Veg / non-veg indicator | New |
| `components/SearchModal.tsx` | `features/search/SearchModal.tsx` | Global product search | New |

---

## Customization and combos

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/ProductCustomizerModal.tsx` | `features/menu/ProductCustomizerModal.tsx` | Have-it-your-way, meal upgrade | New |
| `components/SmartComboBuilder.tsx` | `features/combos/SmartComboBuilder.tsx` | 3-step royal meal builder | New |

---

## Location and restaurants

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/LocationModal.tsx` | `features/location/LocationModal.tsx` | Delivery/pickup, outlet search, GPS stub | New |
| `components/RestaurantFinder.tsx` | `features/restaurants/RestaurantFinder.tsx` | Outlet cards, city filter, Maps link | New |

---

## Cart, checkout, orders

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/CartDrawer.tsx` | `features/cart/CartDrawer.tsx` | Cart, upsells, coupon, totals | New |
| `components/CheckoutModal.tsx` | `features/checkout/CheckoutModal.tsx` (or `app/checkout/page.tsx` if you approve routes) | Address, contact, payment UI, place order | New |
| `components/OrderTrackingModal.tsx` | `features/orders/OrderTrackingModal.tsx` (or `app/orders/[orderId]/page.tsx`) | Timeline, fake map, rider actions | New |
| Toast block in `App.tsx` | `components/Toast.tsx` | Success toasts | New |

---

## Account, rewards, addresses

| Reference component | Production component (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `components/RewardsDashboard.tsx` | `features/rewards/RewardsDashboard.tsx` | Points, redeem, history, reorder, addresses | New |

---

## Data and types (not visual)

| Reference module | Production module (proposed) | Production feature | Reuse / Adapt / New |
|---|---|---|---|
| `types/index.ts` | `lib/types/` or `features/*/types.ts` | Domain types | Adapt |
| `data/mockData.ts` | Supabase tables + optional seed (later) | Catalog, offers, restaurants | New (do not import mockData into production) |
| — | `lib/supabase.ts` (exists: env key names only) | Server Supabase client **when approved** | Adapt |

---

## Route mapping (decision required)

Reference has **no routes**. Two production options:

### Option A — Match reference (overlays)

| Route | Renders |
|---|---|
| `/` | Entire home + all modals/drawers |

### Option B — URL-backed (needs your approval)

| Reference screen | Proposed route |
|---|---|
| Home + sections | `/` |
| Menu deep link | `/menu` |
| Offers | `/offers` |
| Combo builder | `/combos` |
| Restaurants | `/restaurants` |
| Search | overlay and/or `/search` |
| Cart | overlay and/or `/cart` |
| Checkout | `/checkout` |
| Tracking | `/orders/[orderId]` |
| Rewards / history / addresses | `/account` |

Until you choose, implementation must not invent extra pages.

---

## Shared primitives likely needed later (ask before extracting)

These appear repeatedly in the reference. They should **not** be extracted until a page implementation is approved:

- Primary red button
- Chip / filter pill
- Modal chrome (header, X, overlay)
- Price `₹` tabular numerals
- Quantity stepper
- Empty-state card

Do not add `lucide-react`, Tailwind, or Google Fonts packages until you approve dependencies.
