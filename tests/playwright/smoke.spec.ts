import { test, expect } from '@playwright/test';

test('foundation home page loads', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'networkidle' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('h1')).toHaveText('Application foundation');
});
