# Software Architecture

**Application:** Burger King–style online ordering (India)  
**Repository:** `ai-dev-agent-proof-site`  
**Document type:** Software architecture (design phase)  
**Status:** Draft — not implemented  
**Branch:** `feature/burgerking-development`  
**Audience:** Product owner (final decision maker), implementing engineers, Cursor Cloud Agents  

This document describes **how** the production system will be structured. It does **not** implement UI, APIs, schema, authentication, or payments.

It does **not** invent business rules. Rules that exist only as mock client logic in the design reference are recorded as **observed reference behavior**, not as approved production policy.

---

## Related documents

| Document | Role |
|---|---|
| `AGENTS.md` | Delivery, approval, security, QA, Git, Vercel rules |
| `design-reference/burgerking/source/` | UI/UX and functionality source of truth |
| `docs/BURGERKING-FUNCTIONAL-SPEC.md` | Feature-by-feature behavior inventory |
| `docs/BURGERKING-COMPONENT-MAP.md` | Reference component → production module map |
| `docs/ARCHITECTURE.md` | Earlier short proposal |
| `docs/BURGERKING-ARCHITECTURE.md` | Earlier rebuild proposal |
| `docs/BURGERKING-DATABASE-PROPOSAL.md` | Table-level proposal (deferred; not binding here) |
| `docs/BURGERKING-API-PROPOSAL.md` | Endpoint-level proposal (deferred; not binding here) |

---

## 1. System overview

The product is a **full-stack web ordering application** whose user-visible experience must match the Burger King India redesign reference: browse menu, customize items, build a combo, apply offers, select an outlet, manage a cart, check out, track an order, and view rewards / history / addresses.

**Current production state:** a Next.js foundation (`app/page.tsx` heading “Application foundation”). No ordering UI, APIs, or `public` database tables exist yet.

**Reference state:** a Vite + React SPA. One page, in-page sections, overlays (modals/drawer). Catalog, cart, pricing, coupons, orders, and rewards live in React state. There are **no** production network calls in application `.ts`/`.tsx`.

**Production intent:** the same screens and interactions, rebuilt as a Next.js application on Vercel, with durable data in **Supabase PostgreSQL**, server-side pricing and checkout, and Playwright proofs.

**Out of scope for this architecture (forbidden unless later approved):** WooCommerce, Shopify, Gemini, paid AI APIs, and unnecessary third-party services.

---

## 2. Architecture style

**Style:** modular monolith (single Next.js App Router application).

**Layering (strict):**

```text
UI components  (presentation)
        ↓
Feature hooks / view-models  (UI state only)
        ↓
Server actions / route handlers  (transport, auth context, HTTP)
        ↓
Domain services  (pricing, cart, checkout, rewards — no React)
        ↓
Repositories  (Supabase access)
        ↓
PostgreSQL
```

**Principles**

- UI components do not contain money, coupon, tax, or order-creation logic.
- Domain services do not import React or Next.js UI.
- Route handlers / server actions do not embed SQL or pricing formulas inline.
- Database access goes through server-side repositories (or equivalent modules), not from the browser with privileged credentials.
- Payment provider and other integrations sit behind replaceable adapters.
- The Vite app under `design-reference/` is never imported by production code.
- Prefer reusable modules; do not duplicate headers, badges, pricing, or data access.
- Incremental delivery: one feature slice at a time after approval.

This is **not** a microservices system. Splitting services is **TBD — REQUIRES USER DECISION** and is not required by the reference.

---

## 3. High-level system architecture

