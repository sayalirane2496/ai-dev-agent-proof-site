# Restaurant / outlet flow

Route: `/kitchen`. Role `restaurant` (plus admin).

- Sees orders (kitchen query filters `restaurant_id` when set)
- Advances status: Confirmed → Grilling → Out for Delivery → Delivered via `admin_set_order_status`
- Restaurant details and open/timing are admin-managed
- Pickup vs delivery is stored on each order (`fulfillment_type`)

No second auth system. Demo kitchen user is bound to Andheri (`loc-andheri`).
