import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

// Mock API responses
export const createMockApiResponse = <T,>(data: T, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
  headers: new Headers({ 'content-type': 'application/json' }),
})

// Mock fetch helper
export const mockFetch = (response: any, status = 200) => {
  const mockResponse = createMockApiResponse(response, status)
  vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as any)
}

// Mock fetch with error
export const mockFetchError = (error: string) => {
  vi.mocked(global.fetch).mockRejectedValueOnce(new Error(error))
}

// Test wrapper with providers
interface TestProvidersProps {
  children: React.ReactNode
}

const TestProviders: React.FC<TestProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: TestProviders, ...options })
}

// Mock component helpers
export const createMockComponent = (name: string) => {
  const MockComponent = (props: any) => React.createElement('div', {
    'data-testid': `mock-${name.toLowerCase()}`,
    'data-props': JSON.stringify(props),
  }, `Mock ${name}`)
  MockComponent.displayName = `Mock${name}`
  return MockComponent
}

// Test data factories
export const createMockLead = (overrides = {}) => ({
  id: '1',
  title: 'Test Lead',
  status: 'NEW',
  source: 'Website',
  estimatedValue: 5000,
  priority: 'MEDIUM',
  clientName: 'Test Client',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createMockClient = (overrides = {}) => ({
  id: '1',
  name: 'Test Client',
  email: 'test@example.com',
  phone: '+44 20 1234 5678',
  address: '123 Test Street, London, SW1A 1AA',
  type: 'INDIVIDUAL',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createMockProject = (overrides = {}) => ({
  id: '1',
  name: 'Test Project',
  description: 'A test project',
  status: 'PLANNING',
  clientId: '1',
  budget: 10000,
  startDate: new Date().toISOString(),
  estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

// Event helpers
export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  currentTarget: { value: '' },
  ...overrides,
})

// Form helpers
export const fillForm = async (getByLabelText: any, fields: Record<string, string>) => {
  const { userEvent } = await import('@testing-library/user-event')
  const user = userEvent.setup()

  for (const [label, value] of Object.entries(fields)) {
    const input = getByLabelText(label)
    await user.clear(input)
    await user.type(input, value)
  }
}

// Async helpers
export const waitForLoadingToFinish = async () => {
  const { waitForElementToBeRemoved, screen } = await import('@testing-library/react')
  const loadingElement = screen.queryByText(/loading/i)
  if (loadingElement) {
    await waitForElementToBeRemoved(loadingElement)
  }
}

// Error boundary test helper
export const TestErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return React.createElement('div', { 'data-testid': 'error-boundary' }, 'Something went wrong')
  }

  return React.createElement(React.Fragment, null, children)
}

// Performance test helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now()
  renderFn()
  const end = performance.now()
  return end - start
}

// Accessibility test helpers
export const testKeyboardNavigation = async (getByRole: any, items: string[]) => {
  const { userEvent } = await import('@testing-library/user-event')
  const user = userEvent.setup()

  for (let i = 0; i < items.length; i++) {
    const item = getByRole('button', { name: items[i] })
    await user.tab()
    expect(item).toHaveFocus()
  }
}

// Screen reader test helpers
export const checkAriaLabels = (getByRole: any, elements: Array<{ role: string; name: string }>) => {
  elements.forEach(({ role, name }) => {
    const element = getByRole(role, { name })
    expect(element).toBeInTheDocument()
    expect(element).toHaveAccessibleName(name)
  })
}

// URL/Route testing helpers
export const createMockRouter = (overrides = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: vi.fn(),
    off: vi.fn(),
  },
  ...overrides,
})

// Local storage mock helpers
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key]
    }),
    clear: vi.fn(() => {
      for (const key in storage) {
        delete storage[key]
      }
    }),
    length: Object.keys(storage).length,
    key: vi.fn((index: number) => Object.keys(storage)[index] || null),
  }
}

// Animation/timeout helpers
export const skipAnimations = () => {
  const originalRequestAnimationFrame = global.requestAnimationFrame
  const originalCancelAnimationFrame = global.cancelAnimationFrame

  global.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 0) as unknown as number
  }

  global.cancelAnimationFrame = (id: number) => {
    clearTimeout(id as any)
  }

  return () => {
    global.requestAnimationFrame = originalRequestAnimationFrame
    global.cancelAnimationFrame = originalCancelAnimationFrame
  }
}

// Export common testing library utilities
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'