```text
                    ┌─────────────────────────────────────┐
                    │  Browser (Customer)                 │
                    │  Next.js UI · overlays or routes    │
                    └────────────────┬────────────────────┘
                                     │ HTTPS
                    ┌────────────────▼────────────────────┐
                    │  Vercel · Next.js                   │
                    │  Server Components · Client islands │
                    │  Server Actions / Route Handlers    │
                    │  Domain services · Repositories     │
                    └─────┬──────────────────┬────────────┘
                          │                  │
              ┌───────────▼──────┐   ┌───────▼────────────┐
              │ Supabase Postgres│   │ Payment adapter    │
              │ (system of record│   │ (interface only;   │
              │  after schema is │   │  provider TBD)     │
              │  approved)       │   └────────────────────┘
              └──────────────────┘

  Adjacent (optional / TBD): Maps URL, SMS, telephony, app stores
  Explicitly excluded: WooCommerce · Shopify · Gemini · paid AI APIs
```

**Actors**

| Actor | Role in the reference | Production |
|---|---|---|
| Guest customer | Uses the whole flow with no login | **TBD — REQUIRES USER DECISION** whether guest remains sufficient |
| “King Club” member | UI shows a named Crown Gold user (hardcoded) | Identity layer TBD |
| Operator / kitchen / rider | Not a real back-office; tracking is simulated | No admin app in this architecture unless requested |
| Cursor Cloud Agent | Delivery workflow | Feature branches, QA, PRs, Preview (when instructed) |
| Human owner | Approves architecture, schema, cost, production | Required at every approval gate (`AGENTS.md`) |

---

## 4. Frontend architecture

**Framework:** Next.js App Router, React, TypeScript.

**Rendering split (from interaction needs in the reference, not from invented pages):**

| Kind | Use |
|---|---|
| Server Components | Catalog, offers, restaurant list, marketing copy, footer — when data can be fetched on the server |
| Client Components | Sticky header scroll, cart drawer, customizer, search, location, checkout steps, combo builder, tracking, rewards tabs, toasts, mobile bottom nav |

**UI vs logic**

- Presentational components live in `components/` (logo, veg/non-veg badge, modal chrome, toast).
- Feature UI lives in `features/<name>/` and may call server actions.
- No feature UI module talks to Supabase with a service-role key.
- Do not port Vite `App.tsx` as a single God component. Split by feature while preserving overlay behavior unless routing is approved.

**Styling / assets**

- Visual source of truth is the reference (colors, type, spacing, breakpoints, motion).
- Production currently has **no** Tailwind or `lucide-react`. Adding them is **TBD — REQUIRES USER DECISION** (dependency rule).
- Product images must be copied into `public/` (or an approved storage approach) without modifying `design-reference/`.
- Fonts in the reference: Outfit + Plus Jakarta Sans (Google Fonts CSS). Production font loading is **TBD — REQUIRES USER DECISION** if it requires new setup.

**Navigation**

The reference is a **single-page overlay model** (section scroll + modals/drawer). Mapping that to App Router URLs is **TBD — REQUIRES USER DECISION**. Until then, architecture supports a home shell that hosts the same overlays.

**State**

- Server state: catalog, restaurants, offers, persisted cart/orders (when those exist).
- Client state: open/closed overlays, in-progress customizer, checkout step, toast.
- Cart source of truth in production is the **server**, not `useState` in the page root.

`theme-library/` is **absent**. Shared components are created only when an approved implementation needs them (`AGENTS.md` theme library rule).

---

## 5. Backend architecture

The “backend” is **the same Next.js deployment**, not a separate Express app (Express appears in the reference `package.json` and is unused).

**Transport**

- **Server Actions** for UI-driven mutations (cart, coupon, location, checkout form) — suggested, not mandated.
- **Route Handlers** for provider webhooks and any non-UI clients.
- Mixing both is allowed if each area has one primary style.

**Service modules (logical; not implemented)**

| Service | Responsibility |
|---|---|
| Catalog | Read products, categories, options |
| Pricing / quote | Unit price, extras, combo, fees, tax, discount — **authoritative** |
| Cart | Line identity, merge rules, persistence |
| Offers / coupons | Validate codes against current quote |
| Location / restaurants | Outlet list, selected store, fulfillment mode |
| Checkout | Create order from a server quote |
| Payments | Adapter interface only |
| Orders | History, get-by-id, reorder |
| Tracking | Status read model |
| Rewards | Balance and redeem **if** identity exists |
| Addresses | Saved addresses **if** identity exists |

