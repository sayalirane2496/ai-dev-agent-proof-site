# Database schema

Applied to development project `rekkhdmqqztoddptgzry`. Source: `database/migrations/001_init.sql`. Seeds: `database/seeds/`.

## Tables

| Table | PK | Purpose |
|---|---|---|
| profiles | id → auth.users | display name, role, optional restaurant_id |
| restaurants | text id | outlets |
| delivery_settings | text id | fee, free threshold, GST |
| categories | text id | menu chips |
| products | text id | catalog |
| product_options | uuid | sauce/size/topping |
| combo_sides | text id | meal studio fries/drinks |
| coupons | text id | offers + personal reward coupons |
| coupon_redemptions | uuid | usage log |
| addresses | uuid | user-owned |
| orders | uuid | checkout result; `public_code` unique |
| order_items | uuid | line items + customizations jsonb |
| order_status_events | uuid | timeline |
| payments | uuid | sandbox/COD record; never PAN/PIN |
| reward_accounts | user_id | points |
| reward_catalog | text id | redeemable items |
| reward_transactions | uuid | earn/redeem |

## Status values

Orders: `Confirmed`, `Grilling`, `Out for Delivery`, `Delivered`, `Cancelled`.

Payments: `cod_pending`, `sandbox_recorded`.

Roles: `customer`, `admin`, `restaurant`.

## RLS

Public read on catalog. User-owned addresses/orders/rewards. Admin writes. Kitchen order select via `is_kitchen()`. Mutations for checkout/redeem/status go through SECURITY DEFINER RPCs.

## Indexes

`product_options(product_id, group_key)`, `addresses(user_id)`, `orders(user_id, placed_at)`, `orders(restaurant_id, placed_at)`, `orders(public_code)`.
