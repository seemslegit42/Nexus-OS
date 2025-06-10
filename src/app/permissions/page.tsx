// src/app/permissions/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, ShieldQuestion, Columns, UserCheck } from 'lucide-react';
import Image from 'next/image';

const roles = ['Admin', 'Developer', 'Analyst', 'AgentManager'];
const modules = ['AuthService', 'BillingModule', 'LoomStudio', 'AgentConsole'];
const zones = ['Dashboard', 'Settings', 'SensitiveDataView'];

const permissionsData = roles.map(role => ({
  role,
  modulePermissions: modules.map(module => Math.random() > 0.5),
  zonePermissions: zones.map(zone => Math.random() > 0.3),
}));

function VisualMatrixContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Overview of access rights across the system.</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              {modules.map(mod => <TableHead key={mod} className="text-center">{mod}</TableHead>)}
              {zones.map(zone => <TableHead key={zone} className="text-center">{zone} (Zone)</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsData.map(row => (
              <TableRow key={row.role}>
                <TableCell className="font-medium text-foreground">{row.role}</TableCell>
                {row.modulePermissions.map((perm, i) => (
                  <TableCell key={`mod-${i}`} className="text-center">
                    <Checkbox checked={perm} aria-label={`${row.role} access to ${modules[i]}`} />
                  </TableCell>
                ))}
                {row.zonePermissions.map((perm, i) => (
                  <TableCell key={`zone-${i}`} className="text-center">
                    <Checkbox checked={perm} aria-label={`${row.role} access to ${zones[i]}`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" className="mt-4">Edit Permissions</Button>
    </>
  );
}

function TraceAccessContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Investigate who has access to what and why.</p>
      <Image src="https://placehold.co/600x300.png" alt="Access Trace Visual" width={600} height={300} className="rounded-md" data-ai-hint="graph relationship diagram" />
      <Button variant="outline" className="w-full mt-4">Start Trace</Button>
    </>
  );
}

function SimulateBreachEscalationContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Test security posture by simulating scenarios.</p>
      <Image src="https://placehold.co/600x300.png" alt="Breach Simulation" width={600} height={300} className="rounded-md" data-ai-hint="security test scenario" />
      <div className="flex gap-2 mt-4">
        <Button variant="destructive" className="flex-1">Simulate Breach</Button>
        <Button variant="outline" className="flex-1">Simulate Escalation</Button>
      </div>
    </>
  );
}

function CompareAgentsUsersContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Side-by-side comparison of permissions for different entities.</p>
      <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
        <Image src="https://placehold.co/800x300.png" alt="Split View Comparison" width={800} height={300} className="rounded-md" data-ai-hint="comparison table interface" />
      </div>
    </>
  );
}


export default function PermissionsPage() {
  const permissionsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'visualMatrix',
      title: 'Visual Matrix: Roles × Modules × Zones',
      icon: <Columns className="w-5 h-5" />,
      content: <VisualMatrixContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 10, minW: 6, minH: 6 },
        md: { x: 0, y: 0, w: 10, h: 10, minW: 5, minH: 6 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
      },
    },
    {
      id: 'traceAccess',
      title: 'Trace Access',
      icon: <UserCheck className="w-5 h-5" />,
      content: <TraceAccessContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 6, h: 9, minW: 4, minH: 5 },
        md: { x: 0, y: 10, w: 5, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    {
      id: 'simulateBreachEscalation',
      title: 'Simulate Breach / Escalation',
      icon: <ShieldQuestion className="w-5 h-5" />,
      content: <SimulateBreachEscalationContent />,
      defaultLayout: {
        lg: { x: 6, y: 10, w: 6, h: 9, minW: 4, minH: 5 },
        md: { x: 5, y: 10, w: 5, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    {
      id: 'compareAgentsUsers',
      title: 'Compare Agents/Users (Split View)',
      icon: <Users className="w-5 h-5" />,
      content: <CompareAgentsUsersContent />,
      defaultLayout: {
        lg: { x: 0, y: 19, w: 12, h: 8, minW: 6, minH: 5 },
        md: { x: 0, y: 19, w: 10, h: 8, minW: 5, minH: 5 },
        sm: { x: 0, y: 25, w: 6, h: 7, minW: 4, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={permissionsPageZoneConfigs}
      className="flex-grow"
    />
  );
}
