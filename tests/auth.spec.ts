import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  test('User can register and login successfully', async ({ page }) => {
    // Registration
    await page.goto('/register');
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to login or dashboard, we can just manually go to login
    await page.goto('/login');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1', { hasText: 'Project Overview' })).toBeVisible();
  });

  test('Unauthenticated user cannot access dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login.*/); // Should redirect to login
  });
});
