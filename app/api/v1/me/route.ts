import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonOk({ user: null, profile: null });
  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) return jsonError('ME_ERROR', error.message, 400);
  return jsonOk({ user: { id: user.id, email: user.email }, profile });
}
