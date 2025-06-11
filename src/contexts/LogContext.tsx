
// src/contexts/LogContext.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions),
      message,
      source,
    };
    setLogEntries((prevEntries) => [newLogEntry, ...prevEntries.slice(0, 199)]); // Keep last 200 entries
  }, []);

  const clearLogs = useCallback(() => {
    setLogEntries([]);
  }, []);

  // Stabilize the context value with useMemo
  const contextValue = useMemo(() => ({
    logEntries,
    addLog,
    clearLogs
  }), [logEntries, addLog, clearLogs]);

  return (
    <LogContext.Provider value={contextValue}>
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
