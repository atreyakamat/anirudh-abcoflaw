import { test, expect } from '@playwright/test';

test.describe('Authentication & Dashboard Navigation E2E', () => {
  test('should navigate to login page and display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/AB & Co\. Legal|Login/i);
    await expect(page.getByRole('heading', { name: /Welcome|Sign in|Login/i })).toBeVisible();
    await expect(page.getByPlaceholder(/admin@lawpractice|email|username/i)).toBeVisible();
  });

  test('should navigate to public home page and booking page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AB & Co\. Legal|Law Practice/i);
    
    // Check consultation booking link or button
    const bookLink = page.locator('a[href="/book"]').first();
    await expect(bookLink).toBeVisible();
    await Promise.all([
      page.waitForURL('**/book'),
      bookLink.click(),
    ]);
    expect(page.url()).toContain('/book');
  });
});
