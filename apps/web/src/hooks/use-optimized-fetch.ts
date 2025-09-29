'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface OptimizedFetchOptions {
  cacheKey?: string;
  cacheTTL?: number; // Time to live in milliseconds
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  debounceMs?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

// Global cache store
class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100; // Maximum cache entries

  set<T>(key: string, data: T, ttl: number = 300000) { // Default 5 minutes
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && Date.now() <= entry.expiry;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  size() {
    return this.cache.size;
  }

  // Remove expired entries
  cleanup() {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    });
  }
}

const apiCache = new ApiCache();

// Cleanup expired cache entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Optimized fetch hook with caching, retry logic, and debouncing
 */
export function useOptimizedFetch<T = any>(
  url: string | null,
  options: OptimizedFetchOptions = {}
) {
  const {
    cacheKey = url || '',
    cacheTTL = 300000, // 5 minutes default
    retryAttempts = 3,
    retryDelay = 1000,
    timeout = 10000, // 10 seconds
    debounceMs = 300,
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const fetchWithRetry = useCallback(async (
    fetchUrl: string,
    attempt: number = 0
  ): Promise<T> => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await Promise.race([
        fetch(fetchUrl, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        ),
      ]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache successful response
      if (cacheKey) {
        apiCache.set(cacheKey, result, cacheTTL);
      }
      
      retryCountRef.current = 0;
      return result;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw err; // Don't retry aborted requests
      }

      if (attempt < retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return fetchWithRetry(fetchUrl, attempt + 1);
      }

      throw err;
    }
  }, [cacheKey, cacheTTL, retryAttempts, retryDelay, timeout]);

  const executeRequest = useCallback(async (requestUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cacheKey && apiCache.has(cacheKey)) {
        const cachedData = apiCache.get<T>(cacheKey);
        if (cachedData !== null) {
          setData(cachedData);
          setLoading(false);
          onSuccess?.(cachedData);
          return cachedData;
        }
      }

      const result = await fetchWithRetry(requestUrl);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchWithRetry, onSuccess, onError]);

  // Debounced fetch function
  const debouncedFetch = useCallback((requestUrl: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeRequest(requestUrl);
    }, debounceMs);
  }, [executeRequest, debounceMs]);

  // Effect to trigger fetch when URL changes
  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (debounceMs > 0) {
      debouncedFetch(url);
    } else {
      executeRequest(url);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [url, debouncedFetch, executeRequest, debounceMs]);

  // Manual refetch function
  const refetch = useCallback(() => {
    if (url) {
      // Clear cache for this key
      if (cacheKey) {
        apiCache.delete(cacheKey);
      }
      return executeRequest(url);
    }
    return Promise.resolve(null);
  }, [url, cacheKey, executeRequest]);

  return {
    data,
    loading,
    error,
    refetch,
    isFromCache: cacheKey ? apiCache.has(cacheKey) : false,
  };
}

/**
 * Optimized mutation hook for POST/PUT/DELETE operations
 */
export function useOptimizedMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    invalidateCache?: string[]; // Cache keys to invalidate on success
  } = {}
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mutationFn(variables);
      setData(result);
      
      // Invalidate specified cache keys
      if (options.invalidateCache) {
        options.invalidateCache.forEach(key => {
          apiCache.delete(key);
        });
      }
      
      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error, variables);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

/**
 * Utility functions for cache management
 */
export const CacheUtils = {
  clear: () => apiCache.clear(),
  delete: (key: string) => apiCache.delete(key),
  has: (key: string) => apiCache.has(key),
  size: () => apiCache.size(),
  cleanup: () => apiCache.cleanup(),
  
  // Preload data into cache
  preload: <T>(key: string, data: T, ttl?: number) => {
    apiCache.set(key, data, ttl);
  },

  // Get cache statistics
  getStats: () => ({
    size: apiCache.size(),
    keys: Array.from((apiCache as any).cache.keys()),
  }),
};

/**
 * Hook for batch API requests
 */
export function useBatchFetch<T = any>(
  urls: string[],
  options: OptimizedFetchOptions = {}
) {
  const [data, setData] = useState<(T | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBatch = useCallback(async () => {
    if (urls.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled(
        urls.map(url => {
          // Check cache first
          const cacheKey = options.cacheKey ? `${options.cacheKey}-${url}` : url;
          const cached = apiCache.get<T>(cacheKey);
          
          if (cached !== null) {
            return Promise.resolve(cached);
          }

          // Fetch if not in cache
          return fetch(url).then(res => res.json()).then(data => {
            apiCache.set(cacheKey, data, options.cacheTTL);
            return data;
          });
        })
      );

      const processedResults = results.map(result => 
        result.status === 'fulfilled' ? result.value : null
      );

      setData(processedResults);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Batch fetch failed');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [urls, options.cacheKey, options.cacheTTL]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  return { data, loading, error, refetch: fetchBatch };
}