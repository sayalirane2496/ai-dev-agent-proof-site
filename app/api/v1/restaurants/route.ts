import { getCatalog } from '@/features/catalog/service';
import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const catalog = await getCatalog(supabase);
    return jsonOk(catalog.restaurants);
  } catch (error) {
    return jsonError('RESTAURANTS_ERROR', error instanceof Error ? error.message : 'Failed', 500);
  }
}
