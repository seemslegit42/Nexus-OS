// src/app/security/page.tsx
'use client';

import type { ReactNode } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ShieldCheck,
  MapPin,
  Fingerprint,
  GitFork,
  PencilSimple as Edit,
  Power,
  Pulse,
  ShieldWarning as ShieldQuestion,
  Globe,
  ShareNetwork as Share2,
  Crosshair as LocateFixed,
  WarningOctagon as AlertOctagon,
  Sliders as SlidersHorizontal,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function LiveThreatAnalysisContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Live Threat Map & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-0 p-0 sm:flex-row">
        <div className="relative h-64 border-r border-border/50 bg-muted/20 sm:h-full sm:w-3/5 sm:rounded-bl-md sm:border-b sm:border-r-0">
          <Image
            src="https://placehold.co/800x400.png"
            alt="Live Threat Map with IP/Country Info"
            layout="fill"
            objectFit="cover"
            className="rounded-l-md opacity-80 sm:rounded-bl-md sm:rounded-tr-none"
            data-ai-hint="world map cyber threats ip geo"
          />
          <div className="absolute bottom-1.5 left-1.5 rounded bg-background/80 p-1.5 text-xs shadow-md backdrop-blur-sm">
            <p className="font-medium">
              Active Threats: <span className="text-destructive">3</span> (2
              High, 1 Medium)
            </p>
            <p>Sessions Monitored: 125 (Global)</p>
          </div>
        </div>
        <ScrollArea className="h-full sm:w-2/5">
          <div className="space-y-1.5 p-1.5">
            <Card className="border-destructive/50 bg-destructive/15 shadow-sm">
              <CardHeader className="p-1.5 pb-0.5">
                <CardTitle className="text-xs font-semibold text-destructive">
                  High: Brute-force on 'AuthMaster'
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5 text-xs text-destructive-foreground/80">
                IP: 203.0.113.45 (RU) | Action: IP Blocked
              </CardContent>
            </Card>
            <Card className="border-destructive/50 bg-destructive/15 shadow-sm">
              <CardHeader className="p-1.5 pb-0.5">
                <CardTitle className="text-xs font-semibold text-destructive">
                  High: DDoS on API Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5 text-xs text-destructive-foreground/80">
                Source: Multiple (VN, CN) | Action: Mitigation Active
              </CardContent>
            </Card>
            <Card className="border-yellow-500/50 bg-yellow-500/15 shadow-sm">
              <CardHeader className="p-1.5 pb-0.5">
                <CardTitle className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                  Med: Anomalous data access
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5 text-xs text-muted-foreground">
                Agent: 'DataScout' | Resource: /finance/q4 | Action: Suspended
              </CardContent>
            </Card>
            <Card className="border-blue-500/40 bg-blue-500/10 shadow-sm">
              <CardHeader className="p-1.5 pb-0.5">
                <CardTitle className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  Info: New Login from DE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5 text-xs text-muted-foreground">
                User: 'AlexR' | IP: 88.67.12.3 | Action: Monitored
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function BehavioralFingerprintContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent p-0 shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Behavioral Analysis & Trust Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-1.5 p-1.5 md:flex-row md:gap-2 md:p-2">
        <div className="flex h-1/2 items-center justify-center rounded-md border border-border/50 bg-muted/20 p-2 md:h-full md:w-1/2">
          <Image
            src="https://placehold.co/400x300.png"
            alt="Behavioral Fingerprint Chart"
            width={400}
            height={300}
            className="rounded-md object-contain opacity-70"
            data-ai-hint="user behavior anomaly chart waves"
          />
        </div>
        <div className="flex h-1/2 items-center justify-center rounded-md border border-border/50 bg-muted/20 p-2 md:h-full md:w-1/2">
          <Image
            src="https://placehold.co/400x300.png"
            alt="Visual Trust Graph"
            width={400}
            height={300}
            className="rounded-md object-contain opacity-70"
            data-ai-hint="network graph trust relationships flagged"
          />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border/60 p-2 md:p-3">
        <p className="text-xs text-muted-foreground">
          Anomalies: <span className="font-semibold text-yellow-500">2</span> |
          Risk Score:{' '}
          <span className="font-semibold text-yellow-500">Elevated</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          className="bg-card text-xs hover:bg-muted/60"
        >
          Investigate
        </Button>
      </CardFooter>
    </Card>
  );
}

function SecurityProtocolEditorContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Security Protocol Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 overflow-y-auto p-1.5 md:p-2">
        <p className="mb-1 text-xs text-muted-foreground">
          Define agent behavior thresholds and system responses.
        </p>
        {[
          {
            title: 'Login Attempt Threshold',
            details: 'Max attempts: 5. Action: Lock account for 30 mins.',
          },
          {
            title: 'Data Exfiltration Alert',
            details:
              'Threshold: >1GB/hr by single agent. Action: Notify admin, suspend agent.',
          },
          {
            title: 'New Agent Permission Scope',
            details:
              'Default: Read-only for critical modules. Action: Manual approval for write access.',
          },
        ].map(protocol => (
          <Card
            key={protocol.title}
            className="border-border/50 bg-card shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between p-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                {protocol.title}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </Button>
            </CardHeader>
            <CardContent className="p-2 pt-0 text-xs text-muted-foreground">
              {protocol.details}
            </CardContent>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="border-t border-border/60 p-2 md:p-3">
        <Button
          variant="outline"
          className="w-full bg-card hover:bg-muted/60"
          size="sm"
        >
          Add New Protocol
        </Button>
      </CardFooter>
    </Card>
  );
}

function RbacZbacSimulationContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          RBAC/ZBAC Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 p-1.5 md:p-2">
        <p className="mb-1 text-xs text-muted-foreground">
          Simulate access attempts based on current rules.
        </p>
        <Image
          src="https://placehold.co/400x200.png"
          alt="RBAC/ZBAC Simulation UI"
          width={400}
          height={200}
          className="rounded-md border border-border/60 opacity-70"
          data-ai-hint="permission test scenario form"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="sim-role" className="text-xs text-muted-foreground">
              Role/Agent
            </Label>
            <Input
              id="sim-role"
              placeholder="e.g., Analyst"
              className="mt-0.5 h-8 bg-input text-sm"
            />
          </div>
          <div>
            <Label
              htmlFor="sim-resource"
              className="text-xs text-muted-foreground"
            >
              Resource/Action
            </Label>
            <Input
              id="sim-resource"
              placeholder="e.g., BillingModule:write"
              className="mt-0.5 h-8 bg-input text-sm"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/60 p-2 md:p-3">
        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
          Run Simulation
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmergencyControlsContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col items-center justify-center border-destructive/60 bg-destructive/10 p-3 text-center md:p-4">
      <AlertOctagon className="mb-2 h-10 w-10 text-destructive" />
      <p className="mb-1 font-headline text-lg font-semibold text-destructive">
        System Lockdown Controls
      </p>
      <p className="mb-3 max-w-xs text-xs text-muted-foreground">
        Initiate immediate system-wide lockdown in case of a critical security
        breach. This will restrict agent actions and user access.
      </p>
      <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
        <Button
          variant="destructive"
          size="lg"
          className="h-10 flex-1 bg-destructive text-sm text-destructive-foreground hover:bg-destructive/90"
        >
          <Power className="mr-2 h-4 w-4" /> Full Lockdown
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-10 flex-1 border-destructive text-sm text-destructive hover:bg-destructive/20 hover:text-destructive-foreground"
        >
          Partial Lockdown
        </Button>
      </div>
    </Card>
  );
}

export default function SecurityCenterPage() {
  const securityPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'liveThreatAnalysis',
      title: 'Live Threat Analysis & Session Map',
      icon: <Globe className="h-4 w-4" />,
      content: <LiveThreatAnalysisContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 8, h: 10, minW: 4, minH: 7 },
        md: { x: 0, y: 0, w: 6, h: 10, minW: 3, minH: 7 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 3, minH: 6 },
      },
    },
    {
      id: 'behavioralFingerprint',
      title: 'Behavioral Analysis & Trust Graph',
      icon: <Share2 className="h-4 w-4" />,
      content: <BehavioralFingerprintContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 10, minW: 3, minH: 7 },
        md: { x: 6, y: 0, w: 4, h: 10, minW: 3, minH: 7 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'securityProtocolEditor',
      title: 'Security Protocol Editor',
      icon: <SlidersHorizontal className="h-4 w-4" />,
      content: <SecurityProtocolEditorContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 5 },
        md: { x: 0, y: 10, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'rbacZbacSimulation',
      title: 'RBAC/ZBAC Access Simulation',
      icon: <ShieldQuestion className="h-4 w-4" />,
      content: <RbacZbacSimulationContent />,
      defaultLayout: {
        lg: { x: 6, y: 10, w: 6, h: 8, minW: 3, minH: 5 },
        md: { x: 5, y: 10, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 24, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'emergencyControls',
      title: 'Emergency Controls',
      icon: <AlertOctagon className="h-4 w-4 text-destructive" />,
      content: <EmergencyControlsContent />,
      defaultLayout: {
        lg: { x: 0, y: 18, w: 12, h: 6, minW: 6, minH: 4 },
        md: { x: 0, y: 18, w: 10, h: 6, minW: 5, minH: 4 },
        sm: { x: 0, y: 31, w: 6, h: 5, minW: 4, minH: 3 },
      },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={securityPageZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
