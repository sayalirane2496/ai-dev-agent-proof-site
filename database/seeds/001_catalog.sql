-- Demo / development seed data derived from design-reference mock data.
-- Not production content. Safe to re-run only on empty catalog tables.

insert into public.delivery_settings (id, delivery_fee_inr, free_delivery_threshold_inr, tax_rate)
values ('default', 35, 299, 0.05)
on conflict (id) do nothing;

insert into public.restaurants (id, name, locality, city, address, distance_km, eta_min, is_open, timing, services, rating, reviews_count) values
('loc-andheri', 'Burger King — Andheri West', 'Andheri West', 'Mumbai', 'Shop 4 & 5, Crystal Point Mall, New Link Road, Andheri West, Mumbai 400053', 1.8, '25–35 min', true, '10:00 AM – 3:00 AM (Late Night Delivery)', array['Delivery','Takeaway','Dine-In'], 4.6, 3820),
('loc-bandra', 'Burger King — Bandra Linking Rd', 'Bandra West', 'Mumbai', 'Corner of 24th & 33rd Road, Off Linking Road, Bandra West, Mumbai 400050', 4.2, '35–45 min', true, '11:00 AM – 2:00 AM', array['Delivery','Takeaway','Dine-In'], 4.7, 4510),
('loc-koramangala', 'Burger King — Koramangala 5th Block', 'Koramangala', 'Bengaluru', '80 Feet Road, 5th Block, Near Sony World Signal, Koramangala, Bengaluru 560095', 2.1, '20–30 min', true, '10:00 AM – 4:00 AM (24x7 Delivery on Weekends)', array['Delivery','Takeaway','Dine-In','Drive-Thru'], 4.8, 5200),
('loc-indiranagar', 'Burger King — Indiranagar 100ft Rd', 'Indiranagar', 'Bengaluru', '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', 3.5, '30–40 min', true, '10:00 AM – 2:00 AM', array['Delivery','Takeaway','Dine-In'], 4.6, 4110),
('loc-connaught-place', 'Burger King — Connaught Place (Inner Circle)', 'Connaught Place', 'Delhi NCR', 'Block E, Inner Circle, Near Rajiv Chowk Metro Gate 5, Connaught Place, New Delhi 110001', 1.5, '20–30 min', true, '10:00 AM – 1:00 AM', array['Delivery','Takeaway','Dine-In'], 4.7, 6800),
('loc-cyber-hub', 'Burger King — DLF Cyber Hub', 'Cyber City', 'Gurugram', 'Building 10, DLF Cyber City, Phase 2, Gurugram 122002', 3.0, '25–35 min', true, '9:00 AM – 3:00 AM', array['Delivery','Takeaway','Dine-In','Drive-Thru'], 4.7, 3940),
('loc-fc-road', 'Burger King — FC Road', 'Fergusson College Road', 'Pune', 'FC Road, Near Goodluck Chowk, Deccan Gymkhana, Pune 411004', 2.4, '25–35 min', true, '10:00 AM – 1:00 AM', array['Delivery','Takeaway','Dine-In'], 4.5, 3200)
on conflict (id) do nothing;

insert into public.categories (id, label, icon, sort_order, display_count) values
('all', 'All Items', '🍔', 0, 24),
('bestsellers', 'Best Sellers', '⭐', 1, 6),
('whopper', 'Whopper®', '👑', 2, 4),
('burgers-wraps', 'Burgers & Wraps', '🌯', 3, 8),
('king-premium', 'King Gourmet', '✨', 4, 4),
('chicken', 'Chicken & Wings', '🍗', 5, 5),
('veg', 'Pure Veg', '🌱', 6, 7),
('sides', 'Sides & Fries', '🍟', 7, 6),
('beverages', 'Beverages', '🥤', 8, 5),
('desserts', 'Desserts', '🍦', 9, 4),
('bk-cafe', 'BK Café', '☕', 10, 4),
('combos', 'Value Combos', '🍱', 11, 5)
on conflict (id) do nothing;

