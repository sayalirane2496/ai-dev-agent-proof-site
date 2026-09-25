'use server';

import { createServerSupabase } from '@/lib/supabase/server';
import { parseQuotePayload } from '@/features/cart/validators';
import { quoteCart } from '@/features/pricing/service';

export async function quoteCartAction(formPayload: unknown) {
  const payload = parseQuotePayload(formPayload);
  const supabase = await createServerSupabase();
  return quoteCart(supabase, payload);
}