Handlers validate input, load session, call a service, map errors to UI copy that already exists in the reference (for example the invalid-coupon string). They do not invent new error marketing copy.

**Trust boundary:** the browser may display totals; the server recomputes them. Client `unitPrice` / `totalAmount` are never accepted as payment amounts.

---

## 6. Feature / module architecture

Aligned to reference screens (see functional spec):

| Module | Reference UI | Production home |
|---|---|---|
| `home` | Hero, app promo | Marketing + CTAs |
| `menu` | Menu section, product card, customizer | Catalog + have-it-your-way |
| `search` | Search modal + in-menu search | Two search surfaces |
| `offers` | Featured offers | Deal cards + apply |
| `combos` | Smart combo builder | 3-step meal builder |
| `cart` | Drawer, mobile cart bar | Lines, upsells, bill |
| `location` | Location modal | Delivery/pickup + outlet pick |
| `restaurants` | Restaurant finder | Outlet cards + Maps link |
| `checkout` | Checkout modal | Contact, address, payment UI |
| `orders` | Tracking modal, history tab | Order + tracking |
| `rewards` | King Club modal | Points UI; ledger TBD |
| `chrome` | Header, footer, logo, bottom nav, toast | Shell |

Each module may contain: UI components, a small client hook, and calls into `lib/` services. Modules must not import each other’s internals (only public APIs).

Implementation order is incremental and **page/feature gated** (`AGENTS.md` page-by-page rule). This document does not sequence a build plan beyond that.

---

## 7. Commerce / domain boundaries

Bounded contexts derived from the reference (not extra domains):

```text
┌──────── Catalog ────────┐   ┌──── Merchandising ────┐
│ products, categories,   │   │ offers, coupons,      │
│ options, combo recipes  │   │ upsells               │
└───────────┬─────────────┘   └──────────┬────────────┘
            │                            │
            └──────────► Pricing ◄───────┘
                            │
                     ┌──────▼──────┐
                     │    Cart     │
                     └──────┬──────┘
                            │
              ┌─────────────▼──────────────┐
              │ Fulfillment + Checkout     │
              │ outlet, delivery|pickup,   │
              │ contact, address, payment  │
              └─────────────┬──────────────┘
                            │
                     ┌──────▼──────┐     ┌───────────┐
                     │   Orders    │────►│ Tracking  │
                     └──────┬──────┘     └───────────┘
                            │
                     ┌──────▼──────┐
                     │  Loyalty    │  (King Club UI exists;
                     │  + profile  │   identity TBD)
                     └─────────────┘
```

**Catalog** does not know about payments.  
**Pricing** does not render UI.  
**Cart** does not charge cards.  
**Orders** own snapshots of lines (names, veg flag, unit prices at purchase) so later catalog edits do not rewrite history.  
**Loyalty** must not decrement points inside a React `useState` in production.

Observed reference rules (GST 5% of subtotal, ₹35 delivery under ₹299, named coupon codes) are **client mock logic**. Promoting them to production policy is **TBD — REQUIRES USER DECISION**. Until then, pricing service design must allow those parameters to be configured, not hardcoded in components.

Known reference inconsistencies (customizer sauce/size vs cart confirm math; checkout `deliveryMode` vs app `orderMode`) are **not** silently “fixed” by architecture. Resolution is a product decision.

---

## 8. Database architecture

**Platform:** Supabase PostgreSQL (already connected: project `ai-dev-agent-proof-site`).  
**Current `public` schema:** empty. **Do not create tables in this phase.**

**Responsibilities (boundaries only — not a table list)**

