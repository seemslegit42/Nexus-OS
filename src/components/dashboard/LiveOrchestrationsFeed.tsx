
// src/components/dashboard/LiveOrchestrationsFeed.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ListChecks, Zap, Users, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
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
          cardOuterClass: 'border-green-500/70 hover:border-green-500/90 bg-green-500/5 hover:bg-green-500/10',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          badgeVariant: 'default' as const,
          badgeClass: 'bg-green-500/20 text-green-600 dark:text-green-300 border-green-500/30',
        };
      case 'in-progress':
        return {
          cardOuterClass: 'border-yellow-500/70 hover:border-yellow-500/90 bg-yellow-500/5 hover:bg-yellow-500/10',
          icon: <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />,
          badgeVariant: 'secondary' as const,
          badgeClass: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 animate-pulse',
        };
      case 'failure':
        return {
          cardOuterClass: 'border-red-500/70 hover:border-red-500/90 bg-red-500/5 hover:bg-red-500/10',
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          badgeVariant: 'destructive'as const,
          badgeClass: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
        };
      default:
        return {
          cardOuterClass: 'border-primary/20 hover:border-primary/40 bg-card/40 hover:bg-card/60',
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
    <Card className={cn(
        "rounded-xl transition-all duration-300 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,255,162,0.08)]", // Base glassy jade
        statusStyles.cardOuterClass // Status-specific border and hover background
      )}
    >
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
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="px-2.5 pb-2.5 pt-1.5 text-xs space-y-2 border-t border-primary/10">
          <div>
            <strong className="text-muted-foreground block mb-0.5">Triggered Agents:</strong>
            <div className="flex flex-wrap gap-1">
              {entry.agentsInvolved.length > 0 ? 
                entry.agentsInvolved.map(agent => <Badge key={agent} variant="secondary" className="text-[10px] bg-muted/70 text-muted-foreground">{agent}</Badge>) :
                <span className="text-foreground">N/A</span>
              }
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong className="text-muted-foreground">Started:</strong>
              <span className="text-foreground ml-1">{format(entry.startTime, "HH:mm:ss.SSS")}</span>
            </div>
            {entry.durationMs !== undefined && (
              <div>
                <strong className="text-muted-foreground">Duration:</strong>
                <span className="text-foreground ml-1">{(entry.durationMs / 1000).toFixed(2)}s</span>
              </div>
            )}
          </div>
          {entry.outcome && (
            <div>
              <strong className="text-muted-foreground">Outcome/Result:</strong>
              <p className="text-foreground mt-0.5 p-1.5 bg-black/20 rounded-md text-[11px] whitespace-pre-wrap">{entry.outcome}</p>
            </div>
          )}
          {entry.rawInput && (
             <div>
              <strong className="text-muted-foreground">Payload (Input):</strong>
              <ScrollArea className="mt-0.5 max-h-24">
                <pre className="p-1.5 bg-black/20 rounded-md text-[10px] font-code text-muted-foreground/80">
                    {JSON.stringify(entry.rawInput, null, 2)}
                </pre>
              </ScrollArea>
             </div>
          )}
           {entry.rawOutput && (
             <div>
              <strong className="text-muted-foreground">Payload (Output):</strong>
              <ScrollArea className="mt-0.5 max-h-24">
                <pre className="p-1.5 bg-black/20 rounded-md text-[10px] font-code text-muted-foreground/80">
                    {JSON.stringify(entry.rawOutput, null, 2)}
                </pre>
              </ScrollArea>
             </div>
          )}
        </CardContent>
      )}
    </Card>
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
        inputEvent: Math.random() > 0.5 ? "System Event: Health Check Complete" : "Agent Task: Analyze User Sentiment",
        agentsInvolved: Math.random() > 0.3 ? ['SentimentAnalyzer', 'Notifier'] : ['SystemHealthAgent'],
        startTime: new Date(Date.now() - (Math.floor(Math.random() * 5000) + 500)), // started 0.5s to 5.5s ago
        status: Math.random() > 0.2 ? (Math.random() > 0.4 ? 'success' : 'failure') : 'in-progress',
        outcome: Math.random() > 0.2 ? 'Analysis complete. Report generated.' : 'Processing data stream...',
        durationMs: Math.random() > 0.2 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
        rawInput: { source: Math.random() > 0.5 ? "twitter_feed" : "internal_metrics_api" },
        rawOutput: Math.random() > 0.3 ? { result_score: Math.random().toFixed(2) } : { status_code: 200 }
      };
      setEntries(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
    }, 7000); 
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
              {entries.map((entry) => (
                <OrchestrationEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
