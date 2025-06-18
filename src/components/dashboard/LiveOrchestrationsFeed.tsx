// src/components/dashboard/LiveOrchestrationsFeed.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CaretDown as ChevronDown, ListChecks, CheckCircle, XCircle, Warning as AlertTriangle, CircleNotch as Loader2 } from '@phosphor-icons/react';
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
  // Add a few more mock entries for a richer initial display
  {
    id: 'orch_4',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    inputEvent: "System Event: 'User Registration'",
    agentsInvolved: ['UserManagementAgent', 'WelcomeEmailAgent'],
    startTime: new Date(Date.now() - 10 * 60 * 1000 - 5000),
    durationMs: 5000,
    status: 'success',
    outcome: 'New user "jane_doe" registered and welcome email sent.',
    rawInput: { username: "jane_doe", email: "jane@example.com" },
    rawOutput: { userId: "usr_abc123", email_sent_status: "ok" },
  },
  {
    id: 'orch_5',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    inputEvent: "Agent Action: 'ContentScribe - Draft Blog Post'",
    agentsInvolved: ['ContentScribeAgent', 'TopicResearchAgent'],
    startTime: new Date(Date.now() - 1 * 60 * 1000),
    status: 'in-progress',
    outcome: 'Drafting blog post on "The Future of AI in SaaS"...',
    rawInput: { topic: "AI in SaaS", length: "medium" },
  },
];

