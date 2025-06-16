// src/components/dashboard/LiveOrchestrationsFeed.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ListChecks, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
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

const mockOrchestrationEntries: OrchestrationEntryData[] = [
  {
    id: 'orch_1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    inputEvent: "User command: 'Summarize recent system logs'",
    agentsInvolved: ['LogSummarizerAgent', 'NotificationAgent'],
    startTime: new Date(Date.now() - 5 * 60 * 1000 - 30000),
    durationMs: 30000,
    status: 'success',
    outcome: 'Log summary generated and sent to user via email.',
    rawInput: { command: "summarize_logs", period: "last_24_hours", user: "alex_ryder" },
    rawOutput: { summary_length: 250, notification_sent: true },
  },
  {
    id: 'orch_2',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
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
    timestamp: new Date(Date.now() - 30 * 1000),
    inputEvent: "Scheduled Task: 'Nightly Backup'",
    agentsInvolved: ['BackupAgent', 'SystemMonitorAgent'],
    startTime: new Date(Date.now() - 30 * 1000),
    status: 'in-progress',
    outcome: 'Backup process initiated for primary database...',
    rawInput: { task_name: "nightly_db_backup", target: "primary_db" },
  },
];

const OrchestrationEntryCard: React.FC<{ entry: OrchestrationEntryData }> = React.memo(({ entry }) => {
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
          cardOuterClass: 'border-yellow-500/70 hover:border-yellow-500/90 bg-yellow-500/5 hover:bg-yellow-500/10 animate-pulse-jade', 
          icon: <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />,
          badgeVariant: 'secondary' as const,
          badgeClass: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
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
          cardOuterClass: 'border-border/60 bg-card/50 hover:border-primary/40', 
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
        "rounded-xl transition-all duration-300 backdrop-blur-sm shadow-md", 
        statusStyles.cardOuterClass 
      )}
    >
      <CardHeader
        className="flex flex-row items-center justify-between p-2.5 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {statusStyles.icon}
          <div className="flex-grow overflow-hidden">
            <p className="text-xs font-medium text-foreground truncate" title={entry.inputEvent}>
              {entry.inputEvent.length > 55 ? entry.inputEvent.substring(0, 52) + "..." : entry.inputEvent}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {formattedTimestamp} ({timeAgo})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant={statusStyles.badgeVariant} className={cn("text-[10px] h-5 px-1.5 hidden sm:inline-flex items-center justify-center", statusStyles.badgeClass)}>
              {entry.status}
           </Badge>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="px-3 pb-3 pt-2 text-xs space-y-2.5 border-t border-primary/10"> 
          <div>
            <strong className="text-muted-foreground block mb-0.5 text-[11px]">Triggered Agents:</strong>
            <div className="flex flex-wrap gap-1">
              {entry.agentsInvolved.length > 0 ? 
                entry.agentsInvolved.map(agent => <Badge key={agent} variant="secondary" className="text-[10px] bg-muted/70 text-muted-foreground">{agent}</Badge>) :
                <span className="text-foreground/80">N/A</span>
              }
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            <div>
              <strong className="text-muted-foreground">Started:</strong>
              <span className="text-foreground/90 ml-1">{format(entry.startTime, "HH:mm:ss.SSS")}</span>
            </div>
            {entry.durationMs !== undefined && (
              <div>
                <strong className="text-muted-foreground">Duration:</strong>
                <span className="text-foreground/90 ml-1">{(entry.durationMs / 1000).toFixed(2)}s</span>
              </div>
            )}
          </div>
          {entry.outcome && (
            <div>
              <strong className="text-muted-foreground block mb-0.5 text-[11px]">Outcome/Result:</strong>
              <p className="text-foreground/90 mt-0.5 p-2 bg-background/40 rounded-md text-[11px] whitespace-pre-wrap border border-border/50">{entry.outcome}</p>
            </div>
          )}
          {entry.rawInput && (
             <div>
              <strong className="text-muted-foreground block mb-0.5 text-[11px]">Payload (Input):</strong>
              <ScrollArea className="mt-0.5 max-h-24 border border-border/50 rounded-md bg-background/70 backdrop-blur-sm">
                <pre className="p-2 text-[10px] font-code text-muted-foreground">
                    {JSON.stringify(entry.rawInput, null, 2)}
                </pre>
              </ScrollArea>
             </div>
          )}
           {entry.rawOutput && (
             <div>
              <strong className="text-muted-foreground block mb-0.5 text-[11px]">Payload (Output):</strong>
              <ScrollArea className="mt-0.5 max-h-24 border border-border/50 rounded-md bg-background/70 backdrop-blur-sm">
                <pre className="p-2 text-[10px] font-code text-muted-foreground">
                    {JSON.stringify(entry.rawOutput, null, 2)}
                </pre>
              </ScrollArea>
             </div>
          )}
        </CardContent>
      )}
    </Card>
  );
});
OrchestrationEntryCard.displayName = 'OrchestrationEntryCard';

const LiveOrchestrationsFeed: React.FC = () => {
  const [entries, setEntries] = useState<OrchestrationEntryData[]>(mockOrchestrationEntries);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry: OrchestrationEntryData = {
        id: `orch_${Date.now()}`,
        timestamp: new Date(),
        inputEvent: Math.random() > 0.5 ? "System Event: Health Check Complete" : "Agent Task: Analyze User Sentiment",
        agentsInvolved: Math.random() > 0.3 ? ['SentimentAnalyzer', 'Notifier'] : ['SystemHealthAgent'],
        startTime: new Date(Date.now() - (Math.floor(Math.random() * 5000) + 500)),
        status: Math.random() > 0.15 ? (Math.random() > 0.35 ? 'success' : 'failure') : 'in-progress', 
        outcome: Math.random() > 0.2 ? 'Analysis complete. Report generated.' : 'Processing data stream...',
        durationMs: Math.random() > 0.2 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
        rawInput: { source: Math.random() > 0.5 ? "twitter_feed" : "internal_metrics_api" },
        rawOutput: Math.random() > 0.3 ? { result_score: Math.random().toFixed(2) } : { status_code: 200 }
      };
      setEntries(prev => [newEntry, ...prev.slice(0, 24)]); 
    }, 7000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
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
};

export default React.memo(LiveOrchestrationsFeed);
