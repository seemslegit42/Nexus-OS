
// src/app/logs/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, User, Cpu, Filter, AlertTriangle, Sparkles, Loader2, PlaySquare, Eye, ListFilter, Users, Repeat } from 'lucide-react';
import Image from 'next/image';
import { summarizeLogs, type SummarizeLogsInput } from '@/ai/flows/summarize-logs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialLogEntries = [
  { timestamp: '2023-10-26 10:00:15', user: 'Agent Alpha', module: 'AuthService', action: 'User login successful', details: 'IP: 192.168.1.100', level: 'INFO', type: 'Security', stateBefore: '{ "loggedIn": false }', stateAfter: '{ "loggedIn": true }' },
  { timestamp: '2023-10-26 10:01:22', user: 'User Beta', module: 'BillingModule', action: 'Payment processing failed', details: 'Reason: Insufficient funds', level: 'ERROR', type: 'Audit', stateBefore: '{ "balance": 10 }', stateAfter: '{ "balance": 10, "attempted": 50 }' },
  { timestamp: '2023-10-26 10:02:05', user: 'Agent Gamma', module: 'DataSync', action: 'Data sync initiated', details: 'Source: CRM, Target: Warehouse', level: 'INFO', type: 'System', stateBefore: '{}', stateAfter: '{}' },
  { timestamp: '2023-10-26 10:03:40', user: 'System', module: 'Kernel', action: 'Security patch CVE-2023-XXXX applied', details: 'Reboot scheduled', level: 'WARN', type: 'Security', stateBefore: '{ "patched": false }', stateAfter: '{ "patched": true }' },
  { timestamp: '2023-10-26 10:05:00', user: 'Agent Alpha', module: 'OptimizerPrime', action: 'Optimization task started for Project Gamma.', details: 'Using v2 algorithm.', level: 'INFO', type: 'Agent', stateBefore: '{}', stateAfter: '{}'},
  { timestamp: '2023-10-26 10:05:30', user: 'User Delta', module: 'FileVault', action: 'File upload failed: Q4_Review.docx', details: 'Error: Network timeout.', level: 'ERROR', type: 'UserSession', stateBefore: '{}', stateAfter: '{}'},
  { timestamp: '2023-10-26 10:06:00', user: 'Agent SecureGuard', module: 'Firewall', action: 'Blocked suspicious IP: 203.0.113.45', details: 'Attempted RDP access.', level: 'CRITICAL', type: 'Security', stateBefore: '{}', stateAfter: '{ "blocked_ips": ["203.0.113.45"] }' },
];