| Boundary | Holds | Does not hold |
|---|---|---|
| Catalog | Sellable items, categories, option groups, images paths | Live cart |
| Merchandising | Offer/coupon definitions | Payment secrets |
| Session / cart | In-progress lines, selected outlet, fulfillment mode, applied code | Card PAN / UPI PIN |
| Checkout / orders | Durable order, line snapshots, status history | Provider raw card data |
| Identity / profile | User profile **if** auth is approved | King Club hardcoded “Vikram” as the only user |
| Loyalty | Point balances and redemptions **if** real | SMS contents |
| Payments | Method, status, provider reference, amount | Full card numbers |

**Access**

- Browser: no service-role key (`AGENTS.md`).
- Server repositories: RLS-aware client for user-owned rows; service role only on the server when a write cannot be expressed as the user (for example payment webhook).
- Migrations live under `database/` when a schema is **later approved**. Agents must not apply migrations until that approval.

**Not decided here:** exact tables, columns, indexes, rupees vs paise, per-restaurant menus vs global catalog. Those belong to a later database design phase.

---

## 9. Authentication architecture

The reference has **no login, signup, session, or password**. Header “Account” and King Rewards open a modal that always displays a hardcoded member.

**Where authentication belongs (if introduced)**

```text
Browser cookie/session
        ↓
Next.js (layout, server actions, route handlers)
        ↓
Identity provider adapter  (interface)
        ↓
profiles / session mapping
        ↓
authorization on cart, orders, addresses, rewards
```

**Possible responsibilities (not a provider choice)**

- Identify a returning member for rewards and order history.
- Optionally attach a guest checkout (name + phone as in the checkout form) to a durable order without an account.
- Authorize “this order belongs to this caller”.
- Never put service-role credentials in the client because “Account” exists in the header.

**Not selected:** Supabase Auth, Clerk, Auth0, magic link, OTP, social login, or required login.  
**TBD — REQUIRES USER DECISION:** guest-only vs optional account vs required account.

Until that decision, architecture treats checkout contact fields as **order metadata**, not as an identity system.

---

## 10. Payment architecture

The reference shows UPI (GPay / PhonePe / Paytm chips), credit/debit card (no card fields), and cash / UPI on delivery. Place order always succeeds after a timeout. There is no PSP.

**Where processing belongs:** server-side, after a **server quote**, behind an adapter. UI only collects `method` and optional `upiApp`. UI never talks to a PSP SDK unless a later approved design requires it.

**Replaceable interface (conceptual — not implemented)**

```text
PaymentAdapter
  createIntent(input: {
    orderId: string
    amountInr: number
    method: 'upi' | 'card' | 'cod'
    upiApp?: 'gpay' | 'phonepe' | 'paytm'
  }) → { status: 'pending' | 'requires_action' | 'succeeded' | 'cod_pending' | 'not_configured' }

  handleWebhook(headers, body) → { orderId, paymentStatus }   // if a provider exists

  // Never stores PAN, CVV, UPI PIN, or full card data
```

| Method in UI | Adapter implication |
|---|---|
| `cod` | Can complete order as unpaid / `cod_pending` without a PSP |
| `upi` / `card` | Require a provider **or** remain UI-only; must not claim “Paid” if nothing charged |

**Not selected:** Razorpay, Stripe, PayU, Paytm merchant, or any paid PSP.  
**Forbidden:** WooCommerce / Shopify checkout.  
**TBD — REQUIRES USER DECISION:** provider vs continue mock with honest non-paid status.

---

## 11. API architecture

APIs exist to support the reference flows, not a public partner platform.

**Shape (areas, not contracts)**

| Area | Typical verbs | Auth |
|---|---|---|
| Catalog, categories, offers, restaurants | Read | Public |
| Cart quote / lines / coupon | Read + mutate | Session (guest or user — TBD) |
| Checkout | Create order | Session |
| Payments webhook | POST inbound | Provider signature |
| Orders, tracking, reorder | Read + mutate | Owner of the order |
| Rewards, addresses | Read + mutate | Identity TBD |

