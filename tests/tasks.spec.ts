import { test, expect } from '@playwright/test';

test.describe('Tasks Flow', () => {
  const uniqueEmail = `task_user_${Date.now()}@example.com`;
  const password = 'Password123!';
  const projectName = `Task Project ${Date.now()}`;
  const taskName = `Do Laundry ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await page.fill('input[type="text"]', 'Task Tester');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.goto('/login');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    // Create Project
    await page.click('button:has-text("+ Create Project")');
    await page.fill('input[placeholder="Project Name"]', projectName);
    await page.click('button:has-text("Create Project"):visible');
    await page.waitForTimeout(1000); // Wait for modal to close and dashboard to update
    
    // Navigate to Project
    await page.click(`text=${projectName}`);
  });

  test('User can create, move, and delete a task', async ({ page }) => {
    // Add Task
    await page.click('button:has-text("+ Add Task")');
    await page.fill('input[placeholder="Task title..."]', taskName);
    await page.click('button:has-text("Save")');

    // Should appear in To Do
    const taskCard = page.locator('div', { hasText: taskName }).nth(0);
    await expect(taskCard).toBeVisible();

    // Move to In Progress
    await page.click(`div:has-text("${taskName}") >> button:has-text("Move to In Progress")`);
    
    // Check if it moved (wait for the In Progress column to have it)
    await expect(page.locator('h3:has-text("In Progress") + div').locator(`text=${taskName}`)).toBeVisible();

    // Move to Done
    await page.click(`div:has-text("${taskName}") >> button:has-text("Move to Done")`);
    
    // Check if it moved
    await expect(page.locator('h3:has-text("Done") + div').locator(`text=${taskName}`)).toBeVisible();

    // Delete Task
    page.on('dialog', dialog => dialog.accept());
    await page.click(`div:has-text("${taskName}") >> button:has-text("×")`);
    
    // Task should be gone
    await expect(page.locator(`text=${taskName}`)).not.toBeVisible();
  });
});
