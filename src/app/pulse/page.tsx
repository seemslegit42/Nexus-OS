// src/app/pulse/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Cpu,
  FlowArrow as Workflow,
  Clock,
  CheckCircle,
  Warning as AlertTriangle,
  XCircle,
  Radio as RadioTower,
  ChartBarHorizontal as BarChart3,
  Pulse,
} from '@phosphor-icons/react';
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
    {
      id: crypto.randomUUID(),
      timestamp: new Date(Date.now() - 5000),
      message: 'Initial system check complete. All services operational.',
      status: 'healthy',
      source: 'System Startup',
    },
    {
      id: crypto.randomUUID(),
      timestamp: new Date(Date.now() - 2000),
      message: 'Agent "OptimizerPrime" deployed to Project Alpha.',
      status: 'healthy',
      source: 'Agent Console',
    },
  ]);
  const [showHistoricalLogs, setShowHistoricalLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For future API calls

  const generateMockEvent = (): SystemEvent => {
    const statuses: SystemEvent['status'][] = [
      'healthy',
      'healthy',
      'healthy',
      'degraded',
      'error',
    ];
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
      'Failed login attempt for user "unknown_user".',
    ];
    const sources = [
      'Workflow Engine',
      'Agent: DataMinerX',
      'Deployment Service',
      'API Gateway',
      'Security Scanner',
      'Database Service',
      'Agent: SecureGuard',
      'Auth Service',
      'Config Service',
    ];

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
      setEvents(prevEvents =>
        [newEvent, ...prevEvents].slice(0, MAX_HISTORICAL_EVENTS + 50)
      );

      setSummary(prevSummary => {
        let newOverallStatus: SystemSummary['overallStatus'] = 'healthy';
        if (newEvent.status === 'error') newOverallStatus = 'error';
        else if (
          newEvent.status === 'degraded' &&
          prevSummary.overallStatus !== 'error'
        )
          newOverallStatus = 'degraded';
        else
          newOverallStatus =
            prevSummary.overallStatus === 'error'
              ? 'error'
              : prevSummary.overallStatus === 'degraded'
                ? 'degraded'
                : 'healthy';

        const agentDelta =
          Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const workflowDelta =
          Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;

        return {
          agentCount: Math.max(0, prevSummary.agentCount + agentDelta),
          activeWorkflows: Math.max(
            0,
            prevSummary.activeWorkflows + workflowDelta
          ),
          lastEventTime: newEvent.timestamp,
          overallStatus: newOverallStatus,
        };
      });
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const displayedEvents = useMemo(() => {
    if (showHistoricalLogs) {
      return events.slice(0, MAX_HISTORICAL_EVENTS);
    }
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return events
      .filter(event => event.timestamp.getTime() > fiveMinutesAgo)
      .slice(0, MAX_ACTIVE_EVENTS);
  }, [events, showHistoricalLogs]);

  const getStatusIndicator = (
    status: SystemEvent['status'] | SystemSummary['overallStatus']
  ): ReactNode => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Pulse className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (
    status: SystemEvent['status']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'degraded':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="border-b border-border/60 p-2 md:p-3">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {getStatusIndicator(summary.overallStatus)}
            <CardTitle className="text-md font-headline text-foreground">
              System Status:{' '}
              <span
                className={cn(
                  summary.overallStatus === 'healthy' && 'text-green-500',
                  summary.overallStatus === 'degraded' && 'text-yellow-500',
                  summary.overallStatus === 'error' && 'text-destructive'
                )}
              >
                {summary.overallStatus.charAt(0).toUpperCase() +
                  summary.overallStatus.slice(1)}
              </span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap text-xs text-muted-foreground">
            <span className="flex items-center">
              <Cpu className="mr-1 h-3.5 w-3.5" /> Agents: {summary.agentCount}
            </span>
            <span className="flex items-center">
              <Workflow className="mr-1 h-3.5 w-3.5" /> Workflows:{' '}
              {summary.activeWorkflows}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" /> Last Event:{' '}
              {summary.lastEventTime?.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <Switch
            id="historical-logs-toggle"
            checked={showHistoricalLogs}
            onCheckedChange={setShowHistoricalLogs}
          />
          <Label htmlFor="historical-logs-toggle" className="text-xs">
            Show Historical Logs
          </Label>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-1 md:p-2">
        {isLoading && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Loading events...
          </p>
        )}
        {!isLoading && displayedEvents.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No {showHistoricalLogs ? 'historical' : 'recent active'} events to
            display.
          </p>
        )}
        {!isLoading && displayedEvents.length > 0 && (
          <ScrollArea className="h-full">
            <div className="space-y-1.5 p-0.5">
              {displayedEvents.map(event => (
                <Card
                  key={event.id}
                  className={cn(
                    'rounded-xl border p-2 text-xs shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md', // Glassy card with rounded-xl
                    'border-primary/25', // Base jade border
                    event.status === 'healthy' && 'bg-green-500/10',
                    event.status === 'degraded' && 'bg-yellow-500/10',
                    event.status === 'error' && 'bg-destructive/10'
                  )}
                >
                  <div className="mb-0.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {getStatusIndicator(event.status)}
                      <span className="truncate font-medium text-foreground">
                        {event.message}
                      </span>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(event.status)}
                      className={cn(
                        'h-5 px-1.5 py-0 text-[10px] leading-tight',
                        event.status === 'healthy' &&
                          'border-green-600/50 bg-green-500/80 text-white',
                        event.status === 'degraded' &&
                          'border-yellow-600/50 bg-yellow-500/80 text-yellow-950 dark:bg-yellow-600/70 dark:text-yellow-50',
                        event.status === 'error' &&
                          'border-destructive/50 bg-destructive/80 text-destructive-foreground' // Ensure destructive badge also has a consistent look
                      )}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>
                      {event.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
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
    <Card className="flex h-full flex-col items-center justify-center border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-md font-headline text-foreground">
          Key Metric Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <Image
          src="https://placehold.co/600x300.png"
          alt="Key Metric Trends Placeholder"
          width={600}
          height={300}
          className="rounded-md border border-border/60 opacity-70"
          data-ai-hint="data chart graph trends"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed metric visualizations coming soon.
        </p>
      </CardContent>
    </Card>
  );
}

export default function PulsePage() {
  const pulsePageZoneConfigs: ZoneConfig[] = [
    {
      id: 'liveSystemPulse',
      title: 'System Pulse - Live Overview',
      icon: <RadioTower className="h-4 w-4" />,
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
      icon: <BarChart3 className="h-4 w-4" />,
      content: <KeyMetricTrendsContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 16, minW: 3, minH: 8 },
        md: { x: 6, y: 0, w: 4, h: 16, minW: 3, minH: 8 },
        sm: { x: 0, y: 12, w: 6, h: 8, minW: 3, minH: 6 },
      },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={pulsePageZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
