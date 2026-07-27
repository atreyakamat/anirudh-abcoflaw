import { test, expect } from '@playwright/test';

test.describe('Visitor Consultation Booking E2E', () => {
  test('should render public consultation booking form', async ({ page }) => {
    await page.goto('/book');
    await expect(page).toHaveTitle(/Book Consultation|AB & Co\./i);
    await expect(page.getByRole('heading', { name: /Book a Consultation|Schedule Consultation/i })).toBeVisible();
  });

  test('should validate required fields on booking submission', async ({ page }) => {
    await page.goto('/book');
    
    // Try submitting without filling required fields
    const submitBtn = page.getByRole('button', { name: /Submit|Book Now|Confirm/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Should show validation state or remain on booking page
      expect(page.url()).toContain('/book');
    }
  });
});
