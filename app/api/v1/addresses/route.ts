import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonOk([]);
  const { data, error } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('created_at');
  if (error) return jsonError('ADDRESS_ERROR', error.message, 400);
  return jsonOk(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError('AUTH_REQUIRED', 'Sign in required', 401);
  const body = await request.json();
  const label = String(body.label || '').trim();
  const flat_building = String(body.flatBuilding || body.flat_building || '').trim();
  if (!label || !flat_building) return jsonError('VALIDATION', 'Label and address are required', 400);
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      label,
      flat_building,
      landmark: String(body.landmark || ''),
      locality: String(body.locality || ''),
      city: String(body.city || ''),
      is_default: Boolean(body.isDefault),
    })
    .select()
    .single();
  if (error) return jsonError('ADDRESS_ERROR', error.message, 400);
  return jsonOk(data, 201);
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError('AUTH_REQUIRED', 'Sign in required', 401);
  const body = await request.json();
  const id = String(body.id || '');
  if (!id) return jsonError('VALIDATION', 'id is required', 400);
  const { data, error } = await supabase
    .from('addresses')
    .update({
      label: body.label,
      flat_building: body.flatBuilding ?? body.flat_building,
      landmark: body.landmark,
      locality: body.locality,
      city: body.city,
      is_default: body.isDefault,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) return jsonError('ADDRESS_ERROR', error.message, 400);
  return jsonOk(data);
}
