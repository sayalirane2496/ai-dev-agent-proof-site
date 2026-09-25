import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError('AUTH_REQUIRED', 'Sign in required', 401);
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return jsonError('FORBIDDEN', 'Admin only', 403);
  const { data, error } = await supabase.from('orders').select('*, order_items(product_name, quantity)').order('placed_at', { ascending: false }).limit(40);
  if (error) return jsonError('ADMIN_ERROR', error.message, 400);
  return jsonOk(data);
}
