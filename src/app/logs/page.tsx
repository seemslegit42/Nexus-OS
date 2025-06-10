
// src/app/logs/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CalendarDays, User, Cpu, Filter, AlertTriangle, Layers, Sparkles, Loader2, PlaySquare, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { summarizeLogs, type SummarizeLogsInput } from '@/ai/flows/summarize-logs';
import { cn } from '@/lib/utils'; // For cn utility

const initialLogEntries = [
  { timestamp: '2023-10-26 10:00:15', user: 'Agent Alpha', module: 'AuthService', action: 'User login successful', details: 'IP: 192.168.1.100', level: 'INFO', type: 'Security' },
  { timestamp: '2023-10-26 10:01:22', user: 'User Beta', module: 'BillingModule', action: 'Payment processing failed', details: 'Reason: Insufficient funds', level: 'ERROR', type: 'Audit' },
  { timestamp: '2023-10-26 10:02:05', user: 'Agent Gamma', module: 'DataSync', action: 'Data sync initiated', details: 'Source: CRM, Target: Warehouse', level: 'INFO', type: 'System' },
  { timestamp: '2023-10-26 10:03:40', user: 'System', module: 'Kernel', action: 'Security patch applied', details: 'CVE-2023-XXXX', level: 'WARN', type: 'Security' },
  { timestamp: '2023-10-26 10:05:00', user: 'Agent Alpha', module: 'OptimizerPrime', action: 'Optimization task started for Project Gamma.', details: 'Using v2 algorithm.', level: 'INFO', type: 'Agent'},
  { timestamp: '2023-10-26 10:05:30', user: 'User Delta', module: 'FileVault', action: 'File upload failed: Q4_Review.docx', details: 'Error: Network timeout.', level: 'ERROR', type: 'UserSession'},
];

function LogStreamFilterContent(): ReactNode {
  const [logEntries, setLogEntries] = useState(initialLogEntries);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
      setSummaryError(errorMsg);
      console.error("Error summarizing logs:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 p-2 border-b border-border/50 items-center">
        <Input type="text" placeholder="Search logs..." className="flex-grow min-w-[150px] bg-background border-input focus:ring-primary" />
        <Select>
          <SelectTrigger className="w-full md:w-[150px] bg-background border-input focus:ring-primary">
            <SelectValue placeholder="Log Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Logs</SelectItem>
            <SelectItem value="security">Security Logs</SelectItem>
            <SelectItem value="usersession">User Sessions</SelectItem>
            <SelectItem value="audit">Audit Trails</SelectItem>
            <SelectItem value="agent">Agent Logs</SelectItem>
            <SelectItem value="system">System Logs</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[150px] bg-background border-input focus:ring-primary">
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
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Apply</Button>
        <Button onClick={handleSummarizeLogs} disabled={isSummarizing} variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
          {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          AI Summary
        </Button>
      </div>

      {(isSummarizing || aiSummary || summaryError) && (
        <Card className="mb-4 bg-background/70 backdrop-blur-sm">
          <CardHeader><CardTitle className="font-headline text-md text-primary flex items-center"><Sparkles className="h-5 w-5 mr-2" />AI Log Summary</CardTitle></CardHeader>
          <CardContent>
            {isSummarizing && <div className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</div>}
            {summaryError && <p className="text-destructive">{summaryError}</p>}
            {aiSummary && <p className="text-sm text-foreground whitespace-pre-wrap">{aiSummary}</p>}
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><CalendarDays className="inline h-4 w-4 mr-1" />Timestamp</TableHead>
              <TableHead><User className="inline h-4 w-4 mr-1" />User/Agent</TableHead>
              <TableHead><Cpu className="inline h-4 w-4 mr-1" />Module</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logEntries.map((log, i) => (
              <TableRow key={i} className={cn(log.level === 'CRITICAL' && 'bg-destructive/20', log.level === 'ERROR' && 'bg-destructive/10', log.level === 'WARN' && 'bg-yellow-500/10')}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                <TableCell className="font-medium text-foreground whitespace-nowrap">{log.user}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{log.module}</TableCell>
                <TableCell className="text-foreground">{log.action}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={log.details}>{log.details}</TableCell>
                <TableCell>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",
                    log.level === 'INFO' && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                    log.level === 'WARN' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                    log.level === 'ERROR' && "bg-red-500/10 text-red-700 dark:text-red-400",
                    log.level === 'CRITICAL' && "bg-red-700/20 text-red-800 dark:text-red-300"
                  )}>{log.level}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{log.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function EventTimelineContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Replayable event timeline for 'User Login Anomaly - IP: 203.0.113.45'.</p>
      <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
        <Image src="https://placehold.co/600x300.png" alt="Event Timeline" width={600} height={300} className="rounded-md" data-ai-hint="gantt chart events" />
      </div>
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm">Play</Button>
        <Button variant="outline" size="sm">Step Back</Button>
        <Button variant="outline" size="sm">Step Forward</Button>
      </div>
    </>
  );
}

function UserSessionDetailsContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Details for session ID: sess_userbeta_xyz789</p>
      <div className="p-3 bg-background/50 rounded-md text-xs space-y-1">
        <p><span className="font-semibold">User:</span> User Beta</p>
        <p><span className="font-semibold">Start Time:</span> 2023-10-26 10:01:00</p>
        <p><span className="font-semibold">Duration:</span> 45 minutes</p>
        <p><span className="font-semibold">IP Address:</span> 198.51.100.12</p>
        <p><span className="font-semibold">Key Actions:</span> Viewed Billing, Attempted Payment, Logged Out.</p>
      </div>
      <Image src="https://placehold.co/300x200.png" alt="User Activity Heatmap" width={300} height={200} className="rounded-md mt-2 mx-auto" data-ai-hint="activity heatmap user" />
    </>
  );
}

export default function LogsAuditPage() {
  const logsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'logStreamFilter',
      title: 'Security Logs, Audit Trails & System Events', // Updated title
      icon: <FileText className="w-5 h-5" />,
      content: <LogStreamFilterContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 8 },
        md: { x: 0, y: 0, w: 10, h: 12, minW: 5, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 6 },
      },
    },
    {
      id: 'eventTimeline', // New ID
      title: 'Replayable Event Timeline', // New title
      icon: <PlaySquare className="w-5 h-5" />,
      content: <EventTimelineContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 8, h: 8, minW: 4, minH: 5 },
        md: { x: 0, y: 12, w: 6, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 10, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'userSessionDetails', // New ID
      title: 'User Session Details', // New title
      icon: <User className="w-5 h-5" />,
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
    />
  );
}

    