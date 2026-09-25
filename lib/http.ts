import { NextResponse } from 'next/server';

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export function mapRpcError(error: { message?: string } | null) {
  const message = error?.message || 'Request failed';
  if (message.includes('AUTH_REQUIRED')) return jsonError('AUTH_REQUIRED', 'Sign in required', 401);
  if (message.includes('FORBIDDEN')) return jsonError('FORBIDDEN', 'Not allowed', 403);
  if (message.includes('CART_EMPTY')) return jsonError('CART_EMPTY', 'Cart is empty', 400);
  if (message.includes('RESTAURANT_NOT_FOUND')) return jsonError('RESTAURANT_NOT_FOUND', 'Restaurant not found', 404);
  if (message.includes('PRODUCT_NOT_FOUND')) return jsonError('PRODUCT_NOT_FOUND', 'Product not found', 404);
  if (message.includes('COUPON_INVALID')) return jsonError('COUPON_INVALID', 'Invalid or unauthorized promo code', 400);
  if (message.includes('INVALID_QUANTITY')) return jsonError('INVALID_QUANTITY', 'Quantity must be between 1 and 99', 400);
  if (message.includes('INVALID_PAYMENT_METHOD')) return jsonError('INVALID_PAYMENT_METHOD', 'Payment method is not supported', 400);
  if (message.includes('INVALID_FULFILLMENT')) return jsonError('INVALID_FULFILLMENT', 'Choose delivery or pickup', 400);
  if (message.includes('REWARD_NOT_FOUND')) return jsonError('REWARD_NOT_FOUND', 'Reward not found', 404);
  if (message.includes('INSUFFICIENT_POINTS')) return jsonError('INSUFFICIENT_POINTS', 'Not enough Crown points', 400);
  if (message.includes('ORDER_NOT_FOUND')) return jsonError('ORDER_NOT_FOUND', 'Order not found', 404);
  if (message.includes('PROFILE_ROLE_IMMUTABLE')) return jsonError('PROFILE_ROLE_IMMUTABLE', 'Role cannot be changed', 403);
  return jsonError('RPC_ERROR', message, 400);
}
