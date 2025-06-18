// src/hooks/use-optimized-state.ts
'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { debounce, throttle } from '@/lib/utils';

interface OptimizedStateOptions<T> {
  debounceMs?: number;
  throttleMs?: number;
  compare?: (a: T, b: T) => boolean;
  enableBatching?: boolean;
  enableHistory?: boolean;
  maxHistorySize?: number;
}

interface OptimizedStateResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  setValueDebounced: (value: T | ((prev: T) => T)) => void;
  setValueThrottled: (value: T | ((prev: T) => T)) => void;
  history: T[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: () => void;
}

export function useOptimizedState<T>(
  initialValue: T,
  options: OptimizedStateOptions<T> = {}
): OptimizedStateResult<T> {
  const {
    debounceMs = 300,
    throttleMs = 100,
    compare = (a, b) => a === b,
    enableBatching = true,
    enableHistory = false,
    maxHistorySize = 50,
  } = options;

  const [value, setValueInternal] = useState<T>(initialValue);
  const [history, setHistory] = useState<T[]>(
    enableHistory ? [initialValue] : []
  );
  const [historyIndex, setHistoryIndex] = useState(0);

  const pendingUpdatesRef = useRef<Array<T | ((prev: T) => T)>>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialValueRef = useRef(initialValue);

  // Batched state updates for performance
  const flushUpdates = useCallback(() => {
    if (pendingUpdatesRef.current.length === 0) return;

    setValueInternal(currentValue => {
      let newValue = currentValue;

      for (const update of pendingUpdatesRef.current) {
        newValue =
          typeof update === 'function' ? (update as any)(newValue) : update;
      }

      pendingUpdatesRef.current = [];

      // Skip update if value hasn't actually changed
      if (compare(currentValue, newValue)) {
        return currentValue;
      }

      // Update history if enabled
      if (enableHistory) {
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(newValue);

          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
          }

          return newHistory;
        });

        setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
      }

      return newValue;
    });
  }, [compare, enableHistory, historyIndex, maxHistorySize]);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      if (enableBatching) {
        pendingUpdatesRef.current.push(newValue);

        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }

        batchTimeoutRef.current = setTimeout(flushUpdates, 0);
      } else {
        setValueInternal(currentValue => {
          const resolvedValue =
            typeof newValue === 'function'
              ? (newValue as any)(currentValue)
              : newValue;

          if (compare(currentValue, resolvedValue)) {
            return currentValue;
          }

          if (enableHistory) {
            setHistory(prev => {
              const newHistory = prev.slice(0, historyIndex + 1);
              newHistory.push(resolvedValue);

              if (newHistory.length > maxHistorySize) {
                newHistory.shift();
              }

              return newHistory;
            });

            setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
          }

          return resolvedValue;
        });
      }
    },
    [
      compare,
      enableBatching,
      enableHistory,
      flushUpdates,
      historyIndex,
      maxHistorySize,
    ]
  );

  const setValueDebounced = useCallback(debounce(setValue, debounceMs), [
    setValue,
    debounceMs,
  ]);

  const setValueThrottled = useCallback(throttle(setValue, throttleMs), [
    setValue,
    throttleMs,
  ]);

  const undo = useCallback(() => {
    if (!enableHistory || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setValueInternal(history[newIndex]);
  }, [enableHistory, history, historyIndex]);

  const redo = useCallback(() => {
    if (!enableHistory || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setValueInternal(history[newIndex]);
  }, [enableHistory, history, historyIndex]);

  const reset = useCallback(() => {
    setValue(initialValueRef.current);

    if (enableHistory) {
      setHistory([initialValueRef.current]);
      setHistoryIndex(0);
    }
  }, [setValue, enableHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
        flushUpdates();
      }
    };
  }, [flushUpdates]);

  return {
    value,
    setValue,
    setValueDebounced,
    setValueThrottled,
    history,
    undo,
    redo,
    canUndo: enableHistory && historyIndex > 0,
    canRedo: enableHistory && historyIndex < history.length - 1,
    reset,
  };
}
