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
  return jsonError('RPC_ERROR', message, 400);
}
