import { parseQuotePayload } from '@/features/cart/validators';
import { describePayment } from '@/features/payments/sandbox';
import { placeOrder } from '@/features/pricing/service';
import { jsonError, jsonOk, mapRpcError } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base = parseQuotePayload(body);
    const contactName = String(body.contactName || '').trim();
    const contactPhone = String(body.contactPhone || '').trim();
    if (!contactName || contactName.length < 2) {
      return jsonError('VALIDATION', 'Contact name is required', 400);
    }
    if (!/^\d{10}$/.test(contactPhone.replace(/\s/g, ''))) {
      return jsonError('VALIDATION', 'Enter a 10-digit phone number', 400);
    }
    const paymentMethod = body.paymentMethod === 'card' || body.paymentMethod === 'cod' ? body.paymentMethod : 'upi';
    const payment = describePayment(paymentMethod);
    const supabase = await createServerSupabase();
    const { data, error } = await placeOrder(supabase, {
      ...base,
      contactName,
      contactPhone: contactPhone.replace(/\s/g, ''),
      deliveryAddress: String(body.deliveryAddress || ''),
      deliveryNote: String(body.deliveryNote || ''),
      paymentMethod,
      upiApp: typeof body.upiApp === 'string' ? body.upiApp : undefined,
    });
    if (error) return mapRpcError(error);
    return jsonOk({
      ...(typeof data === 'object' && data ? data : {}),
      paymentNotice: payment.notice,
      isSandboxPayment: payment.isSandbox,
    });
  } catch (error) {
    return jsonError('CHECKOUT_ERROR', error instanceof Error ? error.message : 'Checkout failed', 400);
  }
}
