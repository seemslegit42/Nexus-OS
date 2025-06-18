// src/hooks/use-async-data.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncDataOptions<T> {
  initialData?: T;
  dependencies?: React.DependencyList;
  onError?: (error: Error) => void;
  cacheKey?: string;
  refetchOnWindowFocus?: boolean;
}

interface UseAsyncDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const {
    initialData = null,
    dependencies = [],
    onError,
    refetchOnWindowFocus = false,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const mountedRef = useRef(true);
  const fetchPromiseRef = useRef<Promise<T> | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (fetchPromiseRef.current) {
      // If there's already a fetch in progress, wait for it
      try {
        await fetchPromiseRef.current;
      } catch {
        // Ignore error from previous fetch
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsStale(false);

    const fetchPromise = fetchFn();
    fetchPromiseRef.current = fetchPromise;

    try {
      const result = await fetchPromise;

      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');

      if (mountedRef.current) {
        setError(error);
        onError?.(error);
      }
    } finally {
      fetchPromiseRef.current = null;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, onError]);

  const refetch = useCallback(async (): Promise<void> => {
    setIsStale(true);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, dependencies);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleWindowFocus = () => {
      if (document.visibilityState === 'visible' && data) {
        setIsStale(true);
        // Delay refetch slightly to avoid overwhelming the system
        setTimeout(() => {
          if (mountedRef.current) {
            fetchData();
          }
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleWindowFocus);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleWindowFocus);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [fetchData, data, refetchOnWindowFocus]);

  return {
    data,
    isLoading,
    error,
    refetch,
    isStale,
  };
}

// Specialized hook for paginated data
interface UsePaginatedDataOptions<T> {
  pageSize?: number;
  onError?: (error: Error) => void;
}

interface UsePaginatedDataResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePaginatedData<T>(
  fetchFn: (page: number, pageSize: number) => Promise<T[]>,
  options: UsePaginatedDataOptions<T> = {}
): UsePaginatedDataResult<T> {
  const { pageSize = 20, onError } = options;

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);

  const loadPage = useCallback(
    async (page: number, append = false): Promise<void> => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchFn(page, pageSize);

        setData(prev => (append ? [...prev, ...newData] : newData));
        setHasMore(newData.length === pageSize);

        if (append) {
          setCurrentPage(page);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [fetchFn, pageSize, onError]
  );

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || loadingRef.current) return;
    await loadPage(currentPage + 1, true);
  }, [hasMore, currentPage, loadPage]);

  const refresh = useCallback(async (): Promise<void> => {
    setCurrentPage(0);
    setHasMore(true);
    await loadPage(0, false);
  }, [loadPage]);

  useEffect(() => {
    loadPage(0, false);
  }, [loadPage]);

  return {
    data,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

// Hook for debounced async operations
export function useDebouncedAsyncData<T>(
  fetchFn: () => Promise<T>,
  delay: number = 300,
  dependencies: React.DependencyList = []
): UseAsyncDataResult<T> {
  const [debouncedDeps, setDebouncedDeps] = useState(dependencies);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDeps(dependencies);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [dependencies, delay]);

  return useAsyncData(fetchFn, { dependencies: debouncedDeps });
}
