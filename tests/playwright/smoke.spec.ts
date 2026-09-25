import { test, expect } from '@playwright/test';

test('home page heading is present', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.getByRole('heading', { name: /burger king india/i })).toBeVisible();
});
