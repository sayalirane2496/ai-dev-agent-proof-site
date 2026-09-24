import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

async function requireKitchen() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, profile: null, error: jsonError('AUTH_REQUIRED', 'Sign in required', 401) };
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile || (profile.role !== 'admin' && profile.role !== 'restaurant')) {
    return { supabase, profile, error: jsonError('FORBIDDEN', 'Kitchen or admin only', 403) };
  }
  return { supabase, profile, error: null };
}

export async function GET() {
  const { supabase, profile, error } = await requireKitchen();
  if (error) return error;
  let query = supabase.from('orders').select('*, order_items(*)').order('placed_at', { ascending: false }).limit(50);
  if (profile?.role === 'restaurant' && profile.restaurant_id) {
    query = query.eq('restaurant_id', profile.restaurant_id);
  }
  const { data, error: q } = await query;
  if (q) return jsonError('KITCHEN_ERROR', q.message, 400);
  return jsonOk({ profile, orders: data ?? [] });
}
