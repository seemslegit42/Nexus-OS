
// src/app/security/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, MapPin, Fingerprint, GitFork, Edit, Power, Activity, ShieldQuestion, Globe, Share2, LocateFixed, AlertOctagon, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function LiveThreatAnalysisContent(): ReactNode { // Live Threat Analysis & Session Map, IP/Country Breakdown
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Live Threat Map & Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col sm:flex-row gap-0">
        <div className="sm:w-3/5 h-64 sm:h-full bg-muted/30 relative">
          <Image src="https://placehold.co/800x400.png" alt="Live Threat Map with IP/Country Info" layout="fill" objectFit="cover" className="rounded-l-md sm:rounded-bl-md sm:rounded-tr-none" data-ai-hint="world map cyber threats ip geo" />
          <div className="absolute bottom-1 left-1 bg-background/70 p-1.5 rounded text-xs">
            <p>Active Threats: 3 (2 High, 1 Medium)</p>
            <p>Sessions Monitored: 125 (Global)</p>
          </div>
        </div>
        <ScrollArea className="sm:w-2/5 h-full">
            <div className="p-2 space-y-1.5">
            <Card className="bg-destructive/10 border-destructive">
                <CardHeader className="p-1.5"><CardTitle className="text-xs text-destructive">High: Brute-force on 'AuthMaster'</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs">IP: 203.0.113.45 (RU) | Action: IP Blocked</CardContent>
            </Card>
            <Card className="bg-destructive/10 border-destructive">
                <CardHeader className="p-1.5"><CardTitle className="text-xs text-destructive">High: DDoS on API Gateway</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs">Source: Multiple (VN, CN) | Action: Mitigation Active</CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500">
                <CardHeader className="p-1.5"><CardTitle className="text-xs text-yellow-600">Med: Anomalous data access</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs">Agent: 'DataScout' | Resource: /finance/q4 | Action: Suspended</CardContent>
            </Card>
             <Card className="bg-blue-500/10 border-blue-500">
                <CardHeader className="p-1.5"><CardTitle className="text-xs text-blue-600">Info: New Login from DE</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs">User: 'AlexR' | IP: 88.67.12.3 | Action: Monitored</CardContent>
            </Card>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function BehavioralFingerprintContent(): ReactNode { // Behavioral Fingerprint, Visual Trust Graph
  return (
    <Card className="h-full flex flex-col p-1">
      <CardHeader className="p-2">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Behavioral Analysis & Trust Graph</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex flex-col md:flex-row gap-2">
        <div className="md:w-1/2 h-1/2 md:h-full bg-muted/30 rounded-md flex items-center justify-center p-2">
            <Image src="https://placehold.co/400x300.png" alt="Behavioral Fingerprint Chart / Anomaly Detection" width={400} height={300} className="rounded-md object-contain" data-ai-hint="user behavior anomaly chart waves" />
        </div>
        <div className="md:w-1/2 h-1/2 md:h-full bg-muted/30 rounded-md flex items-center justify-center p-2">
            <Image src="https://placehold.co/400x300.png" alt="Visual Trust Graph (Agent Relationships, Anomalies)" width={400} height={300} className="rounded-md object-contain" data-ai-hint="network graph trust relationships flagged" />
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <p className="text-xs">Anomalies Detected: 2 (User 'Bob', Agent 'FileMover') | Current Risk Score: <span className="text-yellow-500 font-semibold">Elevated</span></p>
        <Button variant="outline" size="sm" className="ml-auto text-xs">Investigate Anomalies</Button>
      </CardFooter>
    </Card>
  );
}

function SecurityProtocolEditorContent(): ReactNode { // Define agent behavior thresholds
  return (
    <Card className="h-full flex flex-col p-1">
      <CardHeader className="p-2">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Security Protocol Editor</CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-3 flex-grow overflow-y-auto">
        <p className="text-xs text-muted-foreground">Define agent behavior thresholds and system responses.</p>
        <Card className="bg-background/50">
          <CardHeader className="p-2 flex flex-row justify-between items-center"><CardTitle className="text-sm font-headline">Login Attempt Threshold</CardTitle><Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3.5 w-3.5"/></Button></CardHeader>
          <CardContent className="p-2 text-xs">Max attempts: 5. Action: Lock account for 30 mins.</CardContent>
        </Card>
        <Card className="bg-background/50">
          <CardHeader className="p-2 flex flex-row justify-between items-center"><CardTitle className="text-sm font-headline">Data Exfiltration Alert</CardTitle><Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3.5 w-3.5"/></Button></CardHeader>
          <CardContent className="p-2 text-xs">Threshold: &gt;1GB/hr by single agent. Action: Notify admin, suspend agent.</CardContent>
        </Card>
        <Card className="bg-background/50">
          <CardHeader className="p-2 flex flex-row justify-between items-center"><CardTitle className="text-sm font-headline">New Agent Permission Scope</CardTitle><Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3.5 w-3.5"/></Button></CardHeader>
          <CardContent className="p-2 text-xs">Default: Read-only for critical modules. Action: Manual approval for write access.</CardContent>
        </Card>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Button variant="outline" className="w-full" size="sm">Add New Protocol</Button>
      </CardFooter>
    </Card>
  );
}