**Error model:** structured `{ error: { code, message } }`; money paths fail closed. Reuse reference user-visible strings where they exist; do not invent new marketing errors.

**Detailed request/response schemas** are deferred (`docs/BURGERKING-API-PROPOSAL.md` is a draft only).

---

## 12. External integrations

Discovered from the reference and the mandated production stack. Nothing in this list is installed or enabled by this document.

| Integration | Evidence | Classification |
|---|---|---|
| **Vercel** | Mandated hosting | **Required** |
| **Supabase PostgreSQL** | Mandated database; project already connected | **Required** |
| **Playwright** | Mandated QA | **Required** |
| **Google Fonts** (Outfit, Plus Jakarta Sans) | `index.html` | **Optional** (match visual reference; loading method TBD) |
| **Google Maps URL** | Restaurant “directions” `maps.google.com/?q=` | **Optional** (matches reference; no SDK) |
| **Browser Geolocation** | Location modal “Use Current Location” is a timer stub | **TBD** |
| **Payment provider** | Checkout payment UI | **TBD** |
| **Identity / auth provider** | Account / King Club UI | **TBD** |
| **SMS** | Copy “Live SMS Updates” / redeem “Check your SMS”; no sender | **TBD** |
| **Telephony / in-app chat** | Tracking Call / Chat use `alert()` | **TBD** |
| **App Store / Play Store** | App promo `alert` + Lucide QR (not a real QR) | **TBD** |
| **Places / geocoding API** | Location search is local filter | **TBD** |
| **Supabase Realtime** | Tracking is a client timer | **TBD** (not in reference) |
| **Supabase Storage** | Images are local JPGs | **TBD** (git `public/` is enough unless you choose Storage) |
| **Gemini / `@google/genai`** | Declared unused | **Do not use** |
| **Express** | Declared unused | **Do not use** |
| **WooCommerce / Shopify** | Not in reference; forbidden | **Do not use** |
| **Paid AI APIs** | Forbidden | **Do not use** |
| **`motion` (Framer)** | In reference `package.json`, never imported | **Do not add unless requested** |

---

## 13. Security architecture

Aligned with `AGENTS.md` secrets and backend rules.

| Concern | Approach |
|---|---|
| Privileged DB | `SUPABASE_SERVICE_ROLE_KEY` (or successor secret) **server only** |
| Public config | `NEXT_PUBLIC_SUPABASE_URL` (and a publishable/anon key **only if** a browser client is approved) |
| Payments | Adapter; no PAN/UPI secrets in app DB |
| Checkout | Server-side reprice; ignore client totals |
| RLS | User-owned carts/orders/addresses when identity exists |
| Guest carts | Must not be world-readable; session binding TBD |
| XSS | React default encoding; do not `dangerouslySetInnerHTML` for catalog copy |
| CSRF | Prefer same-origin server actions / Next patterns; webhooks verify signatures |
| Secrets in git | Never commit `.env` or keys |
| Reference code | Isolated; `tsconfig` excludes `design-reference` |
| Cost | No paid APIs without approval |

Do not disable validation, auth, or RLS to make tests pass.

---

## 14. Environment architecture

| Environment | Purpose |
|---|---|
| Local / Cursor Cloud VM | `next dev`, Playwright against `127.0.0.1:3000` |
| Vercel Preview | Per-branch deploy when Preview is explicitly requested |
| Vercel Production | Git `main` production — **human approval only** |
| Supabase | One connected project today (`ai-dev-agent-proof-site`). Separate staging vs production projects is **TBD — REQUIRES USER DECISION** |

**Env keys already named in `lib/supabase.ts`:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Additional keys (publishable key, payment secrets, auth secrets) are **TBD** and must not be invented in code now.

Reference `.env.example` (`GEMINI_API_KEY`, `APP_URL`) is **not** part of production environment design.

---

