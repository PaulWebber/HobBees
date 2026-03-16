# Testing Guide - HobBees

Comprehensive testing strategy for the HobBees application with both backend (pytest) and frontend (Playwright) tests.

## Test Suite Overview

### Backend Tests (pytest)
- **Location**: `backend/tests/`
- **Coverage**: Unit and integration tests for API endpoints, services, and repositories
- **Framework**: pytest with async support

### E2E Tests (Playwright)
- **Location**: `frontend/e2e/`
- **Coverage**: End-to-end user workflows across the full stack
- **Framework**: Playwright with TypeScript

## Quick Start

### Backend Tests

1. **Run all backend tests:**
   ```bash
   cd backend
   pytest
   ```

2. **Run with coverage:**
   ```bash
   pytest --cov=app --cov-report=html
   
   # View coverage report
   open htmlcov/index.html  # macOS
   start htmlcov/index.html  # Windows
   ```

3. **Run specific test file:**
   ```bash
   pytest tests/test_auth.py
   pytest tests/test_hobbies.py
   ```

4. **Run specific test:**
   ```bash
   pytest tests/test_auth.py::test_user_registration
   ```

5. **Verbose output:**
   ```bash
   pytest -v
   pytest -vv  # Extra verbose
   ```

### E2E Tests (Playwright)

1. **Install Playwright browsers** (first time):
   ```bash
   cd frontend
   npx playwright install
   ```

2. **Run all E2E tests:**
   ```bash
   npm run test:e2e
   ```

3. **Interactive UI mode:**
   ```bash
   npm run test:e2e:ui
   ```

4. **See browser (headed mode):**
   ```bash
   npm run test:e2e:headed
   ```

5. **Run specific test file:**
   ```bash
   npx playwright test e2e/auth.spec.ts
   ```

## Complete Test Run

To run all tests (backend + frontend):

```bash
# Terminal 1: Start services
docker-compose up

# Terminal 2: Run backend tests
cd backend
pytest --cov=app

# Terminal 3: Run E2E tests
cd frontend
npm run test:e2e
```

## Test Coverage

### Backend Tests (`backend/tests/`)

**test_auth.py** - Authentication & User Management
- ✅ User registration
- ✅ Duplicate username/email prevention
- ✅ User authentication (login)
- ✅ Wrong password handling
- ✅ Nonexistent user handling
- ✅ JWT token creation
- ✅ Password validation (length, byte limit)

**test_hobbies.py** - Hobby, Category & Item Management
- ✅ Create hobby
- ✅ Get hobby by ID
- ✅ Unauthorized hobby access
- ✅ List all user hobbies
- ✅ Update hobby
- ✅ Delete hobby
- ✅ Add category to hobby
- ✅ Duplicate category name prevention
- ✅ Update category
- ✅ Delete category
- ✅ Add item to category
- ✅ Required field validation
- ✅ Update item
- ✅ Delete item

### E2E Tests (`frontend/e2e/`)

**auth.spec.ts** - Authentication Flows
- ✅ Register new user
- ✅ Login with credentials
- ✅ Invalid credentials error
- ✅ Password length validation
- ✅ Duplicate registration prevention
- ✅ User logout

**hobbies.spec.ts** - Hobby Management Flows
- ✅ Create new hobby
- ✅ View hobby details
- ✅ Edit hobby
- ✅ Delete hobby
- ✅ Create multiple hobbies
- ✅ Add category to hobby
- ✅ Add item to category
- ✅ Required field validation

**user-journey.spec.ts** - Complete Workflows
- ✅ Full user journey (register → create → manage → delete)
- ✅ Edit mode with unsaved changes
- ✅ Multi-user data isolation

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Start services
        run: docker-compose up -d
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: |
          cd frontend
          npm run test:e2e
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Testing Best Practices

### Backend Testing
1. Use fixtures for common setup (user, hobby, database)
2. Test both success and failure cases
3. Validate error messages and status codes
4. Use async/await consistently
5. Clean up test data after each test

### E2E Testing
1. Use unique identifiers (timestamps) to avoid conflicts
2. Set up data via API when possible (faster than UI)
3. Test critical user paths, not every edge case
4. Use semantic selectors (role, text) over CSS classes
5. Ensure test independence

### General Guidelines
- **Fast feedback**: Run unit tests first (fastest), E2E last
- **Focused tests**: One assertion per test when possible
- **Clear naming**: Test names should describe what they verify
- **Maintainable**: Keep tests DRY with fixtures and helpers
- **Deterministic**: Tests should always pass/fail consistently

## Debugging

### Backend Tests
```bash
# Print output
pytest -s

# Drop into debugger on failure
pytest --pdb

# Run only failed tests from last run
pytest --lf

# Show local variables on failure
pytest -l
```

### E2E Tests
```bash
# Interactive UI mode
npm run test:e2e:ui

# Debug mode with DevTools
npx playwright test --debug

# Generate test code from browser actions
npx playwright codegen http://localhost:5173
```

## Test Metrics

Track these metrics to ensure quality:

- **Code Coverage**: Aim for >80% backend coverage
- **Test Speed**: Backend tests <10s, E2E <5min
- **Flakiness**: <1% flaky test rate
- **Maintenance**: Update tests with feature changes

## Next Steps

1. **Add more E2E scenarios**:
   - Mobile responsive tests
   - Accessibility (a11y) tests
   - Performance benchmarks

2. **Improve backend coverage**:
   - Edge cases in validation
   - Concurrent access scenarios
   - Database failure handling

3. **Visual regression**:
   - Add visual comparison tests
   - Screenshot diffs for UI changes

4. **Load testing**:
   - Use tools like Locust or k6
   - Test concurrent user scenarios
   - Database performance under load
