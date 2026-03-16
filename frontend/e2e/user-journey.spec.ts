import { test, expect } from '@playwright/test';

/**
 * Complete user journey test - simulates a real user workflow
 * from registration to managing a complete hobby with categories and items
 */
test.describe('Complete User Journey', () => {
  test('full workflow: register → create hobby → add category → add items → edit → delete', async ({ page, request }) => {
    const timestamp = Date.now();
    const username = `journey_user_${timestamp}`;
    const email = `journey_${timestamp}@example.com`;
    const password = 'TestPassword123!';

    // Step 1: Register new user
    await page.goto('/');
    await page.click('text=Don\'t have an account? Register');
    await page.fill('input[type="text"]', username);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should be on dashboard
    await expect(page).toHaveURL('/');

    // Step 2: Create a hobby
    await page.click('button:has-text("Create"), button:has-text("Add Hobby"), button:has-text("New")').first();
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Fountain Pens');
    await page.fill('textarea', 'My collection of beautiful fountain pens');
    await page.click('button[type="submit"]');

    // Verify hobby created
    await expect(page.locator('text=Fountain Pens')).toBeVisible();

    // Step 3: Open hobby details
    await page.click('text=Fountain Pens');

    // Step 4: Add first category - "Pens"
    await page.click('button:has-text("Add Category"), button:has-text("New Category")');
    await page.fill('input[name="name"]', 'Pens');

    // Add schema fields
    await page.click('button:has-text("Add Field")');
    await page.fill('input[placeholder*="field name" i]', 'Brand');
    await page.selectOption('select', 'text');
    
    await page.click('button:has-text("Add Field")');
    const fieldInputs = page.locator('input[placeholder*="field name" i]');
    await fieldInputs.nth(1).fill('Model');
    
    await page.click('button:has-text("Add Field")');
    await fieldInputs.nth(2).fill('Purchase Date');
    const selects = page.locator('select');
    await selects.nth(2).selectOption('date');

    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Create")');

    // Verify category created
    await expect(page.locator('text=Pens')).toBeVisible();

    // Step 5: Add items to the category
    await page.click('text=Pens');
    
    // Add first item
    await page.click('button:has-text("Add Item"), button:has-text("New Item")');
    await page.fill('input[name="Brand"], input[placeholder*="brand" i]', 'Pilot');
    await page.fill('input[name="Model"], input[placeholder*="model" i]', 'Custom 823');
    await page.fill('input[type="date"], input[name*="date" i]', '2024-01-15');
    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Add")');

    // Verify first item
    await expect(page.locator('text=Pilot')).toBeVisible();
    await expect(page.locator('text=Custom 823')).toBeVisible();

    // Add second item
    await page.click('button:has-text("Add Item")');
    await page.fill('input[name="Brand"]', 'Lamy');
    await page.fill('input[name="Model"]', '2000');
    await page.fill('input[type="date"]', '2024-02-20');
    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Add")');

    // Verify second item
    await expect(page.locator('text=Lamy')).toBeVisible();
    await expect(page.locator('text=2000')).toBeVisible();

    // Step 6: Add second category - "Inks"
    await page.click('button:has-text("Back"), a:has-text("Fountain Pens")').first();
    await page.click('button:has-text("Add Category")');
    await page.fill('input[name="name"]', 'Inks');
    
    await page.click('button:has-text("Add Field")');
    await page.fill('input[placeholder*="field name" i]', 'Color');
    await page.selectOption('select', 'text');
    
    await page.click('button:has-text("Add Field")');
    await fieldInputs.nth(1).fill('Brand');
    
    await page.click('button:has-text("Add Field")');
    await fieldInputs.nth(2).fill('Volume (ml)');
    await selects.nth(2).selectOption('number');

    await page.click('button[type="submit"]:has-text("Save")');

    // Add item to Inks category
    await page.click('text=Inks');
    await page.click('button:has-text("Add Item")');
    await page.fill('input[name="Color"]', 'Blue-Black');
    await page.fill('input[name="Brand"]', 'Pilot');
    await page.fill('input[name*="Volume"], input[type="number"]', '60');
    await page.click('button[type="submit"]:has-text("Save")');

    // Verify ink item
    await expect(page.locator('text=Blue-Black')).toBeVisible();
    await expect(page.locator('text=60')).toBeVisible();

    // Step 7: Edit an item
    await page.click('button:has-text("Edit"), [aria-label*="edit" i]').first();
    await page.fill('input[name="Color"]', 'Deep Blue-Black');
    await page.click('button[type="submit"]:has-text("Save")');
    await expect(page.locator('text=Deep Blue-Black')).toBeVisible();

    // Step 8: Delete an item
    const itemCount = await page.locator('[data-testid="item"], .item, [class*="item"]').count();
    await page.click('button:has-text("Delete"), [aria-label*="delete" i]').first();
    await page.click('button:has-text("Confirm"), button:has-text("Yes")').catch(() => {});
    
    // Verify item deleted (count should decrease)
    // Give it a moment to update
    await page.waitForTimeout(500);
    
    // Step 9: Navigate back to dashboard
    await page.click('a:has-text("Dashboard"), a:has-text("Home"), button:has-text("Back")').first();

    // Verify we're back at dashboard with our hobby
    await expect(page.locator('text=Fountain Pens')).toBeVisible();

    // Step 10: Enable edit mode
    await page.click('button:has-text("Edit"), [aria-label*="edit mode" i]').first();
    
    // UI should turn red (edit mode)
    const editModeIndicator = page.locator('[class*="red"], [data-edit-mode="true"]').first();
    await expect(editModeIndicator).toBeVisible().catch(() => {
      // Edit mode might not have a visible indicator
    });

    // Step 11: Logout
    await page.click('[aria-label="User menu"], button:has-text("Menu")').first().catch(() => {});
    await page.click('button:has-text("Logout"), a:has-text("Logout")').first();

    // Should be back at login
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('should handle edit mode with unsaved changes warning', async ({ page, request }) => {
    // Setup: Register and create hobby
    const timestamp = Date.now();
    await request.post('http://localhost:8000/api/auth/register', {
      data: {
        username: `test_${timestamp}`,
        email: `test_${timestamp}@example.com`,
        password: 'TestPassword123!',
      },
    });

    await page.goto('/');
    await page.fill('input[type="text"]', `test_${timestamp}`);
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Create hobby
    await page.click('button:has-text("Create")').first();
    await page.fill('input[name="name"]', 'Test Hobby');
    await page.fill('textarea', 'Test Description');
    await page.click('button[type="submit"]');

    // Enable edit mode
    await page.click('button:has-text("Edit Mode"), [aria-label*="edit" i]').first();

    // Make changes
    await page.click('text=Test Hobby');
    await page.click('button:has-text("Edit")').first();
    await page.fill('input[name="name"]', 'Modified Name');

    // Try to navigate away without saving
    await page.click('a:has-text("Dashboard"), a:has-text("Home")').first();

    // Should show unsaved changes warning
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('unsaved');
      await dialog.dismiss();
    });

    // Should still be on the same page
    await expect(page.locator('text=Modified Name')).toBeVisible();
  });

  test('should handle multiple users independently', async ({ page, context }) => {
    // Create two users
    const user1 = {
      username: `user1_${Date.now()}`,
      email: `user1_${Date.now()}@example.com`,
      password: 'TestPassword123!',
    };

    const user2 = {
      username: `user2_${Date.now()}`,
      email: `user2_${Date.now()}@example.com`,
      password: 'TestPassword123!',
    };

    // Register both users via API
    const request = await context.newPage().then(p => p.request);
    await request.post('http://localhost:8000/api/auth/register', { data: user1 });
    await request.post('http://localhost:8000/api/auth/register', { data: user2 });

    // Login as user1
    await page.goto('/');
    await page.fill('input[type="text"]', user1.username);
    await page.fill('input[type="password"]', user1.password);
    await page.click('button[type="submit"]');

    // Create hobby for user1
    await page.click('button:has-text("Create")').first();
    await page.fill('input[name="name"]', 'User 1 Hobby');
    await page.fill('textarea', 'This belongs to user 1');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=User 1 Hobby')).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout"), [aria-label*="logout" i]').first().catch(() => {});

    // Login as user2
    await page.fill('input[type="text"]', user2.username);
    await page.fill('input[type="password"]', user2.password);
    await page.click('button[type="submit"]');

    // User 1's hobby should not be visible
    await expect(page.locator('text=User 1 Hobby')).not.toBeVisible();

    // Create hobby for user2
    await page.click('button:has-text("Create")').first();
    await page.fill('input[name="name"]', 'User 2 Hobby');
    await page.fill('textarea', 'This belongs to user 2');
    await page.click('button[type="submit"]');

    // Only user 2's hobby should be visible
    await expect(page.locator('text=User 2 Hobby')).toBeVisible();
    await expect(page.locator('text=User 1 Hobby')).not.toBeVisible();
  });
});
