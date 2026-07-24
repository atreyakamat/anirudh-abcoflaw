import { test, expect } from '@playwright/test';

test.describe('Authentication & Dashboard Navigation E2E', () => {
  test('should navigate to login page and display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Law Practice CRM|Login/i);
    await expect(page.getByRole('heading', { name: /Sign in|Login/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email|username/i)).toBeVisible();
  });

  test('should navigate to public home page and booking page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AB & Co\. Legal|Law Practice/i);
    
    // Check consultation booking link or button
    const bookButton = page.getByRole('link', { name: /Book Consultation|Schedule/i }).first();
    if (await bookButton.isVisible()) {
      await bookButton.click();
      await expect(page.url()).toContain('/book');
    }
  });
});
