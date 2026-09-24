import { jsonError, jsonOk, mapRpcError } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const catalogId = String(body.catalogId || '');
    if (!catalogId) return jsonError('VALIDATION', 'catalogId is required', 400);
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc('redeem_reward', { catalog_id: catalogId });
    if (error) return mapRpcError(error);
    return jsonOk(data);
  } catch (error) {
    return jsonError('REDEEM_ERROR', error instanceof Error ? error.message : 'Failed', 400);
  }
}