## 15. GitHub / CI workflow

**Rules (`AGENTS.md`):** never push to `main`; feature branch → QA → commit → push → PR → STOP. No force push, branch deletion, or history rewrite without confirmation. PRs are not auto-merged.

**Current repo:** no `.github/workflows` directory. Adding GitHub Actions is **TBD — REQUIRES USER DECISION**.

**Intended checks when CI exists (same as local):** `npm run typecheck`, `npm run lint`, `npm run build`, `npm run qa`.

Playwright may use `PREVIEW_URL` against a Vercel Preview instead of the local webServer (`playwright.config.ts`).

---

## 16. Cursor Cloud Agent workflow

Agents follow `AGENTS.md`:

1. Read rules and design reference.  
2. Reuse existing modules; do not invent requirements.  
3. Implement only the approved slice.  
4. Run typecheck, lint, build, QA (max 3 fix attempts).  
5. Commit and push the feature branch; open/update PR.  
6. Vercel Preview only when instructed; production never automatic.  
7. STOP for human approval.

Cloud-specific: use the VM, configured secrets, and `.cursor/environment.json` when present. Do not treat MCP connectivity as permission to mutate Supabase or Vercel.

`design-reference/` is read-only for agents.

---

## 17. Vercel deployment architecture

**Project:** Git-integrated Next.js app (`ai-dev-agent-proof-site`).

| Event | Deploy |
|---|---|
| Push to a feature branch | Preview (platform default) |
| Merge to `main` | Production **only with explicit human approval** to treat that merge as a prod release |
| Agent | Must not change domains, DNS, billing, or production env vars |

Architecture constraint: the app must remain a **single Vercel Next.js project** (no separate Express host). Serverless/Fluid functions run route handlers, server actions, and SSR. No long-running in-process rider simulation as a server daemon; tracking timers in the reference are **client-side** and should not become a Vercel cron unless you later request status updates.

---

## 18. QA architecture

Required on implementation slices:

| Layer | Tool |
|---|---|
| Types | `npm run typecheck` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| E2E | `npm run qa` (Playwright Chromium + iPhone 13 project) |

**Proof types (when UI exists):** load, navigation, add-to-cart, customizer, combo, coupon, location, checkout **UI**, tracking overlay, empty/error states from the reference.

**Responsive:** 390 / 768 / 1024 / 1440.

**Visual:** compare against `design-reference/burgerking/source/`, not against a redesigned interpretation.

**Current:** `tests/playwright/smoke.spec.ts` asserts the foundation heading only. Replace/extend when the home ordering UI is approved — not in this document’s implementation.

---

## 19. Logging / error handling

**Reference:** almost no logging; failures are empty states, one coupon string, `alert()`, or a spinner.

**Production approach (architecture, not an observability vendor):**

- Server: log failed quotes, checkout, and webhook handling **without** secrets, tokens, or full PANs.
- Map domain errors to stable codes for the UI.
- UI: keep reference empty states; add a generic failure state for network errors (copy **TBD — REQUIRES USER DECISION** if it is not in the reference).
- Do not add paid logging/APM without approval. Vercel runtime logs are sufficient initially.

---

## 20. Scalability

The reference catalog is small (23 products, 7 outlets). A single Next.js + Supabase project is enough.

| Concern | Approach |
|---|---|
| Catalog reads | Server Component fetch + HTTP cache later if needed |
| Cart writes | Per-session rows; no global lock |
| Checkout | One quote + one insert; idempotency key **TBD** if retries matter |
| Tracking | Poll or page refresh until Realtime is approved |
| Images | Static `public/` or CDN via Vercel |

Do not introduce queues, Redis, or extra regions unless a measured need and approval exist.

---

## 21. Repository / folder structure

**Now (foundation + docs + reference):**

