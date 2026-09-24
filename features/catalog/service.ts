import type { SupabaseClient } from '@supabase/supabase-js';
import { mapOffer, mapProduct, mapRestaurant } from './mappers';
import { fetchCatalogRows } from './repository';

export async function getCatalog(client: SupabaseClient) {
  const rows = await fetchCatalogRows(client);
  return {
    categories: rows.categories.map((c) => ({
      id: c.id as string,
      label: c.label as string,
      icon: c.icon as string,
      count: c.display_count as number,
    })),
    products: rows.products.map((p) =>
      mapProduct(
        p as Parameters<typeof mapProduct>[0],
        rows.options as Parameters<typeof mapProduct>[1],
      ),
    ),
    restaurants: rows.restaurants.map((r) => mapRestaurant(r as Parameters<typeof mapRestaurant>[0])),
    offers: rows.coupons.map((c) => mapOffer(c as Parameters<typeof mapOffer>[0])),
    comboSides: rows.comboSides,
    rewards: rows.rewards,
    settings: rows.settings,
    errors: rows.errors,
  };
}
