import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Performance monitoring utilities
export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  interactionDelay: number;
  cacheHitRate: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  recordMetric(metric: Partial<PerformanceMetrics>): void {
    const timestamp = Date.now();
    const fullMetric = {
      renderTime: 0,
      bundleSize: 0,
      memoryUsage: 0,
      interactionDelay: 0,
      cacheHitRate: 0,
      ...metric,
      timestamp,
    } as PerformanceMetrics & { timestamp: number };

    this.metrics.push(fullMetric);

    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        renderTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
        interactionDelay: 0,
        cacheHitRate: 0,
      };
    }

    const totals = this.metrics.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        bundleSize: acc.bundleSize + metric.bundleSize,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        interactionDelay: acc.interactionDelay + metric.interactionDelay,
        cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
      }),
      {
        renderTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
        interactionDelay: 0,
        cacheHitRate: 0,
      }
    );

    const count = this.metrics.length;
    return {
      renderTime: totals.renderTime / count,
      bundleSize: totals.bundleSize / count,
      memoryUsage: totals.memoryUsage / count,
      interactionDelay: totals.interactionDelay / count,
      cacheHitRate: totals.cacheHitRate / count,
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

// Debouncing utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(null, args);
    }, wait);

    if (callNow) func.apply(null, args);
  };
}

// Throttling utility for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility for expensive computations
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T;
}

// Lazy loading utility for components
export function createLazyComponent<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(factory);

  return fallback
    ? React.lazy(() => factory().catch(() => ({ default: fallback as T })))
    : LazyComponent;
}

// Bundle size optimization utility
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Performance timing utilities
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  PerformanceMonitor.getInstance().recordMetric({
    renderTime: end - start,
  });

  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    performance.mark(`${name}-start`);
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  return result;
}

// Async performance measurement
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  PerformanceMonitor.getInstance().recordMetric({
    renderTime: end - start,
  });

  return result;
}

// Critical resource hints for performance
export function preloadResource(url: string, as: string = 'script'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

export function prefetchResource(url: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// React imports for lazy loading utility
import React from 'react';