function LogStreamFilterContent(): ReactNode { 
  const [logEntries, setLogEntries] = useState(initialLogEntries);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [lastSummarizedLogCount, setLastSummarizedLogCount] = useState<number>(0);

  const handleSummarizeLogs = async () => {
    setIsSummarizing(true);
    setAiSummary(null);
    setSummaryError(null);
    try {
      const logsString = logEntries.map(log => 
        `${log.timestamp} [${log.level}] (${log.type}) ${log.user} (${log.module}): ${log.action} - ${log.details}`
      ).join('\n');
      
      if (!logsString.trim()) {
        setSummaryError("No logs to summarize.");
        setIsSummarizing(false);
        return;
      }
      const input: SummarizeLogsInput = { logs: logsString };
      const result = await summarizeLogs(input);
      setAiSummary(result.summary);
      setLastSummarizedLogCount(logEntries.length);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
      setSummaryError(errorMsg);
      console.error("Error summarizing logs:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => {
    if (logEntries.length !== lastSummarizedLogCount && aiSummary) {
        // Summary might be outdated
    }
  }, [logEntries, lastSummarizedLogCount, aiSummary]);


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3 border-b">
        <div className="flex flex-wrap gap-2 items-center">
            <Input type="text" placeholder="Search logs (keywords, user, module...)" className="flex-grow min-w-[200px] bg-background border-input focus:ring-primary h-8 text-sm" />
            <Select>
            <SelectTrigger className="w-full md:w-[130px] bg-background border-input focus:ring-primary h-8 text-xs">
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
            <SelectTrigger className="w-full md:w-[110px] bg-background border-input focus:ring-primary h-8 text-xs">
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
            <Input type="date" placeholder="Date" className="w-full md:w-[120px] bg-background border-input focus:ring-primary h-8 text-xs"/>
            <Button variant="outline" size="sm" className="h-8 text-xs"><Filter className="mr-1.5 h-3.5 w-3.5" />Apply Filters</Button>
            <Button onClick={handleSummarizeLogs} disabled={isSummarizing} variant="outline" size="sm" className="text-primary border-primary/50 hover:bg-primary/10 h-8 text-xs">
            {isSummarizing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
            AI Summary
            </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2 flex-grow overflow-hidden flex flex-col">
        <Card className="mb-2 bg-background/70 backdrop-blur-sm shadow-md">
            <CardHeader className="p-2">
                <CardTitle className="font-headline text-sm text-primary flex items-center">
                    <Sparkles className="h-4 w-4 mr-1.5" />AI Log Summary
                </CardTitle>
                {logEntries.length !== lastSummarizedLogCount && aiSummary && (
                     <CardDescription className="text-xs text-yellow-500">Log view has changed since last summary.</CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-2 min-h-[40px]">
                {isSummarizing && <div className="flex items-center text-muted-foreground text-xs"><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Generating summary...</div>}
                {summaryError && <p className="text-destructive text-xs">Error: {summaryError}</p>}
                {aiSummary && !isSummarizing && <p className="text-xs text-foreground whitespace-pre-wrap">{aiSummary}</p>}
                {!aiSummary && !isSummarizing && !summaryError && <p className="text-xs text-muted-foreground">Click "AI Summary" to generate insights from the current log view.</p>}
            </CardContent>
        </Card>
        
        <ScrollArea className="flex-grow">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[150px] text-xs"><CalendarDays className="inline h-3.5 w-3.5 mr-1" />Timestamp</TableHead>
                <TableHead className="text-xs"><User className="inline h-3.5 w-3.5 mr-1" />User/Agent</TableHead>
                <TableHead className="text-xs"><Cpu className="inline h-3.5 w-3.5 mr-1" />Module</TableHead>
                <TableHead className="text-xs">Action</TableHead>
                <TableHead className="text-xs">Details</TableHead>
                <TableHead className="text-xs">Level</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs text-center">View</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logEntries.map((log, i) => (
                <TableRow 
                    key={i} 
                    className={cn(
                        log.level === 'CRITICAL' && 'bg-destructive/30 hover:bg-destructive/40 border-l-4 border-destructive', 
                        log.level === 'ERROR' && !log.action.toLowerCase().includes('failed') && 'bg-destructive/10 hover:bg-destructive/20',
                        log.level === 'ERROR' && log.action.toLowerCase().includes('failed') && 'bg-destructive/15 hover:bg-destructive/25 border-l-2 border-destructive/70',
                        log.level === 'WARN' && 'bg-yellow-500/10 hover:bg-yellow-500/20',
                        log.type === 'Security' && log.level === 'CRITICAL' && 'border-l-4 border-destructive font-semibold',
                    )}
                >
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-1.5">{log.timestamp}</TableCell>
                    <TableCell className="font-medium text-foreground whitespace-nowrap text-xs py-1.5">{log.user}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap text-xs py-1.5">{log.module}</TableCell>
                    <TableCell className="text-foreground text-xs py-1.5">{log.action}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate py-1.5" title={log.details}>{log.details}</TableCell>
                    <TableCell className="py-1.5">
                    <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                        log.level === 'INFO' && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                        log.level === 'WARN' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                        log.level === 'ERROR' && "bg-red-500/10 text-red-700 dark:text-red-400",
                        log.level === 'CRITICAL' && "bg-red-700/20 text-red-800 dark:text-red-300"
                    )}>{log.level}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-1.5">{log.type}</TableCell>
                    <TableCell className="text-xs text-center py-1.5">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Eye className="h-3.5 w-3.5"/></Button>
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
    <Card className="h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Event Timeline &amp; State Diff</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Replay critical action: 'Payment processing failed' (User Beta).</CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-center">
        <Image src="https://placehold.co/600x300.png" alt="Event Timeline with State Diff" width={600} height={300} className="rounded-md border" data-ai-hint="gantt chart events state comparison" />
        <div className="flex gap-2 mt-2 justify-center">
          <Button variant="outline" size="sm"><PlaySquare className="mr-1.5 h-3.5 w-3.5"/>Play</Button>
          <Button variant="outline" size="sm">Step Back</Button>
          <Button variant="outline" size="sm">Step Forward</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Red alert trigger zones are highlighted on timeline.</p>
      </CardContent>
    </Card>
  );
}

function UserSessionDetailsContent(): ReactNode { 
  return (
    <Card className="h-full">
        <CardHeader className="p-3">
            <CardTitle className="text-md font-semibold font-headline text-foreground">User Session: <span className="text-primary">User Beta</span></CardTitle>
            <CardDescription className="text-xs text-muted-foreground">ID: sess_userbeta_xyz789</CardDescription>
        </CardHeader>
        <CardContent className="p-3 text-xs space-y-1">
            <p><span className="font-semibold">Start Time:</span> 2023-10-26 10:01:00</p>
            <p><span className="font-semibold">Duration:</span> 45 minutes</p>
            <p><span className="font-semibold">IP Address:</span> 198.51.100.12</p>
            <p><span className="font-semibold">Key Actions:</span> Viewed Billing, Attempted Payment, Logged Out.</p>
            <p><span className="font-semibold">Agent Interactions:</span> DataMinerX (Viewed Report), BillingAgent (Payment Attempt)</p>
            <Image src="https://placehold.co/300x200.png" alt="User Activity Heatmap" width={300} height={200} className="rounded-md mt-2 mx-auto border" data-ai-hint="activity heatmap user clicks" />
      </CardContent>
    </Card>
  );
}

export default function LogsAuditPage() {
  const logsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'logStreamFilter',
      title: 'Log Explorer & AI Summary', 
      icon: <ListFilter className="w-5 h-5" />,
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
      icon: <Repeat className="w-5 h-5" />,
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
      icon: <Users className="w-5 h-5" />,
      content: <UserSessionDetailsContent />,
      defaultLayout: {
        lg: { x: 8, y: 12, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 6, y: 12, w: 4, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 7, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={logsPageZoneConfigs}
      className="flex-grow"
       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
