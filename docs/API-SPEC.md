# API spec

Base: `/api/v1`. JSON `{ ok, data | error }`. Validation + auth on mutating routes. Business logic in `features/*/`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | /catalog | public | products, categories, restaurants, offers, combo sides, rewards |
| GET | /restaurants | public | |
| GET | /offers | public | |
| POST | /cart/quote | public | server `quote_cart` |
| POST | /checkout | public | `place_order`; name/phone required |
| GET | /orders | user | empty list for guests |
| GET | /orders/:code | owner/staff | |
| POST | /orders/:code | kitchen/admin | status |
| GET | /rewards | public/user | points if signed in |
| POST | /rewards/redeem | user | personal coupon |
| GET/POST/PATCH | /addresses | user | |
| GET | /me | session | |
| GET | /admin/dashboard | admin | |
| GET/PATCH | /admin/products | admin | |
| GET/PATCH | /admin/coupons | admin | |
| GET/PATCH | /admin/restaurants | admin | |
| GET | /admin/orders | admin | |
| GET | /admin/customers | admin | |
| GET | /kitchen/orders | kitchen/admin | |

Server Action: `quoteCartAction` in `features/cart/actions.ts`.

Errors: `VALIDATION`, `AUTH_REQUIRED`, `FORBIDDEN`, `CART_EMPTY`, `RPC_ERROR`.
