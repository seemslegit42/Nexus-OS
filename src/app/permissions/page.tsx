// src/app/import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";ermissions/page.tsx
'use client';

import type { ReactNode } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  ShieldWarning as ShieldQuestion,
  ShieldCheck,
  UserCheck,
  Eye,
  FloppyDisk as Save,
  GitMerge as GitCompareArrows,
  MagnifyingGlass as Search,
  FunnelSimple as Filter,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

const roles = [
  'Admin',
  'Developer',
  'Analyst',
  'AgentManager',
  'Agent_DataMinerX',
  'User_Guest',
];
const resources = [
  'LoomStudio:view',
  'AgentConsole:edit',
  'BillingModule:read',
  'FileVault:sensitive_data',
  'Command:execute_high_priv',
  'SecurityLogs:view',
  'Modules:deploy',
];

const permissionsData = roles.map(role => ({
  role,
  permissions: resources.map(resource => {
    if (role === 'Admin') return true;
    if (role.startsWith('Agent_') && resource.includes('sensitive_data'))
      return false;
    if (
      role === 'Developer' &&
      (resource.includes('LoomStudio') ||
        resource.includes('AgentConsole') ||
        resource.includes('Modules:deploy'))
    )
      return true;
    if (
      role === 'Analyst' &&
      (resource.includes('BillingModule') ||
        resource.includes('SecurityLogs:view'))
    )
      return true;
    if (role === 'AgentManager' && resource.includes('AgentConsole:edit'))
      return true;
    if (
      role === 'User_Guest' &&
      (resource.includes(':view') || resource.includes(':read'))
    )
      return Math.random() > 0.8;
    return Math.random() > 0.6;
  }),
}));

function VisualMatrixContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="border-b border-border/60 p-2 md:p-3">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <Input
            placeholder="Filter roles or resources..."
            className="h-9 border-input bg-input text-sm focus:ring-primary sm:max-w-xs"
          />
          <Button size="sm" className="h-9 w-full text-sm sm:w-auto">
            <Save className="mr-2 h-4 w-4" /> Save Permissions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="sticky left-0 z-10 w-[150px] bg-card p-2 text-xs backdrop-blur-sm">
                  Role/Agent
                </TableHead>
                {resources.map(res => (
                  <TableHead
                    key={res}
                    className="min-w-[100px] p-1 text-center text-xs"
                  >
                    {res.split(':')[0]}
                    <br />
                    <span className="text-xs font-normal text-muted-foreground">
                      ({res.split(':')[1]})
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsData.map(row => (
                <TableRow
                  key={row.role}
                  className="border-border/60 hover:bg-muted/30"
                >
                  <TableCell className="sticky left-0 z-10 bg-card px-2 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
                    {row.role}
                  </TableCell>
                  {row.permissions.map((perm, i) => (
                    <TableCell key={`perm-${i}`} className="py-1.5 text-center">
                      <Checkbox
                        checked={perm}
                        aria-label={`${row.role} access to ${resources[i]}`}
                        className="h-3.5 w-3.5"
                      />
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
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Trace & Compare Access
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Investigate 'who has access to what' or compare entities.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 p-2 md:p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Label
              htmlFor="trace-entity1"
              className="text-xs text-muted-foreground"
            >
              Entity 1 (Role, Agent, Resource)
            </Label>
            <Input
              id="trace-entity1"
              placeholder="e.g., Developer or FileVault:sensitive_data"
              className="mt-0.5 h-9 border-input bg-input text-sm focus:ring-primary"
            />
          </div>
          <div>
            <Label
              htmlFor="trace-entity2"
              className="text-xs text-muted-foreground"
            >
              Entity 2 (Optional for Compare)
            </Label>
            <Input
              id="trace-entity2"
              placeholder="e.g., Analyst"
              className="mt-0.5 h-9 border-input bg-input text-sm focus:ring-primary"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full bg-card text-sm hover:bg-muted/60"
        >
          <Search className="mr-2 h-4 w-4" />
          Trace / Compare
        </Button>
        <div className="mt-2 min-h-[150px] flex-grow rounded-md border border-border/50 bg-muted/20 p-2">
          <Image
            src="https://placehold.co/600x300.png"
            alt="Access Trace Visual Graph / Comparison View"
            width={600}
            height={300}
            className="rounded-md opacity-70"
            data-ai-hint="graph relationship diagram comparison list"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SimulateBreachEscalationContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Security Scenario Simulation
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Test posture by simulating breaches or escalations based on current
          RBAC/ZBAC.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 p-2 md:p-3">
        <Image
          src="https://placehold.co/600x300.png"
          alt="Breach Simulation Control Panel"
          width={600}
          height={300}
          className="rounded-md border border-border/60 opacity-70"
          data-ai-hint="security test scenario controls parameters"
        />
      </CardContent>
      <CardFooter className="flex gap-3 border-t border-border/60 p-2 md:p-3">
        <Button variant="destructive" className="flex-1" size="sm">
          Simulate Breach Scenario
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-card hover:bg-muted/60"
          size="sm"
        >
          Test Escalation Path
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PermissionsPage() {
  const permissionsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'visualMatrixControls',
      title: 'RBAC & ZBAC Visual Matrix Editor',
      icon: <Filter className="h-4 w-4" />,
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
      icon: <GitCompareArrows className="h-4 w-4" />,
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
      icon: <ShieldQuestion className="h-4 w-4" />,
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
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
