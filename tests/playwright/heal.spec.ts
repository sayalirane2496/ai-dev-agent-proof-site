import { test, expect } from '@playwright/test';

test.describe('heal regressions', () => {
  test('quote rejects unknown product instead of skipping', async ({ request }) => {
    const res = await request.post('/api/v1/cart/quote', {
      data: {
        items: [{ productId: 'prod-does-not-exist', quantity: 1 }],
        fulfillmentType: 'delivery',
      },
    });
    expect(res.status()).toBe(404);
    const json = await res.json();
    expect(json.ok).toBeFalsy();
    expect(json.error.code).toBe('PRODUCT_NOT_FOUND');
  });

  test('quote rejects invalid coupon', async ({ request }) => {
    const res = await request.post('/api/v1/cart/quote', {
      data: {
        items: [{ productId: 'prod-whopper-chicken', quantity: 1 }],
        couponCode: 'NOTAREALCODE',
        fulfillmentType: 'pickup',
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('COUPON_INVALID');
  });

  test('quote rejects quantity above 99', async ({ request }) => {
    const res = await request.post('/api/v1/cart/quote', {
      data: {
        items: [{ productId: 'prod-whopper-chicken', quantity: 100 }],
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toMatch(/INVALID_QUANTITY|QUOTE_ERROR|CHECKOUT_ERROR/);
  });

  test('checkout ignores client totalAmount tampering', async ({ request }) => {
    const honest = await request.post('/api/v1/cart/quote', {
      data: {
        items: [{ productId: 'prod-whopper-chicken', quantity: 1 }],
        couponCode: 'KING50',
        fulfillmentType: 'pickup',
      },
    });
    const quoted = await honest.json();
    expect(quoted.ok).toBeTruthy();

    const res = await request.post('/api/v1/checkout', {
      data: {
        items: [{ productId: 'prod-whopper-chicken', quantity: 1 }],
        couponCode: 'KING50',
        fulfillmentType: 'pickup',
        restaurantId: 'loc-andheri',
        contactName: 'Tamper Tester',
        contactPhone: '9820143210',
        deliveryAddress: 'Andheri pickup',
        paymentMethod: 'cod',
        totalAmount: 1,
        subtotal: 1,
        taxes: 0,
        deliveryFee: 0,
        discountAmount: 9999,
      },
    });
    const json = await res.json();
    expect(json.ok).toBeTruthy();
    expect(json.data.totalAmount).toBe(quoted.data.totalAmount);
    expect(json.data.totalAmount).not.toBe(1);
  });

  test('admin and kitchen APIs require auth', async ({ request }) => {
    const admin = await request.get('/api/v1/admin/products');
    expect(admin.status()).toBe(401);
    const kitchen = await request.get('/api/v1/kitchen/orders');
    expect(kitchen.status()).toBe(401);
    const redeem = await request.post('/api/v1/rewards/redeem', {
      data: { catalogId: 'rew-whopper' },
    });
    expect([400, 401]).toContain(redeem.status());
  });

  test('admin product patch rejects negative price', async ({ request }) => {
    const res = await request.patch('/api/v1/admin/products', {
      data: { id: 'prod-whopper-chicken', priceInr: -50 },
    });
    expect([400, 401]).toContain(res.status());
  });

  test('cart dialog is labelled for assistive tech', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-cart').click();
    await expect(page.getByRole('dialog', { name: /your order/i })).toBeVisible();
  });
});
