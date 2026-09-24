# Burger King — Database Proposal

**Status: proposal only. Do not create this schema.**

No migrations, tables, functions, or seed SQL were applied. Supabase MCP was used read-only: project `ai-dev-agent-proof-site` (`rekkhdmqqztoddptgzry`) has **zero** `public` tables.

This model is derived from the reference types in `design-reference/burgerking/source/src/types/index.ts` and `src/data/mockData.ts`. It is not live.

**Open decisions that change the schema:** guest vs `auth.users`, integer rupees vs paise, per-restaurant menus, overlay-only vs durable order URLs.

---

## 1. Conventions

- PostgreSQL on Supabase.
- Primary keys: `uuid` default `gen_random_uuid()` unless you prefer text ids matching the mock (`prod-whopper-chicken`).
- Money: **integer INR rupees** to match the reference (189, 219, …). Confirm if you want paise (`bigint`) instead.
- Timestamps: `timestamptz` `created_at` / `updated_at`.
- Enums: Postgres enums **or** `text` + check constraints (prefer checks if you want easier changes).
- Do not store card numbers, UPI PINs, or service-role keys.

---

## 2. Enums / statuses (proposed)

| Name | Values (from reference + production needs) |
|---|---|
| `fulfillment_type` | `delivery`, `pickup` |
| `product_badge` | `Bestseller`, `Flame-Grilled`, `Must Try`, `New`, `Value`, `Chef Pick` |
| `order_status` | `Confirmed`, `Grilling`, `Out for Delivery`, `Delivered` (reference). Production may also need `cancelled`, `failed_payment` — **ask before adding**. |
| `payment_method` | `upi`, `card`, `cod` |
| `payment_status` | `pending`, `succeeded`, `failed`, `cod_pending` |
| `discount_type` | `percentage`, `flat` |
| `restaurant_service` | `Delivery`, `Takeaway`, `Dine-In`, `Drive-Thru` |
| `address_label` | `Home`, `Office`, `Other` |
| `spice_level` | `0`, `1`, `2`, `3` |

Category ids from the reference: `whopper`, `burgers-wraps`, `king-premium`, `chicken`, `veg`, `sides`, `beverages`, `desserts`, `bk-cafe`, `combos`, `value-meals` (chip list also uses `all` and `bestsellers` as UI-only).

---

## 3. Tables, columns, relationships

### 3.1 `restaurants`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | e.g. `loc-andheri` |
| `name` | text not null | |
| `locality` | text not null | |
| `city` | text not null | |
| `address` | text not null | |
| `distance_km` | numeric | mock display; production may compute |
| `eta_min` | text | reference is a string (`25–35 min`) |
| `is_open` | boolean not null default true | unused in UI logic today |
| `timing` | text | |
| `rating` | numeric(2,1) | |
| `reviews_count` | integer | |
| `services` | text[] | or join table `restaurant_services` |
| `created_at` / `updated_at` | timestamptz | |

**Relationships:** 1 restaurant → many orders; optionally many products if menus diverge later (reference menu is global).

**Indexes:** `(city)`, `(slug)`.

**Constraints:** `rating` between 0 and 5; `reviews_count >= 0`.

---

### 3.2 `product_categories`

| Column | Type | Notes |
|---|---|---|
| `id` | text PK | chip id |
| `label` | text not null | |
| `icon` | text | emoji in reference |
| `sort_order` | integer | |
| `display_count` | integer | static in mock; optional |

UI-only rows `all` / `bestsellers` may stay in the frontend instead of the table.

---

### 3.3 `products`

| Column | Type | Notes |
|---|---|---|
| `id` | text PK | keep mock ids if seeding 1:1 |
| `category_id` | text FK → `product_categories` | |
| `name` | text not null | |
| `description` | text not null | |
| `price_inr` | integer not null | current selling price |
| `original_price_inr` | integer | strikethrough |
| `is_veg` | boolean not null | |
| `badge` | text | check to badge enum |
| `calories` | text | reference stores `"495 kcal"` |
| `spice_level` | smallint | 0–3 |
| `image_path` | text not null | public URL or storage path |
| `is_active` | boolean not null default true | |
| `can_make_meal` | boolean | |
| `cheese_allowed` | boolean | |
| `extra_patty_allowed` | boolean | |

**Indexes:** `(category_id)`, `(is_veg)`, `(is_active)`, optional GIN/FTS on `name` + `description`.

**Constraints:** `price_inr >= 0`; `original_price_inr` null or `>= price_inr`.

---

### 3.4 `product_options`

Reusable add-ons (sauces, sizes, toppings).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `product_id` | text FK → products ON DELETE CASCADE | |
| `group_key` | text not null | `sauce`, `size`, `topping`, `meal_fries`, `meal_drink` |
| `name` | text not null | |
| `price_delta_inr` | integer not null default 0 | |
| `is_removable_topping` | boolean default false | |
| `sort_order` | integer | |

**Indexes:** `(product_id, group_key)`.

Fixed extras in the reference (cheese +₹25, patty +₹90, meal +₹99) can be columns on `products` **or** rows in this table. Prefer this table so prices are not hardcoded in UI.

---

### 3.5 `offers` / `coupons`

| Column | Type | Notes |
|---|---|---|
| `id` | text PK | e.g. `deal-king50` |
| `code` | text unique not null | `KING50` |
| `title` | text | |
| `description` | text | |
| `discount_badge` | text | |
| `min_order_inr` | integer not null | |
| `discount_type` | text | percentage / flat |
| `discount_value` | integer | 50 meaning 50% or 59 meaning ₹59 |
| `max_discount_inr` | integer | KING50 cap 100 |
| `category` | text | offer filter tab |
| `image_path` | text | |
| `is_active` | boolean | |
| `valid_from` / `valid_to` | timestamptz | reference says “Valid Today” only |

