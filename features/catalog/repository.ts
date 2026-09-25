import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchCatalogRows(client: SupabaseClient) {
  const [categories, products, options, restaurants, coupons, comboSides, rewards, settings] =
    await Promise.all([
      client.from('categories').select('*').order('sort_order'),
      client.from('products').select('*').eq('is_active', true),
      client.from('product_options').select('*').order('sort_order'),
      client.from('restaurants').select('*'),
      client.from('coupons').select('*').eq('is_active', true).eq('is_personal', false),
      client.from('combo_sides').select('*').order('sort_order'),
      client.from('reward_catalog').select('*'),
      client.from('delivery_settings').select('*').eq('id', 'default').maybeSingle(),
    ]);

  return {
    categories: categories.data ?? [],
    products: products.data ?? [],
    options: options.data ?? [],
    restaurants: restaurants.data ?? [],
    coupons: coupons.data ?? [],
    comboSides: comboSides.data ?? [],
    rewards: rewards.data ?? [],
    settings: settings.data,
    errors: [
      categories.error,
      products.error,
      options.error,
      restaurants.error,
      coupons.error,
      comboSides.error,
      rewards.error,
      settings.error,
    ].filter(Boolean),
  };
}
