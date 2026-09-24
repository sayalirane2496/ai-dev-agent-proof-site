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
  const { data, error: q } = await supabase.from('coupons').select('*').order('code');
  if (q) return jsonError('ADMIN_ERROR', q.message, 400);
  return jsonOk(data);
}

export async function PATCH(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const id = String(body.id || '');
  if (!id) return jsonError('VALIDATION', 'id is required', 400);
  const { data, error: q } = await supabase
    .from('coupons')
    .update({ is_active: Boolean(body.isActive), title: body.title, description: body.description })
    .eq('id', id)
    .select()
    .single();
  if (q) return jsonError('ADMIN_ERROR', q.message, 400);
  return jsonOk(data);
}