**Note:** App.tsx calculator does **not** use `discount_type` consistently. Production rules must be specified per code (see functional spec §13). Optional `coupon_redemptions` for first-order KING50.

---

### 3.6 `profiles` (only if auth is approved)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK = `auth.users.id` | |
| `display_name` | text | |
| `phone` | text | |
| `loyalty_tier` | text | e.g. Crown Gold |
| `created_at` | timestamptz | |

Guest checkout without this table is possible (`orders.guest_phone`).

---

### 3.7 `addresses`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles, nullable for guests | |
| `label` | text | Home / Office |
| `flat_building` | text | |
| `landmark` | text | |
| `locality` | text | |
| `city` | text | |
| `is_default` | boolean | |
| `created_at` | timestamptz | |

**Constraint:** at most one default per user (unique partial index).

---

### 3.8 `carts` / `cart_items`

| `carts` | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid nullable | |
| `session_id` | text nullable | anonymous cookie |
| `restaurant_id` | uuid/text FK | selected outlet |
| `fulfillment_type` | text | |
| `coupon_code` | text nullable | |
| `updated_at` | timestamptz | |

| `cart_items` | Type | Notes |
|---|---|---|
| `id` | uuid PK | = `cartItemId` |
| `cart_id` | uuid FK | |
| `product_id` | text FK | |
| `product_name_snapshot` | text | |
| `is_veg_snapshot` | boolean | |
| `base_price_inr` | integer | |
| `unit_price_inr` | integer | server computed |
| `quantity` | integer check > 0 | |
| `image_path` | text | |
| `customizations` | jsonb | `SelectedCustomizations` shape |

**Indexes:** `(cart_id)`, unique `(session_id)` on carts where user_id is null.

---

### 3.9 `orders` / `order_items` / `order_status_events`

| `orders` | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `public_code` | text unique | `BK-IN-#####` / `BK-IND-90241` |
| `user_id` | uuid nullable | |
| `restaurant_id` | FK | |
| `fulfillment_type` | text | |
| `status` | text | |
| `contact_name` | text | |
| `contact_phone` | text | |
| `delivery_address` | text | flattened as in reference |
| `delivery_note` | text | |
| `subtotal_inr` | integer | |
| `delivery_fee_inr` | integer | |
| `tax_inr` | integer | |
| `discount_inr` | integer | |
| `total_inr` | integer | |
| `coupon_code` | text | |
| `rider_name` | text | mock in reference |
| `rider_phone` | text | |
| `placed_at` | timestamptz | |

| `order_items` | snapshot of cart lines (do not FK-delete with product changes) |

| `order_status_events` | `order_id`, `status`, `at` | tracking timeline |

**Indexes:** `(user_id, placed_at desc)`, `(public_code)`, `(status)`.

---

### 3.10 `payments`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `order_id` | uuid unique FK | |
| `method` | text | upi / card / cod |
| `upi_app` | text | gpay / phonepe / paytm display only |
| `provider` | text | unset until you choose |
| `provider_ref` | text | |
| `status` | text | |
| `amount_inr` | integer | |
| `created_at` | timestamptz | |

No PAN/UPI secrets.

---

### 3.11 Rewards

| `reward_accounts` | `user_id` PK, `points integer not null check >= 0` |

| `reward_catalog` | `id`, `name`, `points_cost`, `icon`, `effect` jsonb (free sku vs coupon) |

| `reward_ledger` | `id`, `user_id`, `delta`, `reason` (`earn` / `redeem`), `order_id` nullable, `created_at` |

| `reward_redemptions` | catalog_id, user_id, ledger_id, created_at |

Earn rule in copy: 10 points per ₹100 — **not implemented** in the reference; only store it if you want it real.

---

### 3.12 Optional later (not in reference as tables)

- `inventory` / store-level availability
- `delivery_zones`
- `audit_log`
- Storage bucket `product-images`

Do not add these unless you ask.

---

## 4. Relationship diagram (logical)

```text
restaurants 1───* orders 1───* order_items
                 orders 1───1 payments
                 orders 1───* order_status_events

product_categories 1───* products 1───* product_options
products 1───* cart_items *───1 carts
products *───* order_items (snapshot)

profiles 1───* addresses
profiles 1───1 reward_accounts 1───* reward_ledger
coupons (offers) referenced by carts.coupon_code / orders.coupon_code
```

---

## 5. RLS considerations

Until tables exist, this is policy intent only.

| Data | Read | Write |
|---|---|---|
| products, categories, options, offers, restaurants | `anon` + `authenticated` select where `is_active` | service role / admin only |
| carts / cart_items | owner (`user_id = auth.uid()` or signed session token) | owner |
| orders / items / events / payments | owner | insert via server after checkout; customers cannot update status |
| addresses | owner | owner |
| reward_accounts / ledger | owner | insert only via server (service role) |

Guest carts: either (a) no RLS and only server access, or (b) signed session JWT. Do not leave guest carts world-readable.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

---

## 6. Data ownership

| Entity | Owner |
|---|---|
| Catalog, restaurants, offers, reward catalog | Application / operators |
| Cart, addresses, orders, payments, points | End user (or guest session) |
| Rider fields | Operators / mock until a logistics partner exists |

---

## 7. Seed (later, not now)

If you approve seeding, load the 23 products, 5 offers, 7 restaurants, and 4 upsells from the reference. Do not invent extra SKUs.

---

## 8. What was not created

No `apply_migration`, no SQL writes, no `create table`.