insert into public.products (id, category_id, name, description, price_inr, original_price_inr, is_veg, badge, calories, spice_level, image_path, cheese_allowed, extra_patty_allowed, can_make_meal, is_combo_burger, is_upsell) values
('prod-whopper-veg', 'whopper', 'Veg Whopper®', 'Our iconic flame-grilled veg patty with fresh crunchy lettuce, sliced ripe tomatoes, pickles, and our signature King mayo.', 189, 219, true, 'Bestseller', '495 kcal', 1, '/images/product_flame_grilled_whopper_1790177567250.jpg', true, true, true, true, false),
('prod-whopper-chicken', 'whopper', 'Chicken Whopper®', '100% flame-grilled chicken patty topped with fresh crispy lettuce, juicy tomatoes, onions, crunchy pickles, and creamy mayonnaise on a toasted sesame seed bun.', 219, 249, false, 'Flame-Grilled', '540 kcal', 1, '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, true, true, true, false),
('prod-whopper-mutton', 'whopper', 'Mutton Whopper®', 'Juicy, rich, flame-grilled mutton patty infused with signature aromatic Indian spices, cheddar cheese slice, fresh lettuce, and smoky black pepper sauce.', 329, null, false, 'Chef Pick', '620 kcal', 2, '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, true, true, false, false),
('prod-crispy-veg', 'veg', 'Crispy Veg Burger', 'Crispy seasoned vegetable patty with fresh creamy mayo and shredded lettuce on a soft toasted bun. India’s favorite daily craving.', 79, 99, true, 'Value', '380 kcal', 1, '/images/product_crispy_veg_burger_1790177553470.jpg', true, true, true, true, false),
('prod-crispy-chicken', 'chicken', 'Crispy Chicken Burger', 'Golden, crispy-fried tender chicken patty smothered in rich creamy mayo and crisp lettuce inside a warm toasted bun.', 119, 139, false, 'Bestseller', '420 kcal', 1, '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, true, true, false, false),
('prod-paneer-royale', 'king-premium', 'Paneer Royale Burger', 'Thick marinated cottage cheese (paneer) patty flame-seared, layered with spicy mint-mayo sauce, crunchy onions, and fresh capsicum on a gourmet brioche bun.', 199, 229, true, 'Must Try', '510 kcal', 2, '/images/product_crispy_veg_burger_1790177553470.jpg', true, false, true, true, false),
('prod-fiery-chicken', 'chicken', 'Fiery Chicken Burger', 'For spice lovers! Crispy chicken patty tossed in intense ghost pepper and habanero seasoning, paired with cooling creamy mayo and pickled jalapenos.', 189, null, false, 'New', '490 kcal', 3, '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, true, true, false, false),
('prod-peri-peri-fries', 'sides', 'King Peri Peri Fries', 'Golden, crispy crinkle-cut fries served with an aromatic, spicy Peri Peri spice shaker sachet. Shake and devour hot!', 119, 139, true, 'Bestseller', '310 kcal', 2, '/images/product_peri_peri_fries_1790177579321.jpg', false, false, false, false, true),
('prod-salted-fries', 'sides', 'Classic Salted Fries', 'Perfect golden potatoes, crispy on the outside, fluffy and tender on the inside, sprinkled with sea salt.', 89, null, true, null, '280 kcal', 0, '/images/product_peri_peri_fries_1790177579321.jpg', false, false, false, false, false),
('prod-chicken-wings', 'chicken', 'Smokey Grilled Chicken Wings (4 Pcs)', 'Juicy bone-in chicken wings flame-glazed with smoky barbecue and crushed red chillies. Finger-licking perfection.', 169, 199, false, 'Must Try', '390 kcal', 2, '/images/hero_whopper_flamegrilled_1790177538251.jpg', false, false, false, false, true),
('prod-veg-wrap', 'burgers-wraps', 'Crunchy Veg King Wrap', 'Warm tortilla wrapped around crunchy spiced veg nuggets, crisp onions, shredded lettuce, and creamy tandoori spread.', 139, null, true, null, '340 kcal', 1, '/images/product_crispy_veg_burger_1790177553470.jpg', true, false, true, false, false),
('prod-chicken-wrap', 'burgers-wraps', 'Crispy Chicken King Wrap', 'Tender crispy chicken strips wrapped with fresh lettuce, diced tomatoes, and tangy spicy sauce in a toasted soft tortilla.', 169, null, false, 'Bestseller', '410 kcal', 1, '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, false, true, false, false),
('prod-cold-coffee', 'bk-cafe', 'BK Café Thick Cold Coffee', 'Rich, smooth roasted Arabica espresso blend churned with creamy chilled milk and sweet cocoa undertones.', 139, 159, true, 'Bestseller', '240 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, true),
('prod-chocolate-shake', 'beverages', 'BK Hazelnut Chocolate Thick Shake', 'Indulgent creamy dessert shake made with rich Belgian chocolate, hazelnut swirls, and topped with chocolate crumble.', 159, null, true, 'Chef Pick', '370 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, false),
('prod-chocolate-mousse', 'desserts', 'Belgian Chocolate Mousse Cup', 'Silky, decadent dark chocolate mousse layered with chocolate sponge crumbs. The sweetest finale to your flame-grilled meal.', 99, null, true, 'Must Try', '210 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, true),
('prod-softie-sundae', 'desserts', 'Hot Fudge Chocolate Sundae', 'Creamy vanilla soft serve crowned with piping hot, rich liquid chocolate fudge.', 79, null, true, null, '190 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, false),
('prod-combo-veg-feast', 'combos', 'Veg Whopper® Meal Combo', 'Veg Whopper® + King Peri Peri Fries + Chilled Coca-Cola (300ml). Save ₹90!', 299, 389, true, 'Value', '890 kcal', 0, '/images/product_flame_grilled_whopper_1790177567250.jpg', true, true, false, false, false),
('prod-combo-chicken-feast', 'combos', 'Chicken Whopper® Meal Combo', 'Flame-Grilled Chicken Whopper® + Peri Peri Fries + Chilled Thums Up. The ultimate king combo.', 339, 429, false, 'Bestseller', '960 kcal', 0, '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, true, false, false, false),
('prod-coke', 'beverages', 'Coca-Cola Zero Sugar (Can)', 'Chilled 300ml can of Coca-Cola Zero Sugar. Refreshing and crisp with zero guilt.', 60, null, true, null, '0 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, false),
('prod-thums-up', 'beverages', 'Thums Up Charged (300ml)', 'Taste the thunder with India’s favorite bold cola.', 60, null, true, null, '140 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, false),
('prod-hot-cappuccino', 'bk-cafe', 'BK Café Fresh Brewed Cappuccino', 'Made from 100% freshly ground Indian beans, steamed silky milk foam, and aromatic espresso.', 119, null, true, null, '120 kcal', 0, '/images/product_bk_cafe_shake_1790177592080.jpg', false, false, false, false, false),
('prod-paneer-combo', 'combos', 'Paneer Royale Value Box', 'Paneer Royale Burger + Classic Salted Fries + Choice of Chilled Beverage.', 279, 329, true, 'Value', '820 kcal', 0, '/images/product_crispy_veg_burger_1790177553470.jpg', false, false, false, false, false),
('prod-family-feast', 'combos', 'King Family 4-Burger Feast', '2 Whoppers (1 Veg, 1 Chicken) + 2 Crispy Veg Burgers + 2 Peri Peri Fries + 4 Beverages. Complete party pack!', 599, 799, false, 'Bestseller', '2150 kcal', 0, '/images/hero_whopper_flamegrilled_1790177538251.jpg', false, false, false, false, false)
on conflict (id) do nothing;

insert into public.product_options (product_id, group_key, name, price_delta_inr, sort_order)
select * from (values
('prod-whopper-veg', 'topping', 'Onions', 0, 1),
('prod-whopper-veg', 'topping', 'Pickles', 0, 2),
('prod-whopper-veg', 'topping', 'Tomatoes', 0, 3),
('prod-whopper-veg', 'topping', 'King Mayo', 0, 4),
('prod-whopper-veg', 'sauce', 'Fiery Habanero Sauce', 25, 1),
('prod-whopper-veg', 'sauce', 'Tandoori King Mayo', 20, 2),
('prod-whopper-veg', 'sauce', 'Cheesy Jalapeno Sauce', 25, 3),
('prod-whopper-chicken', 'topping', 'Onions', 0, 1),
('prod-whopper-chicken', 'topping', 'Pickles', 0, 2),
('prod-whopper-chicken', 'topping', 'Tomatoes', 0, 3),
('prod-whopper-chicken', 'topping', 'Mayonnaise', 0, 4),
('prod-whopper-chicken', 'sauce', 'Smokey BBQ Dip', 25, 1),
('prod-whopper-chicken', 'sauce', 'Fiery Habanero Sauce', 25, 2),
('prod-whopper-chicken', 'sauce', 'Garlic Herb Mayo', 20, 3),
('prod-peri-peri-fries', 'size', 'Regular', 0, 1),
('prod-peri-peri-fries', 'size', 'Medium (+40g)', 30, 2),
('prod-peri-peri-fries', 'size', 'King Size (+90g)', 55, 3),
('prod-peri-peri-fries', 'sauce', 'Warm Liquid Cheddar Cheese Dip', 35, 1),
('prod-peri-peri-fries', 'sauce', 'Cheesy Jalapeno Dip', 25, 2),
('prod-salted-fries', 'size', 'Regular', 0, 1),
('prod-salted-fries', 'size', 'Medium', 25, 2),
('prod-salted-fries', 'size', 'King Size', 45, 3),
('prod-cold-coffee', 'size', 'Standard (300ml)', 0, 1),
('prod-cold-coffee', 'size', 'Large (450ml)', 40, 2)
) as v(product_id, group_key, name, price_delta_inr, sort_order)
where exists (select 1 from public.products p where p.id = v.product_id);

insert into public.combo_sides (id, kind, name, price_delta_inr, image_path, tag, is_hot, sort_order) values
('fries-peri', 'fries', 'King Peri Peri Fries', 40, '/images/product_peri_peri_fries_1790177579321.jpg', null, true, 1),
('fries-salted', 'fries', 'Classic Salted Fries', 30, '/images/product_peri_peri_fries_1790177579321.jpg', null, false, 2),
('fries-cheesy', 'fries', 'Cheesy Melt Fries', 55, '/images/product_peri_peri_fries_1790177579321.jpg', null, false, 3),
('drink-thums', 'drink', 'Thums Up Charged (300ml)', 30, '/images/product_bk_cafe_shake_1790177592080.jpg', 'Favorite', false, 1),
('drink-zero', 'drink', 'Coca-Cola Zero Sugar', 30, '/images/product_bk_cafe_shake_1790177592080.jpg', '0 Sugar', false, 2),
('drink-coffee', 'drink', 'BK Thick Cold Coffee', 65, '/images/product_bk_cafe_shake_1790177592080.jpg', 'Signature', false, 3),
('drink-shake', 'drink', 'Chocolate Hazelnut Shake', 75, '/images/product_bk_cafe_shake_1790177592080.jpg', 'Indulgent', false, 4)
on conflict (id) do nothing;

insert into public.coupons (id, code, title, description, discount_badge, min_order_inr, discount_type, discount_value, max_discount_inr, category, image_path, is_active, is_personal) values
('deal-2for79', 'BOGO79', '2 FOR ₹79 DEAL', 'Get 2 Crispy Veg Burgers for only ₹79. India’s most loved snack-time deal.', 'Save ₹59', 79, 'flat', 59, null, 'under99', '/images/product_crispy_veg_burger_1790177553470.jpg', true, false),
('deal-king50', 'KING50', '50% OFF FIRST ORDER', 'Enjoy 50% discount up to ₹100 on orders above ₹199. Welcome to the Royal Club!', '50% OFF', 199, 'percentage', 50, 100, 'all', '/images/product_flame_grilled_whopper_1790177567250.jpg', true, false),
('deal-meal-upgrade', 'MEALUP', 'FREE UPGRADE TO MEAL', 'Order any Whopper® Burger and get medium peri peri fries and beverage on us.', 'FREE FRIES & DRINK', 219, 'flat', 99, null, 'meals', '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, false),
('deal-family-treat', 'FEAST150', 'ROYAL FAMILY FEAST', 'Flat ₹150 discount on all mega feast combos and bucket meals above ₹499.', 'Flat ₹150 OFF', 499, 'flat', 150, null, 'family', '/images/hero_whopper_flamegrilled_1790177538251.jpg', true, false),
('deal-app-exclusive', 'SWEETKING', 'APP SPECIAL: FREE DESSERT', 'Complimentary Belgian Chocolate Mousse on all flame-grilled orders above ₹299.', 'FREE DESSERT', 299, 'flat', 99, null, 'exclusive', '/images/product_bk_cafe_shake_1790177592080.jpg', true, false)
on conflict (id) do nothing;

insert into public.reward_catalog (id, name, points_cost, icon, credit_inr) values
('rew-1', 'Free King Peri Peri Fries', 350, '🍟', 119),
('rew-2', 'Free BK Hazelnut Thick Shake', 600, '🥤', 159),
('rew-3', 'Free Flame-Grilled Veg / Chicken Whopper', 1400, '🍔', 219),
('rew-4', '₹200 Off on Next Family Feast', 1800, '👑', 200)
on conflict (id) do nothing;
