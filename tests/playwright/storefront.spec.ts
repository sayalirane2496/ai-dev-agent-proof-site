import { test, expect } from '@playwright/test';

test.describe('storefront', () => {
  test('home loads hero offers menu combo restaurants', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole('heading', { name: /burger king india/i })).toBeVisible();
    await expect(page.getByTestId('order-now')).toBeVisible();
    await expect(page.locator('#offers')).toBeVisible();
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('#combo-builder')).toBeVisible();
    await expect(page.locator('#restaurants')).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('menu search filter and add to cart', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('order-now').click();
    const search = page.locator('#menu input').first();
    await search.fill('Crispy Veg');
    await page.getByTestId('add-prod-crispy-veg').click();
    await expect(page.getByText(/added/i).first()).toBeVisible({ timeout: 8000 });
    await page.getByTestId('open-cart').click();
    await expect(page.getByText(/crispy veg/i).first()).toBeVisible();
    await page.getByTestId('proceed-checkout').click();
    await expect(page.getByText(/royal checkout/i)).toBeVisible();
  });

  test('coupon and pickup copy in cart', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-cart').click();
    await expect(page.getByText(/to pay/i)).toBeVisible();
    await expect(page.getByText(/coupon/i).first()).toBeVisible();
  });

  test('guest checkout validation and sandbox notice', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-cart').click();
    await page.getByTestId('proceed-checkout').click();
    await page.getByRole('button', { name: /continue to payment/i }).click();
    await expect(page.getByText(/sandbox payment only/i)).toBeVisible();
    await page.getByText(/cash \/ upi on delivery/i).click();
    await expect(page.getByText(/no online charge/i)).toBeVisible();
    await page.getByTestId('place-order').click();
    await expect(page.getByText(/confirmed/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('rewards and addresses tabs', async ({ page }) => {
    await page.goto('/');
    const desktopRewards = page.getByRole('button', { name: /king rewards/i });
    if (await desktopRewards.first().isVisible()) {
      await desktopRewards.first().click();
    } else {
      await page.getByRole('button', { name: /^rewards$/i }).click();
    }
    await expect(page.getByText(/king club rewards/i)).toBeVisible();
    await page.getByRole('button', { name: /order history/i }).click();
    await page.getByRole('button', { name: /saved addresses/i }).click();
    await expect(page.getByText(/add address/i)).toBeVisible();
  });

  test('login page and protected admin', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await page.goto('/admin');
    await expect(page.getByTestId('admin-forbidden').or(page.getByTestId('admin-panel'))).toBeVisible();
    await page.goto('/kitchen');
    await expect(page.getByTestId('kitchen-forbidden').or(page.getByTestId('kitchen-profile'))).toBeVisible();
  });
});

const viewports = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1440, h: 900 },
];

for (const vp of viewports) {
  test(`responsive ${vp.w}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto('/');
    await expect(page.getByTestId('order-now')).toBeVisible();
    await expect(page.locator('#menu')).toBeVisible();
  });
}
