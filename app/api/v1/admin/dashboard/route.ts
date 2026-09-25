import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: jsonError('AUTH_REQUIRED', 'Sign in required', 401) };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return { supabase, error: jsonError('FORBIDDEN', 'Admin only', 403) };
  return { supabase, error: null };
}

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error) return error;
  const [{ count: orders }, { count: customers }, { data: recent }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('public_code, total_inr, status, placed_at').order('placed_at', { ascending: false }).limit(8),
  ]);
  return jsonOk({ orders: orders ?? 0, customers: customers ?? 0, recent: recent ?? [] });
}
