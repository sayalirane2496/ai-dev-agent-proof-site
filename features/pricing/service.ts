import type { QuotePayload } from '@/features/cart/validators';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function quoteCart(client: SupabaseClient, payload: QuotePayload) {
  const { data, error } = await client.rpc('quote_cart', { payload });
  return { data, error };
}

export async function placeOrder(
  client: SupabaseClient,
  payload: QuotePayload & {
    contactName: string;
    contactPhone: string;
    deliveryAddress: string;
    deliveryNote?: string;
    paymentMethod: 'upi' | 'card' | 'cod';
    upiApp?: string;
  },
) {
  const { data, error } = await client.rpc('place_order', { payload });
  return { data, error };
}
