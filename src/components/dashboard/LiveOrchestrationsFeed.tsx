
// src/components/dashboard/LiveOrchestrationsFeed.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ListChecks, Zap, Users, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict, format } from 'date-fns';

interface OrchestrationEntryData {
  id: string;
  timestamp: Date;
  inputEvent: string;
  agentsInvolved: string[];
  startTime: Date;
  durationMs?: number;
  status: 'success' | 'in-progress' | 'failure';
  outcome?: string;
  rawInput?: Record<string, any>;
  rawOutput?: Record<string, any>;
}

// Mock Data
const mockOrchestrationEntries: OrchestrationEntryData[] = [
  {
    id: 'orch_1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    inputEvent: "User command: 'Summarize recent system logs'",
    agentsInvolved: ['LogSummarizerAgent', 'NotificationAgent'],
    startTime: new Date(Date.now() - 5 * 60 * 1000 - 30000), // Started 30s before completion
    durationMs: 30000, // 30 seconds
    status: 'success',
    outcome: 'Log summary generated and sent to user via email.',
    rawInput: { command: "summarize_logs", period: "last_24_hours", user: "alex_ryder" },
    rawOutput: { summary_length: 250, notification_sent: true },
  },
  {
    id: 'orch_2',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    inputEvent: "API Call: '/api/v1/process_order'",
    agentsInvolved: ['OrderProcessingAgent', 'InventoryAgent', 'BillingAgent'],
    startTime: new Date(Date.now() - 2 * 60 * 1000 - 10000),
    durationMs: 10000,
    status: 'failure',
    outcome: 'Inventory check failed for item SKU: 123-ABC. Not enough stock.',
    rawInput: { orderId: "ORD-2024-789", items: [{ sku: "123-ABC", quantity: 5 }] },
    rawOutput: { error_code: "INVENTORY_ERROR", message: "Insufficient stock for SKU: 123-ABC" },
  },
  {
    id: 'orch_3',
    timestamp: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    inputEvent: "Scheduled Task: 'Nightly Backup'",
    agentsInvolved: ['BackupAgent', 'SystemMonitorAgent'],
    startTime: new Date(Date.now() - 30 * 1000),
    status: 'in-progress',
    outcome: 'Backup process initiated for primary database...',
    rawInput: { task_name: "nightly_db_backup", target: "primary_db" },
  },
];

const OrchestrationEntryCard: React.FC<{ entry: OrchestrationEntryData }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusStyles = () => {
    switch (entry.status) {
      case 'success':
        return {
          borderColor: 'border-green-500/70 hover:border-green-500',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          badgeVariant: 'default' as const,
          badgeClass: 'bg-green-500/20 text-green-600 dark:text-green-300 border-green-500/30',
        };
      case 'in-progress':
        return {
          borderColor: 'border-yellow-500/70 hover:border-yellow-500',
          icon: <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />,
          badgeVariant: 'secondary' as const,
          badgeClass: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 animate-pulse',
        };
      case 'failure':
        return {
          borderColor: 'border-red-500/70 hover:border-red-500',
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          badgeVariant: 'destructive'as const,
          badgeClass: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
        };
      default:
        return {
          borderColor: 'border-primary/20 hover:border-primary/40',
          icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
          badgeVariant: 'outline'as const,
          badgeClass: 'border-muted-foreground/50 text-muted-foreground',
        };
    }
  };

  const statusStyles = getStatusStyles();

  const formattedTimestamp = format(entry.timestamp, "HH:mm:ss.SSS");
  const timeAgo = formatDistanceToNowStrict(entry.timestamp, { addSuffix: true });

  return (
    <motion.div
      layout
      initial={{ borderRadius: "0.75rem" }} // Corresponds to rounded-xl from Card
      className={cn(
        "p-0.5 rounded-xl transition-all duration-300",
        statusStyles.borderColor,
        isExpanded ? "bg-card/70" : "bg-card/40 hover:bg-card/60"
      )}
    >
      <Card className={cn("bg-transparent border-none shadow-none")}>
        <CardHeader
          className="flex flex-row items-center justify-between p-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {statusStyles.icon}
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-medium text-foreground truncate" title={entry.inputEvent}>
                {entry.inputEvent.length > 60 ? entry.inputEvent.substring(0, 57) + "..." : entry.inputEvent}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formattedTimestamp} ({timeAgo})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Badge variant={statusStyles.badgeVariant} className={cn("text-[9px] h-5 px-1.5 hidden sm:inline-flex", statusStyles.badgeClass)}>
                {entry.status}
             </Badge>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <CardContent className="px-2.5 pb-2.5 pt-1.5 text-xs space-y-1.5 border-t border-primary/10">
                <div>
                  <strong className="text-muted-foreground">Agents:</strong>
                  <span className="text-foreground ml-1">{entry.agentsInvolved.join(', ') || 'N/A'}</span>
                </div>
                <div>
                  <strong className="text-muted-foreground">Started:</strong>
                  <span className="text-foreground ml-1">{format(entry.startTime, "HH:mm:ss")}</span>
                  {entry.durationMs !== undefined && (
                    <span className="text-muted-foreground ml-2">
                      (Duration: {(entry.durationMs / 1000).toFixed(2)}s)
                    </span>
                  )}
                </div>
                {entry.outcome && (
                  <div>
                    <strong className="text-muted-foreground">Outcome:</strong>
                    <span className="text-foreground ml-1">{entry.outcome}</span>
                  </div>
                )}
                {entry.rawInput && (
                   <div>
                    <strong className="text-muted-foreground">Input Data:</strong>
                    <pre className="mt-0.5 p-1.5 bg-black/20 rounded-md text-[10px] max-h-20 overflow-auto font-code text-muted-foreground/80">
                        {JSON.stringify(entry.rawInput, null, 2)}
                    </pre>
                   </div>
                )}
                 {entry.rawOutput && (
                   <div>
                    <strong className="text-muted-foreground">Output Data:</strong>
                     <pre className="mt-0.5 p-1.5 bg-black/20 rounded-md text-[10px] max-h-20 overflow-auto font-code text-muted-foreground/80">
                        {JSON.stringify(entry.rawOutput, null, 2)}
                    </pre>
                   </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default function LiveOrchestrationsFeed() {
  const [entries, setEntries] = useState<OrchestrationEntryData[]>(mockOrchestrationEntries);

  // Simulate new entries arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry: OrchestrationEntryData = {
        id: `orch_${Date.now()}`,
        timestamp: new Date(),
        inputEvent: Math.random() > 0.5 ? "System Event: Health Check" : "Agent Task: Process X",
        agentsInvolved: Math.random() > 0.3 ? ['SystemMonitor', 'AlertAgent'] : ['TaskRunner'],
        startTime: new Date(),
        status: Math.random() > 0.2 ? (Math.random() > 0.4 ? 'success' : 'failure') : 'in-progress',
        outcome: Math.random() > 0.2 ? 'Completed successfully.' : 'Processing...',
        durationMs: Math.random() > 0.2 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
      };
      setEntries(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
    }, 7000); // Add new entry every 7 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full flex flex-col bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <ListChecks className="h-4 w-4 mr-2 text-primary" /> Live Orchestration Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden px-1 pb-1 pt-0">
        <ScrollArea className="h-full pr-2">
          {entries.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No orchestration events yet.</p>
            </div>
          ) : (
            <div className="space-y-1.5 py-1">
              <AnimatePresence initial={false}>
                {entries.map((entry) => (
                   <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop:0, paddingBottom:0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <OrchestrationEntryCard entry={entry} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
