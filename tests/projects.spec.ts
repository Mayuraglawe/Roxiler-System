import { test, expect } from '@playwright/test';

test.describe('Projects Flow', () => {
  const uniqueEmail = `project_user_${Date.now()}@example.com`;
  const password = 'Password123!';
  const projectName = `Test Project ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    await page.goto('/register');
    await page.fill('input[type="text"]', 'Project Tester');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.goto('/login');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('User can create and delete a project', async ({ page }) => {
    // Create Project
    await page.click('button:has-text("+ Create Project")');
    await page.fill('input[placeholder="Project Name"]', projectName);
    await page.click('button:has-text("Create Project"):visible');

    // Wait for the project to appear in the dashboard
    await expect(page.locator(`text=${projectName}`)).toBeVisible();

    // Navigate to Project Details
    await page.click(`text=${projectName}`);
    await expect(page.locator('h1', { hasText: projectName })).toBeVisible();

    // Delete Project
    page.on('dialog', dialog => dialog.accept()); // Accept the confirmation dialog
    await page.click('button:has-text("Delete Project")');
    
    // Should be back on dashboard
    await expect(page).toHaveURL('/dashboard');
    // Project should no longer be visible
    await expect(page.locator(`text=${projectName}`)).not.toBeVisible();
  });
});
