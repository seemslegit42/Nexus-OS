
// src/app/permissions/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, ShieldQuestion, ShieldCheck, UserCheck, Eye, Save, GitCompareArrows, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

const roles = ['Admin', 'Developer', 'Analyst', 'AgentManager', 'Agent_DataMinerX', 'User_Guest'];
const resources = ['LoomStudio:view', 'AgentConsole:edit', 'BillingModule:read', 'FileVault:sensitive_data', 'Command:execute_high_priv', 'SecurityLogs:view', 'Modules:deploy'];

const permissionsData = roles.map(role => ({
  role,
  permissions: resources.map(resource => {
    if (role === 'Admin') return true;
    if (role.startsWith('Agent_') && resource.includes('sensitive_data')) return false; 
    if (role === 'Developer' && (resource.includes('LoomStudio') || resource.includes('AgentConsole') || resource.includes('Modules:deploy'))) return true;
    if (role === 'Analyst' && (resource.includes('BillingModule') || resource.includes('SecurityLogs:view'))) return true;
    if (role === 'AgentManager' && resource.includes('AgentConsole:edit')) return true;
    if (role === 'User_Guest' && (resource.includes(':view') || resource.includes(':read'))) return Math.random() > 0.8; 
    return Math.random() > 0.6; 
  }),
}));

function VisualMatrixContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <Input placeholder="Filter roles or resources..." className="h-8 text-sm sm:max-w-xs bg-background"/>
            <Button size="sm" className="h-8 text-sm w-full sm:w-auto"><Save className="mr-2 h-4 w-4"/> Save Permissions</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <Table className="min-w-full">
            <TableHeader>
                <TableRow>
                <TableHead className="sticky left-0 bg-card z-10 w-[150px] text-xs">Role/Agent</TableHead>
                {resources.map(res => <TableHead key={res} className="text-center min-w-[100px] text-xs p-1">{res.split(':')[0]}<br/><span className="text-xs font-normal text-muted-foreground">({res.split(':')[1]})</span></TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {permissionsData.map(row => (
                <TableRow key={row.role}>
                    <TableCell className="font-medium text-foreground sticky left-0 bg-card z-10 text-xs py-1.5">{row.role}</TableCell>
                    {row.permissions.map((perm, i) => (
                    <TableCell key={`perm-${i}`} className="text-center py-1.5">
                        <Checkbox checked={perm} aria-label={`${row.role} access to ${resources[i]}`} className="h-3.5 w-3.5"/>
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TraceAccessContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Trace & Compare Access</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Investigate 'who has access to what' or compare entities.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 space-y-2 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
                <Label htmlFor="trace-entity1" className="text-xs">Entity 1 (Role, Agent, Resource)</Label>
                <Input id="trace-entity1" placeholder="e.g., Developer or FileVault:sensitive_data" className="bg-background border-input focus:ring-primary h-8 text-sm"/>
            </div>
             <div>
                <Label htmlFor="trace-entity2" className="text-xs">Entity 2 (Optional for Compare)</Label>
                <Input id="trace-entity2" placeholder="e.g., Analyst" className="bg-background border-input focus:ring-primary h-8 text-sm"/>
            </div>
        </div>
        <Button variant="outline" size="sm" className="w-full h-8 text-sm"><Search className="mr-2 h-4 w-4"/>Trace / Compare</Button>
        <div className="flex-grow bg-muted/30 rounded-md p-2 mt-2 min-h-[150px]">
             <Image src="https://placehold.co/600x300.png" alt="Access Trace Visual Graph / Comparison View" width={600} height={300} className="rounded-md opacity-70" data-ai-hint="graph relationship diagram comparison list" />
        </div>
      </CardContent>
    </Card>
  );
}

function SimulateBreachEscalationContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Security Scenario Simulation</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Test posture by simulating breaches or escalations based on current RBAC/ZBAC.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 space-y-2 flex-grow">
        <Image src="https://placehold.co/600x300.png" alt="Breach Simulation Control Panel" width={600} height={300} className="rounded-md border opacity-70" data-ai-hint="security test scenario controls parameters" />
      </CardContent>
      <CardFooter className="p-3 border-t flex gap-2">
        <Button variant="destructive" className="flex-1" size="sm">Simulate Breach Scenario</Button>
        <Button variant="outline" className="flex-1" size="sm">Test Escalation Path</Button>
      </CardFooter>
    </Card>
  );
}


export default function PermissionsPage() {
  const permissionsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'visualMatrixControls',
      title: 'RBAC & ZBAC Visual Matrix Editor', 
      icon: <Filter className="w-5 h-5" />, 
      content: <VisualMatrixContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 7 },
        md: { x: 0, y: 0, w: 10, h: 12, minW: 5, minH: 7 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 6 },
      },
    },
    {
      id: 'traceAccessAndCompare', 
      title: 'Trace Access & Compare Entities', 
      icon: <GitCompareArrows className="w-5 h-5" />, 
      content: <TraceAccessContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 6, h: 9, minW: 4, minH: 5 },
        md: { x: 0, y: 12, w: 5, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    {
      id: 'simulateBreachEscalation', 
      title: 'Simulate Breach / Escalation Paths', 
      icon: <ShieldQuestion className="w-5 h-5" />,
      content: <SimulateBreachEscalationContent />,
      defaultLayout: {
        lg: { x: 6, y: 12, w: 6, h: 9, minW: 4, minH: 5 },
        md: { x: 5, y: 12, w: 5, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 18, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={permissionsPageZoneConfigs}
      className="flex-grow"
       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
