import { test, expect } from '@playwright/test';

test.describe('storefront', () => {
  test('home loads hero offers menu combo restaurants', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole('heading', { name: /burger king india/i })).toBeVisible();
    await expect(page.getByTestId('order-now')).toBeVisible();
    await expect(page.locator('#offers')).toBeVisible();
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('#combo-builder')).toBeVisible();
    await expect(page.locator('#restaurants')).toBeVisible();
    expect(errors.filter((e) => !e.includes('favicon')).length).toBeLessThan(5);
  });

  test('menu search filter and add to cart', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('order-now').click();
    const search = page.locator('#menu input, #menu [type="search"]').first();
    if (await search.count()) {
      await search.fill('Whopper');
    }
    const veg = page.getByRole('button', { name: /veg/i }).first();
    if (await veg.isVisible()) await veg.click();
    await page.getByTestId('add-prod-crispy-veg').click();
    await expect(page.getByText(/added/i).first()).toBeVisible({ timeout: 8000 });
    await page.getByTestId('open-cart').click();
    await expect(page.getByText(/crispy veg/i).first()).toBeVisible();
    await page.getByRole('button', { name: /increase/i }).first().click({ timeout: 3000 }).catch(() => undefined);
    await page.getByTestId('proceed-checkout').click();
    await expect(page.getByText(/royal checkout/i)).toBeVisible();
  });

  test('coupon and pickup copy in cart', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-cart').click();
    const coupon = page.getByPlaceholder(/promo/i).or(page.locator('input[name="coupon"]')).first();
    if (await coupon.count()) {
      await coupon.fill('KING50');
      await page.getByRole('button', { name: /apply/i }).first().click();
    }
    await expect(page.getByText(/to pay/i)).toBeVisible();
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
    await page.getByRole('button', { name: /king rewards/i }).first().click();
    await expect(page.getByText(/king club rewards/i)).toBeVisible();
    await page.getByRole('button', { name: /order history/i }).click();
    await page.getByRole('button', { name: /saved addresses/i }).click();
    await expect(page.getByText(/home/i).first()).toBeVisible();
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
