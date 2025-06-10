
// src/app/permissions/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, ShieldQuestion, ShieldCheck, UserCheck, Eye, Save } from 'lucide-react'; // ShieldCheck used for Role-based controls
import Image from 'next/image';
import { Input } from '@/components/ui/input'; // For Trace Access input

const roles = ['Admin', 'Developer', 'Analyst', 'AgentManager', 'Agent_DataMinerX'];
const resources = ['LoomStudio:view', 'AgentConsole:edit', 'BillingModule:read', 'FileVault:sensitive_data', 'Command:execute_high_priv'];

// Generate more realistic sparse permissions
const permissionsData = roles.map(role => ({
  role,
  permissions: resources.map(resource => {
    if (role === 'Admin') return true;
    if (role.startsWith('Agent_') && resource.includes('sensitive_data')) return false; // Agents shouldn't access sensitive data by default
    if (role === 'Developer' && (resource.includes('LoomStudio') || resource.includes('AgentConsole'))) return true;
    if (role === 'Analyst' && resource.includes('BillingModule')) return true;
    return Math.random() > 0.7; // Generally restrictive
  }),
}));

function VisualMatrixContent(): ReactNode {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-muted-foreground">Visual matrix of Role-Based Access Controls (RBAC) and Zone-Based Access Controls (ZBAC).</p>
        <Button><Save className="mr-2 h-4 w-4"/> Save Changes</Button>
      </div>
      <div className="overflow-x-auto max-h-[calc(100vh_-_200px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card z-10">Role/Agent</TableHead>
              {resources.map(res => <TableHead key={res} className="text-center min-w-[120px]">{res.split(':')[0]}<br/><span className="text-xs font-normal text-muted-foreground">({res.split(':')[1]})</span></TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsData.map(row => (
              <TableRow key={row.role}>
                <TableCell className="font-medium text-foreground sticky left-0 bg-card z-10">{row.role}</TableCell>
                {row.permissions.map((perm, i) => (
                  <TableCell key={`perm-${i}`} className="text-center">
                    <Checkbox checked={perm} aria-label={`${row.role} access to ${resources[i]}`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function TraceAccessContent(): ReactNode {
  return (
    <div className="p-1 space-y-3">
      <p className="text-sm text-muted-foreground mb-2">Investigate 'who has access to what' or 'what resource can this role/agent access'.</p>
      <div className="flex gap-2">
        <Input placeholder="Enter Role, Agent, or Resource ID" className="bg-background border-input focus:ring-primary" />
        <Button variant="outline"><Eye className="mr-2 h-4 w-4"/>Trace</Button>
      </div>
      <Image src="https://placehold.co/600x300.png" alt="Access Trace Visual Graph" width={600} height={300} className="rounded-md" data-ai-hint="graph relationship diagram access" />
    </div>
  );
}

function SimulateBreachEscalationContent(): ReactNode { // Content for RBAC/ZBAC simulation also
  return (
    <div className="p-1 space-y-3">
      <p className="text-sm text-muted-foreground mb-2">Test security posture by simulating scenarios, including RBAC/ZBAC configurations.</p>
      <Image src="https://placehold.co/600x300.png" alt="Breach Simulation Control Panel" width={600} height={300} className="rounded-md" data-ai-hint="security test scenario controls" />
      <div className="flex gap-2 mt-4">
        <Button variant="destructive" className="flex-1">Simulate Breach</Button>
        <Button variant="outline" className="flex-1">Test Escalation Path</Button>
      </div>
    </div>
  );
}


export default function PermissionsPage() {
  const permissionsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'visualMatrixControls', // Changed ID
      title: 'Role-Based & Zone-Based Access Controls (Visual Matrix)', // Updated Title
      icon: <ShieldCheck className="w-5 h-5" />, // Updated Icon
      content: <VisualMatrixContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 7 },
        md: { x: 0, y: 0, w: 10, h: 12, minW: 5, minH: 7 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 6 },
      },
    },
    {
      id: 'traceAccess',
      title: 'Trace Access & Permissions', // Updated Title
      icon: <UserCheck className="w-5 h-5" />,
      content: <TraceAccessContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 6, h: 9, minW: 4, minH: 5 },
        md: { x: 0, y: 12, w: 5, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    {
      id: 'rbacZbacSimulation', // Updated ID
      title: 'Simulate Breach / Escalation (RBAC/ZBAC Test)', // Updated Title
      icon: <ShieldQuestion className="w-5 h-5" />,
      content: <SimulateBreachEscalationContent />,
      defaultLayout: {
        lg: { x: 6, y: 12, w: 6, h: 9, minW: 4, minH: 5 },
        md: { x: 5, y: 12, w: 5, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 18, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    // The "Compare Agents/Users" was in the original, but the prompt asks for RBAC/ZBAC simulation.
    // The SimulateBreachEscalationContent can cover this. If a dedicated compare view is still needed, it can be added.
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={permissionsPageZoneConfigs}
      className="flex-grow"
    />
  );
}

    