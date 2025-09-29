import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOptimizedFetch, CacheUtils } from '@/hooks/use-optimized-fetch'
import { mockFetch, mockFetchError } from '@/test/test-utils'

describe('useOptimizedFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    CacheUtils.clear()
  })

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test Data' }
    mockFetch(mockData)

    const { result } = renderHook(() =>
      useOptimizedFetch('/api/test')
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
  })

  it('handles fetch errors', async () => {
    mockFetchError('Network error')

    const { result } = renderHook(() =>
      useOptimizedFetch('/api/test')
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Network error')
  })

  it('caches responses correctly', async () => {
    const mockData = { id: 1, name: 'Cached Data' }
    mockFetch(mockData)

    // First request
    const { result: result1 } = renderHook(() =>
      useOptimizedFetch('/api/cached', { cacheKey: 'test-cache' })
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result1.current.data).toEqual(mockData)
    expect(result1.current.isFromCache).toBe(false)

    // Second request should use cache
    const { result: result2 } = renderHook(() =>
      useOptimizedFetch('/api/cached', { cacheKey: 'test-cache' })
    )

    expect(result2.current.data).toEqual(mockData)
    expect(result2.current.isFromCache).toBe(true)
    expect(result2.current.loading).toBe(false)
  })

  it('retries failed requests', async () => {
    // First two calls fail, third succeeds
    mockFetchError('Network error')
    mockFetchError('Network error')
    mockFetch({ success: true })

    const { result } = renderHook(() =>
      useOptimizedFetch('/api/retry', {
        retryAttempts: 3,
        retryDelay: 10, // Short delay for testing
      })
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
    })

    expect(result.current.data).toEqual({ success: true })
    expect(result.current.error).toBe(null)
    expect(global.fetch).toHaveBeenCalledTimes(3)
  })

  it('debounces requests', async () => {
    const mockData = { id: 1, name: 'Debounced' }
    mockFetch(mockData)

    const { result, rerender } = renderHook(
      ({ url }) => useOptimizedFetch(url, { debounceMs: 50 }),
      { initialProps: { url: '/api/test1' } }
    )

    // Change URL quickly
    rerender({ url: '/api/test2' })
    rerender({ url: '/api/test3' })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Should only have made one request (to the final URL)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/test3', expect.any(Object))
  })

  it('handles timeout correctly', async () => {
    // Mock a slow response that never resolves
    vi.mocked(global.fetch).mockImplementationOnce(
      () => new Promise<Response>(() => {}) // Never resolves
    )

    const { result } = renderHook(() =>
      useOptimizedFetch('/api/slow', { timeout: 50 })
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.error?.message).toBe('Request timeout')
  })

  it('calls success callback on successful fetch', async () => {
    const mockData = { success: true }
    const onSuccess = vi.fn()
    mockFetch(mockData)

    renderHook(() =>
      useOptimizedFetch('/api/success', { onSuccess })
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  it('calls error callback on failed fetch', async () => {
    const onError = vi.fn()
    mockFetchError('Test error')

    renderHook(() =>
      useOptimizedFetch('/api/error', { onError })
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
  })

  it('refetch clears cache and makes new request', async () => {
    const initialData = { version: 1 }
    const updatedData = { version: 2 }
    
    mockFetch(initialData)

    const { result } = renderHook(() =>
      useOptimizedFetch('/api/refetch', { cacheKey: 'refetch-test' })
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.data).toEqual(initialData)

    // Mock new response for refetch
    mockFetch(updatedData)

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data).toEqual(updatedData)
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('aborts request when component unmounts', async () => {
    const abortSpy = vi.fn()
    const mockAbortController = {
      signal: { aborted: false },
      abort: abortSpy,
    }

    vi.spyOn(global, 'AbortController').mockImplementation(() => mockAbortController as any)

    const { unmount } = renderHook(() =>
      useOptimizedFetch('/api/abort')
    )

    unmount()

    expect(abortSpy).toHaveBeenCalled()
  })
})