import { test, expect } from '@playwright/test';

// Helper to register and login a test user
async function loginUser(page, request) {
  const timestamp = Date.now();
  const username = `testuser_${timestamp}`;
  const password = 'TestPassword123!';
  const email = `test_${timestamp}@example.com`;

  // Register user
  await request.post('http://localhost:8000/api/auth/register', {
    data: { username, email, password },
  });

  // Login
  await page.goto('/');
  await page.fill('input[type="text"]', username);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');

  return { username, password, email };
}

test.describe('Hobby Management', () => {
  test('should create a new hobby', async ({ page, request }) => {
    await loginUser(page, request);

    // Look for "Create Hobby" or "Add Hobby" button
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add Hobby"), button:has-text("New Hobby")').first();
    await createButton.click();

    // Fill hobby form
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Fountain Pens');
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'My collection of fountain pens');

    // Submit
    await page.click('button[type="submit"]');

    // Verify hobby appears in list
    await expect(page.locator('text=Fountain Pens')).toBeVisible();
  });

  test('should view hobby details', async ({ page, request }) => {
    await loginUser(page, request);

    // Create a hobby via API
    const loginResponse = await request.post('http://localhost:8000/api/auth/login', {
      data: {
        username: await page.inputValue('input[type="text"]'),
        password: 'TestPassword123!',
      },
    });
    const { access_token } = await loginResponse.json();

    await request.post('http://localhost:8000/api/hobbies', {
      headers: { Authorization: `Bearer ${access_token}` },
      data: {
        name: 'Test Hobby',
        description: 'Test Description',
      },
    });

    // Refresh page to see hobby
    await page.reload();

    // Click on hobby
    await page.click('text=Test Hobby');

    // Should show hobby details
    await expect(page.locator('text=Test Description')).toBeVisible();
  });

  test('should edit hobby name and description', async ({ page, request }) => {
    await loginUser(page, request);

    // Create hobby via API first
    const token = await page.evaluate(() => localStorage.getItem('token'));

    await request.post('http://localhost:8000/api/hobbies', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Original Name',
        description: 'Original Description',
      },
    });

    await page.reload();

    // Find and click edit button
    await page.locator('text=Original Name').click();
    await page.click('button:has-text("Edit"), [aria-label*="edit" i]');

    // Update fields
    await page.fill('input[name="name"], input[value="Original Name"]', 'Updated Name');
    await page.fill('textarea[name="description"]', 'Updated Description');

    // Save
    await page.click('button[type="submit"], button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=Updated Name')).toBeVisible();
    await expect(page.locator('text=Updated Description')).toBeVisible();
  });

  test('should delete a hobby', async ({ page, request }) => {
    await loginUser(page, request);

    // Create hobby
    const token = await page.evaluate(() => localStorage.getItem('token'));

    await request.post('http://localhost:8000/api/hobbies', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Hobby to Delete',
        description: 'This will be deleted',
      },
    });

    await page.reload();

    // Click on hobby
    await page.click('text=Hobby to Delete');

    // Click delete button
    await page.click('button:has-text("Delete"), [aria-label*="delete" i]');

    // Confirm deletion if there's a confirmation dialog
    await page.click('button:has-text("Confirm"), button:has-text("Yes")').catch(() => {});

    // Verify hobby is gone
    await expect(page.locator('text=Hobby to Delete')).not.toBeVisible();
  });

  test('should create multiple hobbies', async ({ page, request }) => {
    await loginUser(page, request);

    const hobbies = ['Reading', 'Gardening', 'Photography'];

    for (const hobby of hobbies) {
      await page.click('button:has-text("Create"), button:has-text("Add")').first();
      await page.fill('input[name="name"]', hobby);
      await page.fill('textarea[name="description"]', `My ${hobby.toLowerCase()} hobby`);
      await page.click('button[type="submit"]');

      // Wait for hobby to appear
      await expect(page.locator(`text=${hobby}`)).toBeVisible();
    }

    // Verify all hobbies are visible
    for (const hobby of hobbies) {
      await expect(page.locator(`text=${hobby}`)).toBeVisible();
    }
  });
});

test.describe('Category Management', () => {
  test('should add category to hobby', async ({ page, request }) => {
    await loginUser(page, request);

    // Create hobby
    const token = await page.evaluate(() => localStorage.getItem('token'));

    await request.post('http://localhost:8000/api/hobbies', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Fountain Pens',
        description: 'Pen collection',
      },
    });

    await page.reload();

    // Open hobby
    await page.click('text=Fountain Pens');

    // Add category
    await page.click('button:has-text("Add Category"), button:has-text("New Category")');

    // Fill category form
    await page.fill('input[name="name"], input[placeholder*="category" i]', 'Nib Collection');

    // Add field to schema
    await page.click('button:has-text("Add Field")');
    await page.fill('input[placeholder*="field name" i]', 'Brand');
    await page.selectOption('select[name*="type"], select:near(input[placeholder*="field name" i])', 'text');

    // Save category
    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Create Category")');

    // Verify category appears
    await expect(page.locator('text=Nib Collection')).toBeVisible();
  });

  test('should add item to category', async ({ page, request }) => {
    await loginUser(page, request);

    // Create hobby with category via API
    const token = await page.evaluate(() => localStorage.getItem('token'));

    const hobbyResponse = await request.post('http://localhost:8000/api/hobbies', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Fountain Pens',
        description: 'Pen collection',
      },
    });
    const hobby = await hobbyResponse.json();

    await request.post(`http://localhost:8000/api/hobbies/${hobby.id}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Nibs',
        schema: [
          { name: 'brand', type: 'text', required: true },
          { name: 'size', type: 'text', required: false },
        ],
      },
    });

    await page.reload();

    // Open hobby and category
    await page.click('text=Fountain Pens');
    await page.click('text=Nibs');

    // Add item
    await page.click('button:has-text("Add Item"), button:has-text("New Item")');

    // Fill item form
    await page.fill('input[name="brand"]', 'Pilot');
    await page.fill('input[name="size"]', 'Fine');

    // Save item
    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Add")');

    // Verify item appears
    await expect(page.locator('text=Pilot')).toBeVisible();
    await expect(page.locator('text=Fine')).toBeVisible();
  });

  test('should validate required fields when adding item', async ({ page, request }) => {
    await loginUser(page, request);

    // Create hobby with category that has required field
    const token = await page.evaluate(() => localStorage.getItem('token'));

    const hobbyResponse = await request.post('http://localhost:8000/api/hobbies', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Hobby',
        description: 'Test',
      },
    });
    const hobby = await hobbyResponse.json();

    await request.post(`http://localhost:8000/api/hobbies/${hobby.id}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Category',
        schema: [
          { name: 'required_field', type: 'text', required: true },
        ],
      },
    });

    await page.reload();
    await page.click('text=Test Hobby');
    await page.click('text=Test Category');

    // Try to add item without required field
    await page.click('button:has-text("Add Item")');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=/required/i')).toBeVisible();
  });
});
