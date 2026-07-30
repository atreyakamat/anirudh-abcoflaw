# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portal.spec.ts >> Client Portal Journey E2E >> should render portal login page with OTP phone input
- Location: e2e\portal.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByPlaceholder(/\+91|phone|mobile/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByPlaceholder(/\+91|phone|mobile/i)

```

```yaml
- img
- heading "Welcome" [level=1]
- paragraph: Sign in to your account
- text: Email
- textbox "e.g. admin@lawpractice.local"
- text: Password
- textbox "Enter your password"
- button "Sign In"
- text: Or
- button "Sign in with Google":
  - img
  - text: Sign in with Google
- paragraph: Internal staff will be redirected to the admin dashboard. Clients will be directed to their customer portal.
- paragraph:
  - link "Back to website":
    - /url: /
- region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Client Portal Journey E2E', () => {
  4  |   test('should render portal login page with OTP phone input', async ({ page }) => {
  5  |     await page.goto('/portal/login');
  6  |     await expect(page).toHaveTitle(/AB & Co\. Legal|Client Portal/i);
> 7  |     await expect(page.getByPlaceholder(/\+91|phone|mobile/i)).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  8  |   });
  9  | });
  10 | 
```