// src/app/logs/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Icons, getIcon } from '@/lib/icons';
import Image from 'next/image';
import {
  summarizeLogs,
  type SummarizeLogsInput,
} from '@/ai/flows/summarize-logs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialLogEntries = [
  {
    timestamp: '2023-10-26 10:00:15',
    user: 'Agent Alpha',
    module: 'AuthService',
    action: 'User login successful',
    details: 'IP: 192.168.1.100',
    level: 'INFO',
    type: 'Security',
    stateBefore: '{ "loggedIn": false }',
    stateAfter: '{ "loggedIn": true }',
  },
  {
    timestamp: '2023-10-26 10:01:22',
    user: 'User Beta',
    module: 'BillingModule',
    action: 'Payment processing failed',
    details: 'Reason: Insufficient funds',
    level: 'ERROR',
    type: 'Audit',
    stateBefore: '{ "balance": 10 }',
    stateAfter: '{ "balance": 10, "attempted": 50 }',
  },
  {
    timestamp: '2023-10-26 10:02:05',
    user: 'Agent Gamma',
    module: 'DataSync',
    action: 'Data sync initiated',
    details: 'Source: CRM, Target: Warehouse',
    level: 'INFO',
    type: 'System',
    stateBefore: '{}',
    stateAfter: '{}',
  },
  {
    timestamp: '2023-10-26 10:03:40',
    user: 'System',
    module: 'Kernel',
    action: 'Security patch CVE-2023-XXXX applied',
    details: 'Reboot scheduled',
    level: 'WARN',
    type: 'Security',
    stateBefore: '{ "patched": false }',
    stateAfter: '{ "patched": true }',
  },
  {
    timestamp: '2023-10-26 10:05:00',
    user: 'Agent Alpha',
    module: 'OptimizerPrime',
    action: 'Optimization task started for Project Gamma.',
    details: 'Using v2 algorithm.',
    level: 'INFO',
    type: 'Agent',
    stateBefore: '{}',
    stateAfter: '{}',
  },
  {
    timestamp: '2023-10-26 10:05:30',
    user: 'User Delta',
    module: 'FileVault',
    action: 'File upload failed: Q4_Review.docx',
    details: 'Error: Network timeout.',
    level: 'ERROR',
    type: 'UserSession',
    stateBefore: '{}',
    stateAfter: '{}',
  },
  {
    timestamp: '2023-10-26 10:06:00',
    user: 'Agent SecureGuard',
    module: 'Firewall',
    action: 'Blocked suspicious IP: 203.0.113.45',
    details: 'Attempted RDP access.',
    level: 'CRITICAL',
    type: 'Security',
    stateBefore: '{}',
    stateAfter: '{ "blocked_ips": ["203.0.113.45"] }',
  },
];

