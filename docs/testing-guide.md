# Testing Infrastructure Guide

This document provides comprehensive guidance on testing within the CRM-Nexus application using Vitest for unit/integration tests and Playwright for E2E testing.

## Overview

The testing infrastructure consists of:

1. **Unit & Integration Tests** - Vitest with React Testing Library
2. **End-to-End Tests** - Playwright with multi-browser support
3. **API Tests** - Jest for NestJS backend testing
4. **Performance Tests** - Custom performance monitoring and testing utilities

## Test Architecture

### Directory Structure

```
apps/web/
├── src/
│   ├── test/                          # Test utilities and setup
│   │   ├── setup.ts                   # Global test setup
│   │   └── test-utils.tsx             # Custom testing utilities
│   ├── components/
│   │   └── **/__tests__/              # Component unit tests
│   └── hooks/
│       └── **/__tests__/              # Hook unit tests
├── e2e/                               # End-to-end tests
│   ├── global-setup.ts               # E2E test setup
│   ├── global-teardown.ts            # E2E test cleanup
│   └── *.spec.ts                     # E2E test files
├── vitest.config.ts                  # Vitest configuration
└── playwright.config.ts              # Playwright configuration

apps/api/
├── src/
│   └── **/__tests__/                 # API unit tests
├── test/                             # API E2E tests
└── jest config files
```

## Unit & Integration Testing

### Configuration

**Vitest Configuration** (`apps/web/vitest.config.ts`):
- JSDOM environment for React components
- Path aliases matching the application structure
- Coverage reporting with v8 provider
- Global test setup and teardown

**Key Features**:
- Global mocks for Next.js components and hooks
- Custom matchers for common validations
- React Testing Library integration
- Mock API responses and error handling

### Writing Unit Tests

#### Component Testing

```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, createMockLead } from '@/test/test-utils'
import { OptimizedLeadsList } from '@/components/leads/optimized-leads-list'

describe('OptimizedLeadsList', () => {
  it('renders leads correctly', () => {
    const mockLeads = [createMockLead()]
    const { getByText } = renderWithProviders(
      <OptimizedLeadsList leads={mockLeads} onConvert={vi.fn()} />
    )
    
    expect(getByText('Test Lead')).toBeInTheDocument()
  })
})
```

#### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react'
import { useOptimizedFetch, mockFetch } from '@/test/test-utils'

describe('useOptimizedFetch', () => {
  it('fetches data successfully', async () => {
    mockFetch({ data: 'test' })
    
    const { result } = renderHook(() => useOptimizedFetch('/api/test'))
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    expect(result.current.data).toEqual({ data: 'test' })
  })
})
```

### Test Utilities

**Custom Providers** (`src/test/test-utils.tsx`):
- `renderWithProviders`: Renders components with necessary context providers
- `createMockApiResponse`: Creates mock API responses
- `mockFetch` / `mockFetchError`: Utilities for mocking fetch requests
- Mock data factories for common entities (leads, clients, projects)

**Custom Matchers**:
- `toBeValidEmail()`: Validates email format
- `toBeValidPhoneNumber()`: Validates UK phone number format

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests with coverage
npm run test:unit:coverage

# Run specific test file
npm run test:unit -- src/components/leads/__tests__/optimized-leads-list.test.tsx
```

## End-to-End Testing

### Playwright Configuration

**Multi-browser Support**:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge
- Google Chrome

**Features**:
- Automatic test servers startup
- Visual regression testing with screenshots
- Video recording on failure
- Trace collection for debugging
- Parallel test execution

### Writing E2E Tests

#### Basic Page Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test('should load and display key elements', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/CRM Nexus/)
    await expect(page.locator('main')).toBeVisible()
    
    // Visual regression testing
    await page.screenshot({ 
      path: 'test-results/dashboard.png',
      fullPage: true 
    })
  })
})
```

#### User Interaction Testing

```typescript
test('should create a new lead', async ({ page }) => {
  await page.goto('/leads')
  
  await page.click('button:has-text("Add Lead")')
  await page.fill('input[name="title"]', 'E2E Test Lead')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('.success-message')).toBeVisible()
})
```

#### Responsive Testing

```typescript
test('should handle mobile layout', async ({ page, isMobile }) => {
  await page.goto('/')
  
  if (isMobile) {
    await expect(page.locator('[aria-label="menu"]')).toBeVisible()
  } else {
    await expect(page.locator('nav')).toBeVisible()
  }
})
```

### Test Data Management

**Global Setup** (`e2e/global-setup.ts`):
- Waits for servers to be ready
- Creates test data via API calls
- Verifies application connectivity

**Global Teardown** (`e2e/global-teardown.ts`):
- Cleans up test data
- Removes temporary files

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed

# Run specific browser
npx playwright test --project=chromium

# Run specific test
npx playwright test dashboard.spec.ts
```

## API Testing

### NestJS Testing (Jest)

**Configuration**: Uses Jest with supertest for HTTP testing

**Example API Test**:

```typescript
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'

describe('LeadsController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/leads (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/leads')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('leads')
      })
  })
})
```

