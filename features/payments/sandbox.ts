export const SANDBOX_NOTICE =
  'Test / sandbox payment only. No bank, UPI, or card charge was made.';

export function describePayment(method: 'upi' | 'card' | 'cod') {
  if (method === 'cod') {
    return {
      provider: 'cod',
      status: 'cod_pending',
      isSandbox: false,
      notice: 'Pay the rider in cash or UPI on delivery. No online charge was taken.',
    };
  }
  return {
    provider: 'sandbox_mock',
    status: 'sandbox_recorded',
    isSandbox: true,
    notice: SANDBOX_NOTICE,
  };
}