const OrchestrationEntryCard: React.FC<{ entry: OrchestrationEntryData }> = React.memo(({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation for new entries
    if (entry.status === 'in-progress') {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [entry.status]);

  const getStatusStyles = () => {
    switch (entry.status) {
      case 'success':
        return {
          cardOuterClass: 'border-emerald-500/50 hover:border-emerald-500/70 bg-gradient-to-br from-emerald-500/10 to-green-500/5 hover:from-emerald-500/15 hover:to-green-500/10',
          icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
          badgeVariant: 'default' as const,
          badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 backdrop-blur-sm',
          glowClass: 'shadow-emerald-500/20',
        };
      case 'in-progress':
        return {
          cardOuterClass: 'border-yellow-500/50 hover:border-yellow-500/70 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 hover:from-yellow-500/15 hover:to-orange-500/10',
          icon: <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />,
          badgeVariant: 'secondary' as const,
          badgeClass: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/30 backdrop-blur-sm',
          glowClass: 'shadow-yellow-500/20',
        };
      case 'failure':
        return {
          cardOuterClass: 'border-red-500/50 hover:border-red-500/70 bg-gradient-to-br from-red-500/10 to-pink-500/5 hover:from-red-500/15 hover:to-pink-500/10',
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          badgeVariant: 'destructive' as const,
          badgeClass: 'bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/30 backdrop-blur-sm',
          glowClass: 'shadow-red-500/20',
        };
      default:
        return {
          cardOuterClass: 'border-gray-500/50 hover:border-gray-500/70 bg-gradient-to-br from-gray-500/10 to-slate-500/5',
          icon: <AlertTriangle className="h-4 w-4 text-gray-500" />,
          badgeVariant: 'outline' as const,
          badgeClass: 'bg-gray-500/20 text-gray-600 dark:text-gray-300 border-gray-500/30 backdrop-blur-sm',
          glowClass: 'shadow-gray-500/20',
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-500 hover:shadow-xl backdrop-blur-md border-2 relative overflow-hidden",
        statusStyles.cardOuterClass,
        statusStyles.glowClass,
        isExpanded && "shadow-xl scale-[1.01]",
        isAnimating && "animate-pulse-glow"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Status indicator line */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
        entry.status === 'success' && "bg-emerald-500",
        entry.status === 'in-progress' && "bg-yellow-500 animate-pulse",
        entry.status === 'failure' && "bg-red-500"
      )} />

      <CardHeader className="pb-2 relative z-10 pl-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0 p-1.5 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              {statusStyles.icon}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {entry.inputEvent}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                {formatDistanceToNowStrict(entry.timestamp, { addSuffix: true })}
                {entry.durationMs && ` • ${entry.durationMs}ms`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge 
              variant={statusStyles.badgeVariant}
              className={cn("text-[10px] px-2 py-0.5 font-medium", statusStyles.badgeClass)}
            >
              {entry.status}
            </Badge>
            <ChevronDown className={cn(
              "h-3 w-3 text-muted-foreground transition-transform duration-300 group-hover:text-foreground",
              isExpanded && "rotate-180"
            )} />
          </div>
        </div>
      </CardHeader>

      {/* Agent badges */}
      <div className="px-4 pb-2 relative z-10">
        <div className="flex flex-wrap gap-1">
          {entry.agentsInvolved.map((agent, index) => (
            <Badge 
              key={agent} 
              variant="outline" 
              className={cn(
                "text-[9px] px-1.5 py-0.5 font-medium bg-white/10 border-white/20 text-white/80 backdrop-blur-sm",
                "hover:bg-white/20 transition-colors"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isAnimating ? 'fadeInUp 0.5s ease-out forwards' : undefined
              }}
            >
              {agent}
            </Badge>
          ))}
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4 relative z-10">
          <div className="space-y-3 border-t border-white/10 pt-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 -mx-1">
            <div className="text-xs space-y-2">
              <div>
                <span className="text-muted-foreground font-medium flex items-center mb-1">
                  <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                  Outcome:
                </span>
                <p className="text-foreground/90 leading-relaxed bg-black/10 rounded p-2">
                  {entry.outcome || 'Processing...'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground font-medium flex items-center mb-1">
                    <div className="w-1 h-1 bg-secondary rounded-full mr-2" />
                    Started:
                  </span>
                  <p className="text-foreground/80 text-[10px] font-mono bg-black/10 rounded px-2 py-1">
                    {format(entry.startTime, 'HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium flex items-center mb-1">
                    <div className="w-1 h-1 bg-accent rounded-full mr-2" />
                    Duration:
                  </span>
                  <p className="text-foreground/80 text-[10px] font-mono bg-black/10 rounded px-2 py-1">
                    {entry.durationMs ? `${entry.durationMs}ms` : 'In progress...'}
                  </p>
                </div>
              </div>

              {(entry.rawInput || entry.rawOutput) && (
                <div className="space-y-2">
                  {entry.rawInput && (
                    <details className="group/details">
                      <summary className="text-muted-foreground font-medium cursor-pointer flex items-center group-hover/details:text-foreground transition-colors">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mr-2" />
                        Raw Input
                        <ChevronDown className="h-3 w-3 ml-1 transition-transform group-open/details:rotate-180" />
                      </summary>
                      <pre className="text-[9px] font-mono text-foreground/70 mt-1 overflow-x-auto bg-black/20 rounded p-2 whitespace-pre-wrap">
                        {JSON.stringify(entry.rawInput, null, 2)}
                      </pre>
                    </details>
                  )}
                  {entry.rawOutput && (
                    <details className="group/details">
                      <summary className="text-muted-foreground font-medium cursor-pointer flex items-center group-hover/details:text-foreground transition-colors">
                        <div className="w-1 h-1 bg-green-400 rounded-full mr-2" />
                        Raw Output
                        <ChevronDown className="h-3 w-3 ml-1 transition-transform group-open/details:rotate-180" />
                      </summary>
                      <pre className="text-[9px] font-mono text-foreground/70 mt-1 overflow-x-auto bg-black/20 rounded p-2 whitespace-pre-wrap">
                        {JSON.stringify(entry.rawOutput, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
});
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
  // Entries are now static, representing a snapshot fetched from a backend.
  // Real-time updates would come via props, context, or a data fetching library.
  const entries: OrchestrationEntryData[] = mockOrchestrationEntries;

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
