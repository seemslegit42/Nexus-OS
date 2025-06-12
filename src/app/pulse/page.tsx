
// src/app/pulse/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cpu, Workflow as WorkflowIcon, Clock, CheckCircle, AlertTriangle, XCircle, RadioTower, BarChart3, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SystemEvent {
  id: string;
  timestamp: Date;
  message: string;
  status: 'healthy' | 'degraded' | 'error';
  source?: string;
}

interface SystemSummary {
  agentCount: number;
  activeWorkflows: number;
  lastEventTime: Date | null;
  overallStatus: 'healthy' | 'degraded' | 'error';
}

const MAX_ACTIVE_EVENTS = 20;
const MAX_HISTORICAL_EVENTS = 100;

function LiveSystemPulseContent(): ReactNode {
  const [summary, setSummary] = useState<SystemSummary>({
    agentCount: 5,
    activeWorkflows: 3,
    lastEventTime: new Date(),
    overallStatus: 'healthy',
  });
  const [events, setEvents] = useState<SystemEvent[]>(() => [
    { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 5000), message: 'Initial system check complete. All services operational.', status: 'healthy', source: 'System Startup' },
    { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 2000), message: 'Agent "OptimizerPrime" deployed to Project Alpha.', status: 'healthy', source: 'Agent Console' },
  ]);
  const [showHistoricalLogs, setShowHistoricalLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For future API calls

  const generateMockEvent = (): SystemEvent => {
    const statuses: SystemEvent['status'][] = ['healthy', 'healthy', 'healthy', 'degraded', 'error'];
    const messages = [
      'Workflow "User Onboarding" triggered.',
      'Agent "DataMinerX" completed data analysis task.',
      'New module "PaymentGatewayV2" deployed successfully.',
      'API endpoint /v1/users experiencing high latency.',
      'Security scan detected potential vulnerability in "LegacyAuthModule".',
      'Database backup completed for "PrimaryDB".',
      'Agent "SecureGuard" blocked suspicious IP: 123.45.67.89',
      'User "alex_ryder" logged in successfully.',
      'Configuration change applied to "LoomStudio".',
      'Failed login attempt for user "unknown_user".'
    ];
    const sources = ['Workflow Engine', 'Agent: DataMinerX', 'Deployment Service', 'API Gateway', 'Security Scanner', 'Database Service', 'Agent: SecureGuard', 'Auth Service', 'Config Service'];
    
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];

    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      message: randomMessage,
      status: randomStatus,
      source: randomSource,
    };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newEvent = generateMockEvent();
      setEvents(prevEvents => [newEvent, ...prevEvents].slice(0, MAX_HISTORICAL_EVENTS + 50)); // Keep a bit more than max for filtering

      setSummary(prevSummary => {
        let newOverallStatus: SystemSummary['overallStatus'] = 'healthy';
        if (newEvent.status === 'error') newOverallStatus = 'error';
        else if (newEvent.status === 'degraded' && prevSummary.overallStatus !== 'error') newOverallStatus = 'degraded';
        else newOverallStatus = prevSummary.overallStatus === 'error' ? 'error' : prevSummary.overallStatus === 'degraded' ? 'degraded' : 'healthy'; // maintain error/degraded if already set

        // Simulate changes in agent/workflow counts
        const agentDelta = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const workflowDelta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        
        return {
          agentCount: Math.max(0, prevSummary.agentCount + agentDelta),
          activeWorkflows: Math.max(0, prevSummary.activeWorkflows + workflowDelta),
          lastEventTime: newEvent.timestamp,
          overallStatus: newOverallStatus,
        };
      });
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  const displayedEvents = useMemo(() => {
    if (showHistoricalLogs) {
      return events.slice(0, MAX_HISTORICAL_EVENTS);
    }
    // Active: show events from last 5 minutes, up to MAX_ACTIVE_EVENTS
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return events.filter(event => event.timestamp.getTime() > fiveMinutesAgo).slice(0, MAX_ACTIVE_EVENTS);
  }, [events, showHistoricalLogs]);

  const getStatusIndicator = (status: SystemEvent['status'] | SystemSummary['overallStatus']): ReactNode => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getStatusBadgeVariant = (status: SystemEvent['status']): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
      case 'healthy': return 'default'; // Will be styled green
      case 'degraded': return 'secondary'; // Will be styled yellow
      case 'error': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className='flex items-center gap-2'>
            {getStatusIndicator(summary.overallStatus)}
            <CardTitle className="font-headline text-md text-foreground">
              System Status: <span className={cn(
                summary.overallStatus === 'healthy' && 'text-green-500',
                summary.overallStatus === 'degraded' && 'text-yellow-500',
                summary.overallStatus === 'error' && 'text-destructive'
              )}>{summary.overallStatus.charAt(0).toUpperCase() + summary.overallStatus.slice(1)}</span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground whitespace-nowrap">
            <span className="flex items-center"><Cpu className="h-3.5 w-3.5 mr-1" /> Agents: {summary.agentCount}</span>
            <span className="flex items-center"><WorkflowIcon className="h-3.5 w-3.5 mr-1" /> Workflows: {summary.activeWorkflows}</span>
            <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> Last Event: {summary.lastEventTime?.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <Switch
            id="historical-logs-toggle"
            checked={showHistoricalLogs}
            onCheckedChange={setShowHistoricalLogs}
          />
          <Label htmlFor="historical-logs-toggle" className="text-xs">Show Historical Logs</Label>
        </div>
      </CardHeader>
      <CardContent className="p-1 md:p-2 flex-grow overflow-hidden">
        {isLoading && <p className="text-muted-foreground text-sm p-4 text-center">Loading events...</p>}
        {!isLoading && displayedEvents.length === 0 && (
          <p className="text-muted-foreground text-sm p-4 text-center">No {showHistoricalLogs ? 'historical' : 'recent active'} events to display.</p>
        )}
        {!isLoading && displayedEvents.length > 0 && (
          <ScrollArea className="h-full">
            <div className="space-y-1.5 p-0.5">
              {displayedEvents.map((event) => (
                <Card key={event.id} className={cn(
                  "p-2 shadow-sm hover:shadow-md transition-shadow text-xs border-l-4",
                  event.status === 'healthy' && 'border-green-500/70 bg-green-500/5 hover:bg-green-500/10',
                  event.status === 'degraded' && 'border-yellow-500/70 bg-yellow-500/5 hover:bg-yellow-500/10',
                  event.status === 'error' && 'border-destructive/70 bg-destructive/5 hover:bg-destructive/10',
                )}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      {getStatusIndicator(event.status)}
                      <span className="font-medium text-foreground truncate">{event.message}</span>
                    </div>
                    <Badge 
                        variant={getStatusBadgeVariant(event.status)}
                        className={cn("text-[10px] py-0 px-1.5 h-5 leading-tight",
                            event.status === 'healthy' && 'bg-green-500/80 text-white border-green-600/50',
                            event.status === 'degraded' && 'bg-yellow-500/80 text-yellow-950 border-yellow-600/50 dark:text-yellow-50 dark:bg-yellow-600/70',
                        )}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-[11px] flex justify-between">
                    <span>{event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    {event.source && <span>Source: {event.source}</span>}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function KeyMetricTrendsContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col items-center justify-center bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline text-md text-foreground">Key Metric Trends</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <Image src="https://placehold.co/600x300.png" alt="Key Metric Trends Placeholder" width={600} height={300} className="rounded-md opacity-70" data-ai-hint="data chart graph trends" />
        <p className="text-sm text-muted-foreground mt-2">Detailed metric visualizations coming soon.</p>
      </CardContent>
    </Card>
  );
}


export default function PulsePage() {
  const pulsePageZoneConfigs: ZoneConfig[] = [
    {
      id: 'liveSystemPulse',
      title: 'System Pulse - Live Overview',
      icon: <RadioTower className="w-4 h-4" />,
      content: <LiveSystemPulseContent />,
      defaultLayout: { 
        lg: { x: 0, y: 0, w: 8, h: 16, minW: 6, minH: 10 },
        md: { x: 0, y: 0, w: 6, h: 16, minW: 5, minH: 10 },
        sm: { x: 0, y: 0, w: 6, h: 12, minW: 4, minH: 8 },
      },
    },
    {
      id: 'keyMetricTrends',
      title: 'Key Metric Trends',
      icon: <BarChart3 className="w-4 h-4" />,
      content: <KeyMetricTrendsContent />,
      defaultLayout: { 
        lg: { x: 8, y: 0, w: 4, h: 16, minW: 3, minH: 8 },
        md: { x: 6, y: 0, w: 4, h: 16, minW: 3, minH: 8 },
        sm: { x: 0, y: 12, w: 6, h: 8, minW: 3, minH: 6 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={pulsePageZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}

