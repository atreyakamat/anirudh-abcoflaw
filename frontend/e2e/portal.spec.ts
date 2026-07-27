import { test, expect } from '@playwright/test';

test.describe('Client Portal Journey E2E', () => {
  test('should render portal login page with OTP phone input', async ({ page }) => {
    await page.goto('/portal/login');
    await expect(page).toHaveTitle(/Client Portal|AB & Co\./i);
    await expect(page.getByPlaceholder(/phone|mobile/i)).toBeVisible();
  });
});
