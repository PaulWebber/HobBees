# E2E Tests - Playwright

End-to-end tests for HobBees using Playwright. Tests user flows across the full application stack.

## Test Coverage

### Authentication Tests (`auth.spec.ts`)
- User registration
- Login with valid credentials
- Login error handling
- Password validation
- Duplicate username/email prevention
- User logout

### Hobby Management Tests (`hobbies.spec.ts`)
- Create, view, edit, and delete hobbies
- Add categories with custom schemas
- Add items to categories
- Field validation

### Complete User Journey (`user-journey.spec.ts`)
- Full workflow from registration to hobby management
- Edit mode with unsaved changes
- Multi-user isolation

## Running Tests

### Prerequisites
1. Ensure Docker services are running:
   ```bash
   docker-compose up
   ```

2. Install Playwright browsers (first time only):
   ```bash
   cd frontend
   npx playwright install
   ```

### Run All Tests
```bash
cd frontend
npm run test:e2e
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Run Specific Test File
```bash
npx playwright test e2e/auth.spec.ts
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Tests
```bash
npx playwright test --debug
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Writing New Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act
    await page.click('button');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Common Patterns

**Login Helper:**
```typescript
async function loginUser(page, request) {
  const timestamp = Date.now();
  const username = `testuser_${timestamp}`;
  const password = 'TestPassword123!';
  
  await request.post('http://localhost:8000/api/auth/register', {
    data: { username, email: `test_${timestamp}@example.com`, password },
  });
  
  await page.goto('/');
  await page.fill('input[type="text"]', username);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  return { username, password };
}
```

**Creating Test Data via API:**
```typescript
const token = await page.evaluate(() => localStorage.getItem('token'));

await request.post('http://localhost:8000/api/hobbies', {
  headers: { Authorization: `Bearer ${token}` },
  data: { name: 'Test Hobby', description: 'Test' },
});
```

## Best Practices

1. **Use unique identifiers**: Add timestamps to usernames/emails to avoid conflicts
2. **Test isolation**: Each test should be independent
3. **Wait for elements**: Use `expect().toBeVisible()` instead of `waitForTimeout()`
4. **Clean selectors**: Prefer semantic selectors over CSS classes
5. **API setup**: Use API requests to set up test data when possible
6. **Error handling**: Test both happy paths and error scenarios

## Debugging Tips

1. **Visual debugging**: Use `npm run test:e2e:ui` to step through tests
2. **Screenshots**: Tests automatically capture screenshots on failure
3. **Traces**: View traces in the HTML report for failed tests
4. **Slow motion**: Add `{ slowMo: 1000 }` to see tests in slow motion
5. **Console logs**: Use `page.on('console', msg => console.log(msg.text()))`

## CI/CD Integration

For GitHub Actions or other CI systems:
```yaml
- name: Run Playwright tests
  run: |
    npm run test:e2e
  env:
    CI: true
```

The configuration automatically:
- Retries failed tests 2 times on CI
- Runs tests sequentially on CI
- Starts the dev server before running tests

## Troubleshooting

**Tests timing out:**
- Increase timeout in `playwright.config.ts`
- Ensure Docker services are running
- Check if dev server started successfully

**Element not found:**
- Verify selectors match your UI
- Use `page.pause()` to inspect the page
- Check if elements are hidden or outside viewport

**Authentication issues:**
- Ensure backend is accessible at `http://localhost:8000`
- Verify token storage in localStorage
- Check CORS settings

**Flaky tests:**
- Use proper waiting strategies (not `waitForTimeout`)
- Ensure test isolation
- Check for race conditions