```text
app/                    # Next.js App Router
components/             # placeholder
features/               # placeholder
lib/supabase.ts         # env key names only
database/               # placeholder for future migrations
public/                 # placeholder
tests/playwright/
docs/
design-reference/burgerking/{original,source}/
AGENTS.md
```

**Target (when implementation is approved):**

```text
app/                          # routes, layouts, optional app/api
components/                   # shared presentational UI
features/{home,menu,search,offers,combos,cart,location,restaurants,checkout,orders,rewards}/
lib/
  domain/                     # pricing, cart, checkout (no React)
  repositories/               # Supabase access
  payments/adapter.ts         # interface + not_configured impl
  auth/                       # only after provider decision
  types/
database/migrations/          # after schema approval
tests/playwright/
public/                       # approved assets
design-reference/             # never imported
docs/
```

`tsconfig` continues to exclude `design-reference` so the Vite app cannot typecheck-break production.

---

## 22. Architecture decisions

These are **decided** by existing instructions and the reference’s shape. They are not reopenable without you.

| ID | Decision |
|---|---|
| AD-1 | Single Next.js App Router modular monolith on Vercel |
| AD-2 | React + TypeScript for UI |
| AD-3 | Supabase PostgreSQL is the system of record |
| AD-4 | Playwright is the E2E proof harness |
| AD-5 | Design reference is UI/UX/behavior truth and is not production code |
| AD-6 | Layered: UI ≠ domain ≠ transport ≠ data access |
| AD-7 | Privileged Supabase credentials never go to the browser |
| AD-8 | Pricing and checkout are server-authoritative |
| AD-9 | Payments behind a replaceable adapter; no provider locked in |
| AD-10 | No WooCommerce, Shopify, Gemini, or paid AI APIs |
| AD-11 | Incremental, approval-gated delivery (`AGENTS.md`) |
| AD-12 | Production deploy is never automatic |

---

## 23. Open decisions / TBD

Mark **TBD — REQUIRES USER DECISION** wherever the reference or approved docs do not settle the choice. A consolidated list is in the next section.

Items that are TBD but **not** blocking this architecture document itself (they block implementation slices): user flows at URL level, exact coupon/tax policy, schema, API contracts, auth provider, payment provider, guest cart persistence, GPS, SMS, tracking realism.

---

### Architecture Decisions Required

Only items that genuinely need your approval before the corresponding implementation:

1. **Navigation:** keep the reference overlay SPA on `/`, or introduce App Router URLs (`/menu`, `/checkout`, `/orders/[id]`, `/account`, …).
2. **Identity:** guest-only, optional account, or required login — and whether to pick a provider later.
3. **Payments:** honest mock (no “Paid” without a charge) vs choose a PSP (may incur cost) vs COD-only real orders.
4. **Pricing policy:** treat reference GST 5%, ₹35 delivery, ₹299 threshold, and the five coupon formulas as production law, or specify different rules.
5. **Customizer vs cart math:** production should follow the customizer UI (include sauce/size) or `App.tsx` confirm handler (omit them).
6. **Fulfillment state:** one `orderMode` for location + checkout + delivery fee, or preserve the reference split.
7. **Styling stack:** approve Tailwind / icon / font packages vs CSS-only.
8. **Supabase environments:** one project for preview+prod vs separate projects.
9. **GitHub Actions:** add CI workflow or rely on agent-local QA + Vercel build.
10. **Guest cart persistence:** cookie/session vs memory-only until login.

Do not treat this architecture document itself as approval to implement any of the above.

---

### Deferred Design Work

The following will be designed in **subsequent phases**, not in this document:

- User flows (including overlay vs routed journeys)
- Detailed business rules (tax, fees, coupons, rewards earn/redeem effects)
- Database tables (columns, keys, RLS policies)
- API contracts (paths, payloads, status codes)
- Payment provider selection and integration
- Authentication flow and provider selection

**This phase stops at software architecture.** No schema, APIs, auth, payments, packages, Vercel changes, Supabase writes, deploys, or merges are authorized by this file.
