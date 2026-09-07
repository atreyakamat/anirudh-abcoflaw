import { test, expect } from '@playwright/test';

test.describe('Staff Dashboard & Appointments E2E', () => {
  test('should render staff login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByPlaceholder(/admin@lawpractice|email|username/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });
});
