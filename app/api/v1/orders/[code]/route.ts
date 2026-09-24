import { jsonError, jsonOk, mapRpcError } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    const body = await request.json();
    const nextStatus = String(body.status || '');
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc('admin_set_order_status', {
      order_public_code: code,
      next_status: nextStatus,
    });
    if (error) return mapRpcError(error);
    return jsonOk(data);
  } catch (error) {
    return jsonError('STATUS_ERROR', error instanceof Error ? error.message : 'Failed', 400);
  }
}

export async function GET(_request: Request, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    const supabase = await createServerSupabase();
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, restaurants(name, eta_min), order_items(*), order_status_events(*)')
      .eq('public_code', code)
      .maybeSingle();
    if (error) return jsonError('ORDER_ERROR', error.message, 400);
    if (!order) return jsonError('NOT_FOUND', 'Order not found', 404);
    return jsonOk(order);
  } catch (error) {
    return jsonError('ORDER_ERROR', error instanceof Error ? error.message : 'Failed', 500);
  }
}
