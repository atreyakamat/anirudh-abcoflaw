import { test, expect } from '@playwright/test';

test.describe('Client Portal Journey E2E', () => {
  test('should render portal login page with OTP phone input', async ({ page }) => {
    await page.goto('/portal/login', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/AB & Co\. Legal|Client Portal/i);
    const phoneInput = page.locator('input[type="tel"]').first();
    await expect(phoneInput).toBeVisible({ timeout: 10000 });
  });
});
