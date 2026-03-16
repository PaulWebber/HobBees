import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register a new user', async ({ page }) => {
    // Click register link
    await page.click('text=Don\'t have an account? Register');

    // Fill registration form
    const timestamp = Date.now();
    await page.fill('input[type="text"]', `testuser_${timestamp}`);
    await page.fill('input[type="email"]', `test_${timestamp}@example.com`);
    await page.fill('input[type="password"]', 'TestPassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=HobBees')).toBeVisible();
  });

  test('should login with existing credentials', async ({ page, request }) => {
    // Register user via API first
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const password = 'TestPassword123!';

    await request.post('http://localhost:8000/api/auth/register', {
      data: {
        username,
        email: `test_${timestamp}@example.com`,
        password,
      },
    });

    // Navigate to login page
    await page.goto('/');

    // Fill login form
    await page.fill('input[type="text"]', username);
    await page.fill('input[type="password"]', password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=HobBees')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // Try to login with invalid credentials
    await page.fill('input[type="text"]', 'nonexistent_user');
    await page.fill('input[type="password"]', 'WrongPassword123!');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/incorrect.*username.*password/i')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    // Click register link
    await page.click('text=Don\'t have an account? Register');

    const timestamp = Date.now();
    await page.fill('input[type="text"]', `testuser_${timestamp}`);
    await page.fill('input[type="email"]', `test_${timestamp}@example.com`);
    await page.fill('input[type="password"]', 'short'); // Too short

    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=/password.*8/i')).toBeVisible();
  });

  test('should prevent registration with duplicate username', async ({ page, request }) => {
    // Register user via API
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;

    await request.post('http://localhost:8000/api/auth/register', {
      data: {
        username,
        email: `test_${timestamp}@example.com`,
        password: 'TestPassword123!',
      },
    });

    // Try to register with same username
    await page.click('text=Don\'t have an account? Register');
    await page.fill('input[type="text"]', username);
    await page.fill('input[type="email"]', `different_${timestamp}@example.com`);
    await page.fill('input[type="password"]', 'TestPassword123!');

    await page.click('button[type="submit"]');

    // Should show error
    await expect(page.locator('text=/already registered/i')).toBeVisible();
  });

  test('should logout user', async ({ page, request }) => {
    // Register and login via API
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const password = 'TestPassword123!';

    await request.post('http://localhost:8000/api/auth/register', {
      data: {
        username,
        email: `test_${timestamp}@example.com`,
        password,
      },
    });

    // Login
    await page.fill('input[type="text"]', username);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('/');

    // Logout (assuming there's a logout button/menu)
    // Adjust selector based on your UI
    await page.click('[aria-label="User menu"]', { timeout: 5000 }).catch(() => {
      // If no menu, try direct logout button
      return page.click('button:has-text("Logout")');
    });

    // Should redirect to login
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });
});
