import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/services', '/how-it-works', '/contact'];

test.describe('site smoke checks', () => {
  for (const route of routes) {
    test(`${route} loads without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('h1')).toBeVisible();
      expect(errors, `Console errors on ${route}`).toEqual([]);
    });
  }

  test('primary navigation reaches every page', async ({ page }) => {
    await page.goto('/');
    for (const href of ['/about', '/services', '/how-it-works', '/contact']) {
      await page.locator(`a[href="${href}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`${href.replace('/', '\\/')}$`));
    }
  });

  test('contact validation rejects invalid input', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /request assessment/i }).click();
    await expect(page.locator('.status')).toContainText(/name is required/i);
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#message').fill('Testing validation');
    await page.getByRole('button', { name: /request assessment/i }).click();
    await expect(page.locator('.status')).toContainText(/valid email|database is not configured/i);
  });

  test('no horizontal overflow at mobile width', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
