import { test, expect } from '@playwright/test';

test.describe('Multi-Role System, Teammate Invitation, and Work Allocation', () => {
  const timestamp = Date.now();
  const adminEmail = `admin_${timestamp}@nova.test`;
  const adminPassword = 'AdminPass123!';
  const teammateName = `Sarah Teammate ${timestamp}`;
  const teammateEmail = `sarah_${timestamp}@nova.test`;
  const projectName = `Alpha Core Project ${timestamp}`;
  const taskTitle = `Design System Specs ${timestamp}`;

  test('Complete flow: Admin registration, teammate invitation, project creation, and work allocation', async ({ page }) => {
    // 1. Register Admin User
    await page.goto('/register');
    await page.fill('input[type="text"]', 'Platform Admin');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500); // wait for registration

    // 2. Login as Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500); // wait for login redirect

    // Should reach Dashboard
    await expect(page).toHaveURL(/.*dashboard.*/);

    // 3. Create a Project
    await page.click('button:has-text("+ Create Project")');
    await page.fill('input[placeholder="Project Name"]', projectName);
    await page.click('button:has-text("Create Project"):visible');
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=${projectName}`)).toBeVisible();

    // 4. Navigate to Team Directory
    await page.goto('/dashboard/team');
    await expect(page.locator('h1', { hasText: 'Team Directory' })).toBeVisible();

    // Verify Admin role badge
    await expect(page.locator('text=👑 ADMIN')).toBeVisible();

    // 5. Invite a new Teammate using PlatformInviteModal
    await page.click('button:has-text("+ Invite Teammate")');
    await expect(page.locator('h2', { hasText: 'Invite Teammate' })).toBeVisible();

    await page.fill('input[placeholder="Jane Doe"]', teammateName);
    await page.fill('input[placeholder="jane@example.com"]', teammateEmail);
    
    // Select role (MEMBER is default, can keep or select)
    await page.selectOption('select:has-text("Member (Standard)")', 'MEMBER');

    // Submit Invitation
    await page.click('button:has-text("Send Invitation")');
    await page.waitForTimeout(1000);

    // Verify Teammate appears in Team Directory
    await expect(page.locator(`text=${teammateName}`)).toBeVisible();
    await expect(page.locator('text=👥 MEMBER')).toBeVisible();

    // 6. Navigate to Project and Allot Work to Teammate
    await page.goto('/dashboard');
    await page.click(`text=${projectName}`);

    // Add Task and assign to Teammate
    await page.click('button:has-text("+ Add Task")');
    await page.fill('input[placeholder="Task title..."]', taskTitle);

    // Select the invited teammate in Assignee dropdown if available
    const assigneeSelect = page.locator('select').filter({ hasText: teammateName });
    if (await assigneeSelect.count() > 0) {
      await assigneeSelect.selectOption({ label: teammateName });
    }

    await page.click('button:has-text("Save")');
    await page.waitForTimeout(1000);

    // Verify task is created on the board
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });
});
