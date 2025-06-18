// src/hooks/use-performance.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PerformanceMonitor } from '@/lib/utils';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  interactionDelay: number;
}

interface UsePerformanceResult {
  metrics: PerformanceMetrics;
  startMeasurement: (name: string) => () => void;
  measureAsync: <T>(name: string, fn: () => Promise<T>) => Promise<T>;
  isSupported: boolean;
}

export function usePerformance(): UsePerformanceResult {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 0,
    interactionDelay: 0,
  });

  const performanceMonitor = PerformanceMonitor.getInstance();
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const isSupported = typeof window !== 'undefined' && 'performance' in window;

  // Frame rate monitoring
  useEffect(() => {
    if (!isSupported) return;

    let animationFrameId: number;

    const measureFrameRate = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;

      if (delta >= 1000) {
        // Update every second
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;

        setMetrics(prev => ({ ...prev, frameRate: fps }));
      }

      frameCountRef.current++;
      animationFrameId = requestAnimationFrame(measureFrameRate);
    };

    animationFrameId = requestAnimationFrame(measureFrameRate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSupported]);

  // Memory usage monitoring
  useEffect(() => {
    if (!isSupported || !('memory' in performance)) return;

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usage = memory.usedJSHeapSize / (1024 * 1024); // MB
        setMetrics(prev => ({ ...prev, memoryUsage: usage }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000); // Every 5 seconds
    updateMemoryUsage(); // Initial measurement

    return () => clearInterval(interval);
  }, [isSupported]);

  const startMeasurement = useCallback(
    (name: string) => {
      if (!isSupported) return () => {};

      const startTime = performance.now();
      performance.mark(`${name}-start`);

      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        performanceMonitor.recordMetric({ renderTime: duration });
        setMetrics(prev => ({ ...prev, renderTime: duration }));
      };
    },
    [isSupported, performanceMonitor]
  );

  const measureAsync = useCallback(
    async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
      if (!isSupported) return fn();

      const startTime = performance.now();
      performance.mark(`${name}-start`);

      try {
        const result = await fn();
        const endTime = performance.now();
        const duration = endTime - startTime;

        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        performanceMonitor.recordMetric({ renderTime: duration });
        setMetrics(prev => ({ ...prev, renderTime: duration }));

        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        performance.mark(`${name}-error`);
        performance.measure(`${name}-error`, `${name}-start`, `${name}-error`);

        throw error;
      }
    },
    [isSupported, performanceMonitor]
  );

  return {
    metrics,
    startMeasurement,
    measureAsync,
    isSupported,
  };
}
