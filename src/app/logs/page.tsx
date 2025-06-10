import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, CalendarDays, User, Cpu, Filter, AlertTriangle, Layers } from 'lucide-react';
import Image from 'next/image';

const logEntries = [
  { timestamp: '2023-10-26 10:00:15', user: 'Agent Alpha', module: 'AuthService', action: 'User login successful', details: 'IP: 192.168.1.100', level: 'INFO' },
  { timestamp: '2023-10-26 10:01:22', user: 'User Beta', module: 'BillingModule', action: 'Payment processing failed', details: 'Reason: Insufficient funds', level: 'ERROR' },
  { timestamp: '2023-10-26 10:02:05', user: 'Agent Gamma', module: 'DataSync', action: 'Data sync initiated', details: 'Source: CRM, Target: Warehouse', level: 'INFO' },
  { timestamp: '2023-10-26 10:03:40', user: 'System', module: 'Kernel', action: 'Security patch applied', details: 'CVE-2023-XXXX', level: 'WARN' },
];

export default function LogsAuditPage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Zone title="Log Stream & Filter" icon={<FileText className="w-5 h-5" />} className="lg:col-span-3">
        <div className="flex flex-wrap gap-2 mb-4 p-2 border-b border-border/50">
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
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><CalendarDays className="inline h-4 w-4 mr-1" />Timestamp</TableHead>
                <TableHead><User className="inline h-4 w-4 mr-1" />User/Agent</TableHead>
                <TableHead><Cpu className="inline h-4 w-4 mr-1" />Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logEntries.map((log, i) => (
                <TableRow key={i} className={log.level === 'ERROR' ? 'bg-destructive/10' : log.level === 'WARN' ? 'bg-yellow-500/10' : ''}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell className="font-medium text-foreground whitespace-nowrap">{log.user}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{log.module}</TableCell>
                  <TableCell className="text-foreground">{log.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Zone>

      <Zone title="Visual Diff of Critical Action" icon={<Layers className="w-5 h-5" />} className="lg:col-span-2">
        <p className="text-sm text-muted-foreground mb-2">State before/after action: 'Security patch applied'</p>
        <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
           <Image src="https://placehold.co/600x300.png" alt="Visual Diff" width={600} height={300} className="rounded-md" data-ai-hint="code diff comparison"/>
        </div>
      </Zone>

      <Zone title="Red Alert Trigger Zones" icon={<AlertTriangle className="w-5 h-5 text-destructive" />}>
        <p className="text-sm text-muted-foreground mb-2">Visual representation of critical system alerts.</p>
        <div className="h-64 bg-destructive/10 rounded-md flex items-center justify-center p-4">
          <Image src="https://placehold.co/300x200.png" alt="Alert Zones" width={300} height={200} className="rounded-md" data-ai-hint="map alerts"/>
        </div>
      </Zone>
    </div>
  );
}
