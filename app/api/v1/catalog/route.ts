import { getCatalog } from '@/features/catalog/service';
import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const catalog = await getCatalog(supabase);
    return jsonOk({
      categories: catalog.categories,
      products: catalog.products,
      restaurants: catalog.restaurants,
      offers: catalog.offers,
      comboSides: catalog.comboSides,
      rewards: catalog.rewards,
      settings: catalog.settings,
    });
  } catch (error) {
    return jsonError('CATALOG_ERROR', error instanceof Error ? error.message : 'Catalog failed', 500);
  }
}
