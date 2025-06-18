// src/hooks/use-web-worker.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DataProcessingTask,
  DataProcessingResult,
} from '@/lib/workers/data-processor.worker';

interface UseWebWorkerResult {
  execute: (task: DataProcessingTask) => Promise<any>;
  isProcessing: boolean;
  error: string | null;
  lastProcessingTime: number | null;
}

export function useWebWorker(): UseWebWorkerResult {
  const workerRef = useRef<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProcessingTime, setLastProcessingTime] = useState<number | null>(
    null
  );
  const pendingTasksRef = useRef<
    Map<string, { resolve: (value: any) => void; reject: (error: any) => void }>
  >(new Map());

  useEffect(() => {
    // Create worker only on client side
    if (typeof window !== 'undefined') {
      try {
        workerRef.current = new Worker(
          new URL('@/lib/workers/data-processor.worker.ts', import.meta.url)
        );

        workerRef.current!.onmessage = (
          e: MessageEvent<DataProcessingResult>
        ) => {
          const {
            taskType,
            result,
            error: workerError,
            processingTime,
          } = e.data;

          setIsProcessing(false);
          setLastProcessingTime(processingTime);

          // Find pending task and resolve/reject
          const taskId = taskType;
          const pendingTask = pendingTasksRef.current.get(taskId);

          if (pendingTask) {
            pendingTasksRef.current.delete(taskId);

            if (workerError) {
              setError(workerError);
              pendingTask.reject(new Error(workerError));
            } else {
              setError(null);
              pendingTask.resolve(result);
            }
          }
        };

        workerRef.current!.onerror = error => {
          setIsProcessing(false);
          setError('Worker error occurred');
          console.error('Web Worker error:', error);
        };
      } catch (err) {
        console.error('Failed to create Web Worker:', err);
        setError('Web Worker not supported');
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      pendingTasksRef.current.clear();
    };
  }, []);

  const execute = useCallback(
    async (task: DataProcessingTask): Promise<any> => {
      if (!workerRef.current) {
        throw new Error('Web Worker not initialized');
      }

      return new Promise((resolve, reject) => {
        const taskId = task.type;

        // Store promise resolvers
        pendingTasksRef.current.set(taskId, { resolve, reject });

        setIsProcessing(true);
        setError(null);

        // Send task to worker
        workerRef.current!.postMessage(task);

        // Set timeout to prevent hanging
        setTimeout(() => {
          if (pendingTasksRef.current.has(taskId)) {
            pendingTasksRef.current.delete(taskId);
            setIsProcessing(false);
            reject(new Error('Task timeout'));
          }
        }, 30000); // 30 seconds timeout
      });
    },
    []
  );

  return {
    execute,
    isProcessing,
    error,
    lastProcessingTime,
  };
}