### Running API Tests

```bash
# Run API unit tests
npm run test:api

# Run API tests in watch mode
npm run test:api:watch

# Run API tests with coverage
npm run test:api:coverage

# Run API E2E tests
npm run test:api:e2e
```

## Performance Testing

### Performance Monitoring

The application includes built-in performance monitoring:

```typescript
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'

function MyComponent() {
  const { isSlowRender } = usePerformanceMonitor({
    componentName: 'MyComponent',
    threshold: 100, // ms
    onSlowRender: (metrics) => console.warn('Slow render', metrics)
  })

  return <div>{/* component content */}</div>
}
```

### Performance Testing Utilities

```typescript
import { measureRenderTime, skipAnimations } from '@/test/test-utils'

describe('Performance Tests', () => {
  it('should render within performance budget', async () => {
    const restoreAnimations = skipAnimations()
    
    const renderTime = await measureRenderTime(() => {
      render(<ExpensiveComponent />)
    })
    
    expect(renderTime).toBeLessThan(100) // 100ms budget
    restoreAnimations()
  })
})
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit:coverage
        
      - name: Run API tests
        run: npm run test:api:coverage
        
      - name: Install Playwright browsers
        run: npx playwright install
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
```

### Test Commands for CI

```bash
# Complete test suite for CI
npm run test:ci

# Individual test suites
npm run test:unit:coverage    # Unit tests with coverage
npm run test:api:coverage     # API tests with coverage
npm run test:e2e             # E2E tests
```

## Coverage Reporting

### Coverage Configuration

**Vitest Coverage**:
- Provider: v8 (fast, accurate)
- Formats: text, json, html
- Thresholds: 70% for branches, functions, lines, statements
- Exclusions: test files, config files, type definitions

**Viewing Coverage**:

```bash
# Generate and view HTML coverage report
npm run test:unit:coverage
open coverage/index.html

# Generate coverage for specific files
npm run test:unit:coverage -- src/components/leads/
```

## Best Practices

### Test Organization

1. **Group Related Tests**: Use `describe` blocks to group related functionality
2. **Clear Test Names**: Use descriptive test names that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion phases
4. **Test Data Factories**: Use factory functions for consistent test data creation

### Mock Strategy

1. **API Mocking**: Mock external API calls consistently
2. **Component Mocking**: Mock complex child components in unit tests
3. **Browser API Mocking**: Mock browser APIs (localStorage, fetch, etc.)
4. **Third-party Mocking**: Mock external libraries that aren't core to the test

### Performance Considerations

1. **Parallel Execution**: Run tests in parallel when possible
2. **Test Isolation**: Ensure tests don't depend on each other
3. **Resource Cleanup**: Clean up resources in test teardown
4. **Selective Testing**: Use patterns to run only relevant tests during development

### Debugging Tests

1. **Test Debugging**: Use `--inspect` flag for debugging
2. **Screenshot Debugging**: Capture screenshots on E2E test failures
3. **Console Debugging**: Use console.log strategically in tests
4. **Test Isolation**: Run single tests to isolate issues

```bash
# Debug specific test
npm run test:unit -- --inspect-brk src/components/leads/__tests__/optimized-leads-list.test.tsx

# Debug E2E test with headed browser
npx playwright test --headed --debug dashboard.spec.ts
```

## Accessibility Testing

### Automated A11y Testing

```typescript
import { checkAriaLabels, testKeyboardNavigation } from '@/test/test-utils'

describe('Accessibility', () => {
  it('should have proper ARIA labels', () => {
    const { getByRole } = render(<LeadsList />)
    
    checkAriaLabels(getByRole, [
      { role: 'button', name: 'Add new lead' },
      { role: 'table', name: 'Leads list' }
    ])
  })

  it('should support keyboard navigation', async () => {
    const { getByRole } = render(<Navigation />)
    
    await testKeyboardNavigation(getByRole, [
      'Dashboard',
      'Leads',
      'Clients',
      'Projects'
    ])
  })
})
```

### Visual Regression Testing

```typescript
test('should maintain visual consistency', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Wait for content to load
  await page.waitForLoadState('networkidle')
  
  // Compare against baseline
  await expect(page).toHaveScreenshot('dashboard.png')
})
```

## Troubleshooting

### Common Issues

1. **Flaky Tests**: Use proper wait conditions and avoid hard-coded timeouts
2. **Memory Leaks**: Clean up event listeners and timers in test teardown
3. **Mock Conflicts**: Clear mocks between tests using `vi.clearAllMocks()`
4. **Async Issues**: Use proper async/await patterns and act() for React updates

### Debug Commands

```bash
# Run tests with verbose output
npm run test:unit -- --reporter=verbose

# Run single test file
npm run test:unit -- optimized-leads-list.test.tsx

# Run E2E tests with debug info
DEBUG=pw:api npm run test:e2e

# Generate test report
npx playwright show-report
```

This testing infrastructure provides comprehensive coverage for the CRM-Nexus application, ensuring reliability, performance, and maintainability across all layers of the stack.