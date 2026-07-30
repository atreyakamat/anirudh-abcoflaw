import { test, expect } from '@playwright/test';

test.describe('Client Portal Journey E2E', () => {
  test('should render portal login page with OTP phone input', async ({ page }) => {
    await page.goto('/portal/login');
    await expect(page).toHaveTitle(/AB & Co\. Legal|Client Portal/i);
    await expect(page.getByPlaceholder(/\+91|phone|mobile/i)).toBeVisible();
  });
});