function LogStreamFilterContent(): ReactNode {
  const [logEntries, setLogEntries] = useState(initialLogEntries);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [lastSummarizedLogCount, setLastSummarizedLogCount] =
    useState<number>(0);

  const handleSummarizeLogs = async () => {
    setIsSummarizing(true);
    setAiSummary(null);
    setSummaryError(null);
    try {
      const logsString = logEntries
        .map(
          log =>
            `${log.timestamp} [${log.level}] (${log.type}) ${log.user} (${log.module}): ${log.action} - ${log.details}`
        )
        .join('\n');

      if (!logsString.trim()) {
        setSummaryError('No logs to summarize.');
        setIsSummarizing(false);
        return;
      }
      const input: SummarizeLogsInput = { logs: logsString };
      const result = await summarizeLogs(input);
      setAiSummary(result.summary);
      setLastSummarizedLogCount(logEntries.length);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setSummaryError(errorMsg);
      console.error('Error summarizing logs:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const isSummaryStale =
    logEntries.length !== lastSummarizedLogCount && aiSummary !== null;

  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="border-b border-border/60 p-2 md:p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="text"
            placeholder="Search logs (keywords, user, module...)"
            className="h-8 min-w-[200px] flex-grow border-input bg-input text-sm focus:ring-primary"
          />
          <Select>
            <SelectTrigger className="h-8 w-full border-input bg-input text-xs focus:ring-primary md:w-[130px]">
              <SelectValue placeholder="Log Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="usersession">User Session</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-8 w-full border-input bg-input text-xs focus:ring-primary md:w-[110px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">INFO</SelectItem>
              <SelectItem value="warn">WARN</SelectItem>
              <SelectItem value="error">ERROR</SelectItem>
              <SelectItem value="critical">CRITICAL</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="Date"
            className="h-8 w-full border-input bg-input text-xs focus:ring-primary md:w-[120px]"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-card text-xs hover:bg-muted/70"
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Apply Filters
          </Button>
          <Button
            onClick={handleSummarizeLogs}
            disabled={isSummarizing}
            variant="outline"
            size="sm"
            className="h-8 border-primary/50 bg-card text-xs text-primary hover:bg-primary/10"
          >
            {isSummarizing ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            )}
            AI Summary
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col overflow-hidden p-1 md:p-2">
        <Card className="mb-2 border-border/60 bg-card shadow-md backdrop-blur-sm">
          <CardHeader className="p-2">
            <CardTitle className="flex items-center font-headline text-sm text-primary">
              <Sparkles className="mr-1.5 h-4 w-4" />
              AI Log Summary
            </CardTitle>
            {isSummaryStale && (
              <CardDescription className="mt-0.5 flex items-center text-xs text-yellow-500 dark:text-yellow-400">
                <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Log view has
                changed since last summary.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="min-h-[60px] p-2">
            {isSummarizing && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Generating summary...
              </div>
            )}
            {summaryError && (
              <p className="text-xs text-destructive">Error: {summaryError}</p>
            )}
            {aiSummary && !isSummarizing && (
              <pre className="whitespace-pre-wrap font-code text-xs text-foreground">
                {aiSummary}
              </pre>
            )}
            {!aiSummary && !isSummarizing && !summaryError && (
              <p className="text-xs text-muted-foreground">
                Click "AI Summary" to generate insights from the current log
                view.
              </p>
            )}
          </CardContent>
        </Card>

        <ScrollArea className="flex-grow">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="w-[150px] text-xs">
                  <CalendarDays className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                  Timestamp
                </TableHead>
                <TableHead className="text-xs">
                  <User className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                  User/Agent
                </TableHead>
                <TableHead className="text-xs">
                  <Cpu className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                  Module
                </TableHead>
                <TableHead className="text-xs">Action</TableHead>
                <TableHead className="text-xs">Details</TableHead>
                <TableHead className="text-xs">Level</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-center text-xs">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logEntries.map((log, i) => (
                <TableRow
                  key={i}
                  className={cn(
                    'border-border/60 hover:bg-muted/30',
                    log.level === 'CRITICAL' &&
                      'border-l-4 border-destructive bg-destructive/20 hover:bg-destructive/30',
                    log.level === 'ERROR' &&
                      !log.action.toLowerCase().includes('failed') &&
                      'bg-destructive/10 hover:bg-destructive/20',
                    log.level === 'ERROR' &&
                      log.action.toLowerCase().includes('failed') &&
                      'border-l-2 border-destructive/70 bg-destructive/15 hover:bg-destructive/25',
                    log.level === 'WARN' &&
                      'bg-yellow-500/10 hover:bg-yellow-500/20',
                    log.type === 'Security' &&
                      log.level === 'CRITICAL' &&
                      'font-semibold'
                  )}
                >
                  <TableCell className="whitespace-nowrap py-1.5 text-xs text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-1.5 text-xs font-medium text-foreground">
                    {log.user}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-1.5 text-xs text-muted-foreground">
                    {log.module}
                  </TableCell>
                  <TableCell className="py-1.5 text-xs text-foreground">
                    {log.action}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate py-1.5 text-xs text-muted-foreground"
                    title={log.details}
                  >
                    {log.details}
                  </TableCell>
                  <TableCell className="py-1.5">
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        log.level === 'INFO' &&
                          'border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
                        log.level === 'WARN' &&
                          'border border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
                        log.level === 'ERROR' &&
                          'border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
                        log.level === 'CRITICAL' &&
                          'border border-red-700/40 bg-red-700/20 text-red-800 dark:text-red-300'
                      )}
                    >
                      {log.level}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-1.5 text-xs text-muted-foreground">
                    {log.type}
                  </TableCell>
                  <TableCell className="py-1.5 text-center text-xs">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function EventTimelineContent(): ReactNode {
  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Event Timeline &amp; State Diff
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Replay critical action: 'Payment processing failed' (User Beta).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 text-center md:p-3">
        <Image
          src="https://placehold.co/600x300.png"
          alt="Event Timeline with State Diff"
          width={600}
          height={300}
          className="rounded-md border border-border/60 opacity-70"
          data-ai-hint="gantt chart events state comparison"
        />
        <div className="mt-2 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card hover:bg-muted/70"
          >
            <PlaySquare className="mr-1.5 h-3.5 w-3.5" />
            Play
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-card hover:bg-muted/70"
          >
            Step Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-card hover:bg-muted/70"
          >
            Step Forward
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Red alert trigger zones are highlighted on timeline.
        </p>
      </CardContent>
    </Card>
  );
}

function UserSessionDetailsContent(): ReactNode {
  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          User Session: <span className="text-primary">User Beta</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          ID: sess_userbeta_xyz789
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5 p-2 text-xs md:p-3">
        <p>
          <span className="font-semibold text-muted-foreground">
            Start Time:
          </span>{' '}
          <span className="text-foreground">2023-10-26 10:01:00</span>
        </p>
        <p>
          <span className="font-semibold text-muted-foreground">Duration:</span>{' '}
          <span className="text-foreground">45 minutes</span>
        </p>
        <p>
          <span className="font-semibold text-muted-foreground">
            IP Address:
          </span>{' '}
          <span className="text-foreground">198.51.100.12</span>
        </p>
        <p>
          <span className="font-semibold text-muted-foreground">
            Key Actions:
          </span>{' '}
          <span className="text-foreground">
            Viewed Billing, Attempted Payment, Logged Out.
          </span>
        </p>
        <p>
          <span className="font-semibold text-muted-foreground">
            Agent Interactions:
          </span>{' '}
          <span className="text-foreground">
            DataMinerX (Viewed Report), BillingAgent (Payment Attempt)
          </span>
        </p>
        <Image
          src="https://placehold.co/300x200.png"
          alt="User Activity Heatmap"
          width={300}
          height={200}
          data-ai-hint="activity heatmap user clicks"
          className="mx-auto mt-2 rounded-md border border-border/60 opacity-70"
        />
      </CardContent>
    </Card>
  );
}

export default function LogsAuditPage() {
  const logsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'logStreamFilter',
      title: 'Log Explorer & AI Summary',
      icon: <ListFilter className="h-4 w-4" />,
      content: <LogStreamFilterContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 8 },
        md: { x: 0, y: 0, w: 10, h: 12, minW: 5, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 6 },
      },
    },
    {
      id: 'eventTimeline',
      title: 'Replayable Event Timeline & Diff',
      icon: <Repeat className="h-4 w-4" />,
      content: <EventTimelineContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 8, h: 8, minW: 4, minH: 5 },
        md: { x: 0, y: 12, w: 6, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 10, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'userSessionDetails',
      title: 'User Session Details',
      icon: <Users className="h-4 w-4" />,
      content: <UserSessionDetailsContent />,
      defaultLayout: {
        lg: { x: 8, y: 12, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 6, y: 12, w: 4, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={logsPageZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
