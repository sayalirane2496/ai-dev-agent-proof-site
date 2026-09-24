import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonOk({ points: 0, catalog: [], transactions: [], signedIn: false });
    }
    const [{ data: account }, { data: catalog }, { data: transactions }] = await Promise.all([
      supabase.from('reward_accounts').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('reward_catalog').select('*'),
      supabase.from('reward_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    return jsonOk({
      points: account?.points ?? 0,
      catalog: catalog ?? [],
      transactions: transactions ?? [],
      signedIn: true,
    });
  } catch (error) {
    return jsonError('REWARDS_ERROR', error instanceof Error ? error.message : 'Failed', 500);
  }
}
