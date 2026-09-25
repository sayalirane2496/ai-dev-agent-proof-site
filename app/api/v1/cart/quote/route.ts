import { parseQuotePayload } from '@/features/cart/validators';
import { quoteCart } from '@/features/pricing/service';
import { jsonError, jsonOk, mapRpcError } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseQuotePayload(body);
    const supabase = await createServerSupabase();
    const { data, error } = await quoteCart(supabase, payload);
    if (error) return mapRpcError(error);
    return jsonOk(data);
  } catch (error) {
    return jsonError('QUOTE_ERROR', error instanceof Error ? error.message : 'Quote failed', 400);
  }
}
