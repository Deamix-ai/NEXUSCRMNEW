// Performance optimization utilities for React components

import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Higher-order component for memoizing components with custom comparison
export function withMemo<T extends object>(
  Component: React.ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) {
  const MemoizedComponent = memo(Component, propsAreEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

// Utility for creating optimized list item components
export function createMemoizedListItem<T extends { id: string | number }>(
  ItemComponent: React.ComponentType<{ item: T; index: number }>
) {
  return memo(ItemComponent, (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.index === nextProps.index &&
      JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item)
    );
  });
}

// Custom hook for optimized callbacks
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

// Custom hook for expensive computations
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// Lazy loading wrapper with proper error boundaries
export function createLazyComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling({
  itemHeight,
  containerHeight,
  totalItems,
  overscan = 5,
}: {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    totalItems - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(totalItems - 1, visibleEnd + overscan);

  const offsetY = startIndex * itemHeight;
  const totalHeight = totalItems * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    setScrollTop,
  };
}

// Performance monitoring utilities
export const perf = {
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.measure(name, startMark, endMark);
      const entries = window.performance.getEntriesByName(name);
      return entries[entries.length - 1]?.duration || 0;
    }
    return 0;
  },
  
  clearMarks: () => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  },
};

// Component render performance tracker
export function withPerformanceTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  const name = componentName || Component.displayName || Component.name || 'Unknown';
  
  return function PerformanceTrackedComponent(props: T) {
    React.useEffect(() => {
      perf.mark(`${name}-start`);
      return () => {
        perf.mark(`${name}-end`);
        const duration = perf.measure(`${name}-render`, `${name}-start`, `${name}-end`);
        if (duration > 16) { // Warn if render takes longer than one frame
          console.warn(`Slow render detected: ${name} took ${duration.toFixed(2)}ms`);
        }
      };
    });

    return <Component {...props} />;
  };
}