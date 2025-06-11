
// src/contexts/LogContext.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  source?: string;
}

interface LogContextType {
  logEntries: LogEntry[];
  addLog: (message: string, source?: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, source?: string) => {
    const newLogEntry: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7), // Simple unique ID
      timestamp: new Date().toLocaleTimeString(),
      message,
      source,
    };
    setLogEntries((prevEntries) => [newLogEntry, ...prevEntries.slice(0, 199)]); // Keep last 200 entries
  }, []);

  const clearLogs = useCallback(() => {
    setLogEntries([]);
  }, []);

  return (
    <LogContext.Provider value={{ logEntries, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs(): LogContextType {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
