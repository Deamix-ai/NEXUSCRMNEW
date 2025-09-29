import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePerformanceMonitor, PerformanceUtils } from '@/hooks/use-performance-monitor'

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    PerformanceUtils.clear()
    
    // Mock performance.now
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(100) // Start time
      .mockReturnValueOnce(150) // End time (50ms render)
  })

  it('tracks render performance', () => {
    const onSlowRender = vi.fn()
    
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        threshold: 100,
        onSlowRender,
      })
    )

    expect(result.current.isSlowRender).toBe(false)
    expect(onSlowRender).not.toHaveBeenCalled()
  })

  it('detects slow renders', () => {
    const onSlowRender = vi.fn()
    
    // Mock a slow render (200ms)
    vi.mocked(performance.now)
      .mockReturnValueOnce(100) // Start
      .mockReturnValueOnce(300) // End (200ms render)

    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'SlowComponent',
        threshold: 100,
        onSlowRender,
      })
    )

    expect(result.current.isSlowRender).toBe(true)
    expect(onSlowRender).toHaveBeenCalledWith(
      expect.objectContaining({
        componentName: 'SlowComponent',
        renderTime: 200,
      })
    )
  })

  it('stores performance metrics', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'MetricsComponent',
      })
    )

    const metrics = result.current.getMetrics()
    expect(metrics).toHaveLength(1)
    expect(metrics[0]).toMatchObject({
      componentName: 'MetricsComponent',
      renderTime: 50,
    })
  })

  it('calculates average render time', () => {
    // First render
    renderHook(() =>
      usePerformanceMonitor({
        componentName: 'AverageComponent',
      })
    )

    // Second render with different time
    vi.mocked(performance.now)
      .mockReturnValueOnce(200) // Start
      .mockReturnValueOnce(300) // End (100ms render)

    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'AverageComponent',
      })
    )

    const averageTime = result.current.getAverageRenderTime()
    expect(averageTime).toBe(75) // (50 + 100) / 2
  })

  it('tracks memory usage when enabled', () => {
    // Mock performance.memory
    Object.defineProperty(performance, 'memory', {
      value: {
        usedJSHeapSize: 1024 * 1024, // 1MB
      },
      configurable: true,
    })

    renderHook(() =>
      usePerformanceMonitor({
        componentName: 'MemoryComponent',
        enableMemoryTracking: true,
      })
    )

    const summary = PerformanceUtils.getSummary()
    expect(summary).toHaveLength(1)
    expect(summary[0].componentName).toBe('MemoryComponent')
  })

  it('tracks props when enabled', () => {
    const testProps = { id: 1, name: 'test' }
    
    renderHook(() =>
      usePerformanceMonitor({
        componentName: 'PropsComponent',
        trackProps: true,
      })
    )

    const metrics = PerformanceUtils.export().metrics
    const componentMetrics = metrics.filter(m => m.componentName === 'PropsComponent')
    expect(componentMetrics).toHaveLength(1)
  })

  it('warns in development for slow renders', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    // Mock development environment
    vi.stubEnv('NODE_ENV', 'development')

    // Mock slow render
    vi.mocked(performance.now)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(250) // 150ms render

    renderHook(() =>
      usePerformanceMonitor({
        componentName: 'DevComponent',
        threshold: 100,
      })
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Slow render detected in DevComponent'),
      expect.any(Object)
    )

    consoleSpy.mockRestore()
  })
})

describe('PerformanceUtils', () => {
  beforeEach(() => {
    PerformanceUtils.clear()
  })

  it('provides performance summary', () => {
    // Create some mock metrics by rendering components
    renderHook(() =>
      usePerformanceMonitor({ componentName: 'Component1' })
    )
    renderHook(() =>
      usePerformanceMonitor({ componentName: 'Component2' })
    )

    const summary = PerformanceUtils.getSummary()
    expect(summary).toHaveLength(2)
    expect(summary[0]).toMatchObject({
      componentName: 'Component1',
      totalRenders: 1,
      averageRenderTime: expect.any(Number),
      slowestRender: expect.any(Number),
    })
  })

  it('exports performance data', () => {
    renderHook(() =>
      usePerformanceMonitor({ componentName: 'ExportComponent' })
    )

    const exported = PerformanceUtils.export()
    expect(exported).toMatchObject({
      metrics: expect.any(Array),
      summary: expect.any(Array),
      timestamp: expect.any(String),
    })
  })

  it('checks web vitals support', () => {
    // Mock PerformanceObserver
    const mockObserverConstructor = Object.assign(
      vi.fn().mockImplementation(() => ({})),
      { supportedEntryTypes: ['largest-contentful-paint'] }
    )
    global.PerformanceObserver = mockObserverConstructor as any
    
    expect(PerformanceUtils.supportsWebVitals()).toBe(true)
    
    delete (global as any).PerformanceObserver
    expect(PerformanceUtils.supportsWebVitals()).toBe(false)
  })

  it('monitors web vitals', () => {
    const mockObserver = {
      observe: vi.fn(),
    }
    const mockObserverConstructor = Object.assign(
      vi.fn().mockImplementation(() => mockObserver),
      { supportedEntryTypes: ['largest-contentful-paint'] }
    )
    global.PerformanceObserver = mockObserverConstructor as any
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    PerformanceUtils.monitorWebVitals()
    
    expect(global.PerformanceObserver).toHaveBeenCalledTimes(3) // LCP, FID, CLS
    expect(mockObserver.observe).toHaveBeenCalledTimes(3)
    
    consoleSpy.mockRestore()
  })

  it('clears performance data', () => {
    renderHook(() =>
      usePerformanceMonitor({ componentName: 'ClearComponent' })
    )

    expect(PerformanceUtils.getSummary()).toHaveLength(1)
    
    PerformanceUtils.clear()
    
    expect(PerformanceUtils.getSummary()).toHaveLength(0)
  })
})