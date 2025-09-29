'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  memoryUsage?: number;
  props?: Record<string, any>;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  trackProps?: boolean;
  enableMemoryTracking?: boolean;
  threshold?: number; // ms - warn if render time exceeds this
  onSlowRender?: (metrics: PerformanceMetrics) => void;
}

// Global performance store
class PerformanceStore {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 measurements

  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getMetrics(componentName?: string): PerformanceMetrics[] {
    if (componentName) {
      return this.metrics.filter(m => m.componentName === componentName);
    }
    return [...this.metrics];
  }

  getAverageRenderTime(componentName: string): number {
    const componentMetrics = this.getMetrics(componentName);
    if (componentMetrics.length === 0) return 0;
    
    const totalTime = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    return totalTime / componentMetrics.length;
  }

  getSlowestRenders(limit: number = 10): PerformanceMetrics[] {
    return [...this.metrics]
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, limit);
  }

  clear() {
    this.metrics = [];
  }
}

const performanceStore = new PerformanceStore();

/**
 * Performance monitoring hook for React components
 * Tracks render times, memory usage, and provides optimization insights
 */
export function usePerformanceMonitor(options: UsePerformanceMonitorOptions) {
  const {
    componentName,
    trackProps = false,
    enableMemoryTracking = false,
    threshold = 100,
    onSlowRender,
  } = options;

  const renderStartRef = useRef<number>(0);
  const propsRef = useRef<any>(null);
  const [isSlowRender, setIsSlowRender] = useState(false);

  // Start timing before render
  const startTiming = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // End timing after render
  const endTiming = useCallback((props?: any) => {
    const renderTime = performance.now() - renderStartRef.current;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
      props: trackProps ? props : undefined,
    };

    // Add memory usage if enabled and available
    if (enableMemoryTracking && 'memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }

    // Store metrics
    performanceStore.addMetric(metrics);

    // Check for slow renders
    const isSlow = renderTime > threshold;
    setIsSlowRender(isSlow);

    if (isSlow && onSlowRender) {
      onSlowRender(metrics);
    }

    // Log warning for slow renders in development
    if (process.env.NODE_ENV === 'development' && isSlow) {
      console.warn(
        `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`,
        metrics
      );
    }
  }, [componentName, trackProps, enableMemoryTracking, threshold, onSlowRender]);

  // Hook into React's lifecycle
  useEffect(() => {
    startTiming();
    return () => {
      endTiming(propsRef.current);
    };
  });

  // Update props reference if tracking is enabled
  useEffect(() => {
    if (trackProps) {
      propsRef.current = options;
    }
  });

  return {
    isSlowRender,
    startTiming,
    endTiming,
    getMetrics: () => performanceStore.getMetrics(componentName),
    getAverageRenderTime: () => performanceStore.getAverageRenderTime(componentName),
  };
}

/**
 * HOC for automatic performance monitoring
 */
export function withPerformanceMonitoring<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options: Omit<UsePerformanceMonitorOptions, 'componentName'>
) {
  const componentName = Component.displayName || Component.name || 'Unknown';
  
  const WrappedComponent = (props: P) => {
    const { startTiming, endTiming } = usePerformanceMonitor({
      ...options,
      componentName,
    });

    useEffect(() => {
      startTiming();
    }, [startTiming]);

    useEffect(() => {
      endTiming(props);
    });

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
}

/**
 * Performance monitoring context provider
 */
export function PerformanceMonitorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Log performance summary periodically in development
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const slowest = performanceStore.getSlowestRenders(5);
        if (slowest.length > 0) {
          console.group('📊 Performance Summary');
          console.table(slowest.map(m => ({
            Component: m.componentName,
            'Render Time (ms)': m.renderTime.toFixed(2),
            'Memory (MB)': m.memoryUsage ? (m.memoryUsage / 1024 / 1024).toFixed(2) : 'N/A',
          })));
          console.groupEnd();
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, []);

  return children;
}

/**
 * Performance debugging utilities
 */
export const PerformanceUtils = {
  /**
   * Get performance summary for all components
   */
  getSummary() {
    const metrics = performanceStore.getMetrics();
    const components = Array.from(new Set(metrics.map(m => m.componentName)));
    
    return components.map(componentName => ({
      componentName,
      totalRenders: performanceStore.getMetrics(componentName).length,
      averageRenderTime: performanceStore.getAverageRenderTime(componentName),
      slowestRender: Math.max(...performanceStore.getMetrics(componentName).map(m => m.renderTime)),
    }));
  },

  /**
   * Clear all performance data
   */
  clear() {
    performanceStore.clear();
  },

  /**
   * Export performance data
   */
  export() {
    return {
      metrics: performanceStore.getMetrics(),
      summary: this.getSummary(),
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Check if Web Vitals are available
   */
  supportsWebVitals() {
    return typeof window !== 'undefined' && 'PerformanceObserver' in window;
  },

  /**
   * Monitor Core Web Vitals
   */
  monitorWebVitals() {
    if (!this.supportsWebVitals()) return;

    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('📏 LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const entryWithTiming = entry as any;
        const fid = entryWithTiming.processingStart - entryWithTiming.startTime;
        console.log('⚡ FID:', fid);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Monitor Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      console.log('📐 CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  },
};

// Development helper to expose performance utils globally
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).CRMPerformance = PerformanceUtils;
}