function RbacZbacSimulationContent(): ReactNode {
    return (
    <Card className="h-full flex flex-col p-1">
      <CardHeader className="p-2"><CardTitle className="text-md font-semibold font-headline text-foreground">RBAC/ZBAC Simulation</CardTitle></CardHeader>
      <CardContent className="p-2 space-y-2 flex-grow">
        <p className="text-xs text-muted-foreground">Simulate access attempts based on current rules.</p>
        <Image src="https://placehold.co/400x200.png" alt="RBAC/ZBAC Simulation UI" width={400} height={200} className="rounded-md border opacity-70" data-ai-hint="permission test scenario form" />
        <div className="grid grid-cols-2 gap-2">
            <div><Label htmlFor="sim-role" className="text-xs">Role/Agent</Label><Input id="sim-role" placeholder="e.g., Analyst" className="h-8 text-xs"/></div>
            <div><Label htmlFor="sim-resource" className="text-xs">Resource/Action</Label><Input id="sim-resource" placeholder="e.g., BillingModule:write" className="h-8 text-xs"/></div>
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">Run Simulation</Button>
      </CardFooter>
    </Card>
  );
}

function EmergencyControlsContent(): ReactNode { // Emergency lockdown trigger
  return (
    <Card className="h-full flex flex-col items-center justify-center p-4 border-destructive/50 bg-destructive/10">
      <AlertOctagon className="h-12 w-12 text-destructive mb-3" />
      <p className="text-lg font-semibold text-destructive mb-1 font-headline">System Lockdown Controls</p>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Initiate immediate system-wide lockdown in case of a critical security breach. This will restrict agent actions and user access.
      </p>
      <Button variant="destructive" size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
        <Power className="mr-2 h-5 w-5" /> Initiate Full Lockdown
      </Button>
       <Button variant="outline" size="sm" className="mt-3 border-destructive text-destructive hover:bg-destructive/20">Partial Lockdown (Select Modules)</Button>
    </Card>
  );
}

export default function SecurityCenterPage() {
  const securityPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'liveThreatAnalysis', 
      title: 'Live Threat Analysis & Session Map', 
      icon: <Globe className="w-5 h-5" />, 
      content: <LiveThreatAnalysisContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 8, h: 10, minW: 4, minH: 7 },
        md: { x: 0, y: 0, w: 6, h: 10, minW: 3, minH: 7 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 3, minH: 6 },
      },
    },
    {
      id: 'behavioralFingerprint',
      title: 'Behavioral Fingerprint & Trust Graph', // Updated title
      icon: <Share2 className="w-5 h-5" />, // Changed Icon
      content: <BehavioralFingerprintContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 10, minW: 3, minH: 7 },
        md: { x: 6, y: 0, w: 4, h: 10, minW: 3, minH: 7 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'securityProtocolEditor', // Moved up as it's an editor
      title: 'Security Protocol Editor',
      icon: <SlidersHorizontal className="w-5 h-5" />, // Changed Icon
      content: <SecurityProtocolEditorContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 5 },
        md: { x: 0, y: 10, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'rbacZbacSimulation', 
      title: 'RBAC/ZBAC Access Simulation', // Updated title
      icon: <ShieldQuestion className="w-5 h-5" />,
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
      icon: <AlertOctagon className="w-5 h-5 text-destructive" />, // Changed Icon
      content: <EmergencyControlsContent />,
      defaultLayout: {
        lg: { x: 0, y: 18, w: 12, h: 6, minW: 6, minH: 4 },
        md: { x: 0, y: 18, w: 10, h: 6, minW: 5, minH: 4 },
        sm: { x: 0, y: 31, w: 6, h: 5, minW: 4, minH: 3 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={securityPageZoneConfigs}
      className="flex-grow"
       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // Ensure 12 columns for lg
    />
  );
}
