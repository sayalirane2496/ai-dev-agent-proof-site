# Customer flow

1. Visit `/`.
2. Choose location and delivery or pickup (`LocationModal`). Pickup zeroes delivery fee (D7).
3. Browse home: hero, offers, menu, combo builder, restaurants, app promotion.
4. Search/filter/category chips; open product customizer; add-ons, meal conversion.
5. Build a combo in Meal Studio.
6. Cart: quantity, remove, upsells, coupon (`KING50` and others).
7. Checkout as guest: name, phone, address or pickup, payment method.
8. Server `quote_cart` / `place_order` compute totals. Client totals are display-only.
9. UPI/card are sandbox-recorded. COD is `cod_pending`.
10. Confirmation + tracking modal (status + ETA animation).
11. Optional sign-in for history, reorder, rewards, saved addresses.

Guest orders stay in the session UI because `orders.user_id` is null and RLS hides them from later browsers.
