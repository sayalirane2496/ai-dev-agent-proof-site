import { test, expect } from '@playwright/test';

test('catalog api returns products', async ({ request }) => {
  const res = await request.get('/api/v1/catalog');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.ok).toBeTruthy();
  expect(json.data.products.length).toBeGreaterThan(5);
  expect(json.data.restaurants.length).toBeGreaterThan(3);
});

test('quote api is server authoritative', async ({ request }) => {
  const res = await request.post('/api/v1/cart/quote', {
    data: {
      items: [{ productId: 'prod-whopper-chicken', quantity: 1, customizations: { extraCheese: true } }],
      couponCode: 'KING50',
      fulfillmentType: 'delivery',
    },
  });
  const json = await res.json();
  expect(json.ok).toBeTruthy();
  expect(json.data.subtotal).toBe(244);
  expect(json.data.discountAmount).toBeGreaterThan(0);
  expect(json.data.totalAmount).toBeGreaterThan(0);
});

test('checkout validation rejects short name', async ({ request }) => {
  const res = await request.post('/api/v1/checkout', {
    data: {
      items: [{ productId: 'prod-crispy-veg', quantity: 1 }],
      contactName: 'A',
      contactPhone: '9820143210',
      paymentMethod: 'cod',
    },
  });
  expect(res.status()).toBe(400);
});

test('guest checkout creates sandbox or cod order', async ({ request }) => {
  const res = await request.post('/api/v1/checkout', {
    data: {
      items: [{ productId: 'prod-whopper-chicken', quantity: 1 }],
      couponCode: 'KING50',
      fulfillmentType: 'pickup',
      restaurantId: 'loc-andheri',
      contactName: 'Guest Tester',
      contactPhone: '9820143210',
      deliveryAddress: 'Andheri pickup',
      paymentMethod: 'cod',
    },
  });
  const json = await res.json();
  expect(json.ok).toBeTruthy();
  expect(json.data.publicCode).toMatch(/^BK-IN-/);
  expect(json.data.isSandboxPayment).toBeFalsy();
});
