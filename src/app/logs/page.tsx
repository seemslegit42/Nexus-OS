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
import { FileText, CalendarDays, User, Cpu, Filter, AlertTriangle, Layers, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { summarizeLogs, type SummarizeLogsInput } from '@/ai/flows/summarize-logs';

const initialLogEntries = [
  { timestamp: '2023-10-26 10:00:15', user: 'Agent Alpha', module: 'AuthService', action: 'User login successful', details: 'IP: 192.168.1.100', level: 'INFO' },
  { timestamp: '2023-10-26 10:01:22', user: 'User Beta', module: 'BillingModule', action: 'Payment processing failed', details: 'Reason: Insufficient funds', level: 'ERROR' },
  { timestamp: '2023-10-26 10:02:05', user: 'Agent Gamma', module: 'DataSync', action: 'Data sync initiated', details: 'Source: CRM, Target: Warehouse', level: 'INFO' },
  { timestamp: '2023-10-26 10:03:40', user: 'System', module: 'Kernel', action: 'Security patch applied', details: 'CVE-2023-XXXX', level: 'WARN' },
  { timestamp: '2023-10-26 10:05:00', user: 'Agent Alpha', module: 'OptimizerPrime', action: 'Optimization task started for Project Gamma.', details: 'Using v2 algorithm.', level: 'INFO'},
  { timestamp: '2023-10-26 10:05:30', user: 'User Delta', module: 'FileVault', action: 'File upload failed: Q4_Review.docx', details: 'Error: Network timeout.', level: 'ERROR'},
  { timestamp: '2023-10-26 10:06:15', user: 'System', module: 'Kernel', action: 'Routine maintenance window started.', details: 'Expected duration: 30 mins.', level: 'INFO'},
  { timestamp: '2023-10-26 10:07:00', user: 'Agent SecureGuard', module: 'SecurityMonitor', action: 'Potential SQL injection attempt detected.', details: 'Source IP: 10.0.5.12, Query: SELECT * FROM users WHERE id = \'1 OR 1=1\'', level: 'CRITICAL'},
];

function LogStreamFilterContent(): ReactNode {
  const [logEntries, setLogEntries] = useState(initialLogEntries); // Example: use state for dynamic logs
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleSummarizeLogs = async () => {
    setIsSummarizing(true);
    setAiSummary(null);
    setSummaryError(null);

    try {
      // Simple stringification for now. For large logs, consider truncation or sampling.
      const logsString = logEntries.map(log => 
        `${log.timestamp} [${log.level}] ${log.user} (${log.module}): ${log.action} - ${log.details}`
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
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred while summarizing logs.';
      setSummaryError(errorMsg);
      console.error("Error summarizing logs:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 p-2 border-b border-border/50 items-center">
        <Input type="text" placeholder="Search logs..." className="flex-grow min-w-[200px] bg-background border-input focus:ring-primary" />
        <Select>
          <SelectTrigger className="w-full md:w-[180px] bg-background border-input focus:ring-primary">
            <SelectValue placeholder="Filter by User/Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user-alpha">User Alpha</SelectItem>
            <SelectItem value="agent-beta">Agent Beta</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[180px] bg-background border-input focus:ring-primary">
            <SelectValue placeholder="Filter by Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auth">AuthService</SelectItem>
            <SelectItem value="billing">BillingModule</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[180px] bg-background border-input focus:ring-primary">
            <SelectValue placeholder="Filter by Security Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">INFO</SelectItem>
            <SelectItem value="warn">WARN</SelectItem>
            <SelectItem value="error">ERROR</SelectItem>
            <SelectItem value="critical">CRITICAL</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Apply Filters</Button>
        <Button onClick={handleSummarizeLogs} disabled={isSummarizing} variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
          {isSummarizing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Summarize with AI
        </Button>
      </div>

      {(isSummarizing || aiSummary || summaryError) && (
        <Card className="mb-4 bg-background/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-md text-primary flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              AI Log Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSummarizing && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating summary...
              </div>
            )}
            {summaryError && (
              <p className="text-destructive">{summaryError}</p>
            )}
            {aiSummary && (
              <p className="text-sm text-foreground whitespace-pre-wrap">{aiSummary}</p>
            )}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {logEntries.map((log, i) => (
              <TableRow 
                key={i} 
                className={
                  log.level === 'CRITICAL' ? 'bg-destructive/20 hover:bg-destructive/30' : 
                  log.level === 'ERROR' ? 'bg-destructive/10 hover:bg-destructive/20' : 
                  log.level === 'WARN' ? 'bg-yellow-500/10 hover:bg-yellow-500/20' : ''
                }
              >
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                <TableCell className="font-medium text-foreground whitespace-nowrap">{log.user}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{log.module}</TableCell>
                <TableCell className="text-foreground">{log.action}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={log.details}>{log.details}</TableCell>
                <TableCell>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",
                    log.level === 'INFO' && "bg-blue-500/10 text-blue-700",
                    log.level === 'WARN' && "bg-yellow-500/10 text-yellow-700",
                    log.level === 'ERROR' && "bg-red-500/10 text-red-700",
                    log.level === 'CRITICAL' && "bg-red-700/20 text-red-800"
                  )}>
                    {log.level}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function VisualDiffContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">State before/after action: 'Security patch applied'</p>
      <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
        <Image src="https://placehold.co/600x300.png" alt="Visual Diff" width={600} height={300} className="rounded-md" data-ai-hint="code diff comparison" />
      </div>
    </>
  );
}

function RedAlertTriggerZonesContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Visual representation of critical system alerts.</p>
      <div className="h-64 bg-destructive/10 rounded-md flex items-center justify-center p-4">
        <Image src="https://placehold.co/300x200.png" alt="Alert Zones" width={300} height={200} className="rounded-md" data-ai-hint="map alerts" />
      </div>
    </>
  );
}

export default function LogsAuditPage() {
  const logsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'logStreamFilter',
      title: 'Log Stream & Filter',
      icon: <FileText className="w-5 h-5" />,
      content: <LogStreamFilterContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 8 },
        md: { x: 0, y: 0, w: 10, h: 12, minW: 5, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 6 },
      },
    },
    {
      id: 'visualDiffCriticalAction',
      title: 'Visual Diff of Critical Action',
      icon: <Layers className="w-5 h-5" />,
      content: <VisualDiffContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 8, h: 8, minW: 4, minH: 5 },
        md: { x: 0, y: 12, w: 6, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 10, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'redAlertTriggerZones',
      title: 'Red Alert Trigger Zones',
      icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
      content: <RedAlertTriggerZonesContent />,
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

