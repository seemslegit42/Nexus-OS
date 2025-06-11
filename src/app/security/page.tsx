
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

function LiveThreatAnalysisContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Live Threat Map & Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col sm:flex-row gap-0">
        <div className="sm:w-3/5 h-64 sm:h-full bg-muted/20 relative border-r border-border/50 sm:border-r-0 sm:border-b sm:rounded-bl-md">
          <Image src="https://placehold.co/800x400.png" alt="Live Threat Map with IP/Country Info" layout="fill" objectFit="cover" className="rounded-l-md sm:rounded-bl-md sm:rounded-tr-none opacity-80" data-ai-hint="world map cyber threats ip geo" />
          <div className="absolute bottom-1.5 left-1.5 bg-background/80 backdrop-blur-sm p-1.5 rounded text-xs shadow-md">
            <p className="font-medium">Active Threats: <span className="text-destructive">3</span> (2 High, 1 Medium)</p>
            <p>Sessions Monitored: 125 (Global)</p>
          </div>
        </div>
        <ScrollArea className="sm:w-2/5 h-full">
            <div className="p-1.5 space-y-1.5">
            <Card className="bg-destructive/15 border-destructive/50 shadow-sm">
                <CardHeader className="p-1.5 pb-0.5"><CardTitle className="text-xs text-destructive font-semibold">High: Brute-force on 'AuthMaster'</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs text-destructive-foreground/80">IP: 203.0.113.45 (RU) | Action: IP Blocked</CardContent>
            </Card>
            <Card className="bg-destructive/15 border-destructive/50 shadow-sm">
                <CardHeader className="p-1.5 pb-0.5"><CardTitle className="text-xs text-destructive font-semibold">High: DDoS on API Gateway</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs text-destructive-foreground/80">Source: Multiple (VN, CN) | Action: Mitigation Active</CardContent>
            </Card>
            <Card className="bg-yellow-500/15 border-yellow-500/50 shadow-sm">
                <CardHeader className="p-1.5 pb-0.5"><CardTitle className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">Med: Anomalous data access</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs text-muted-foreground">Agent: 'DataScout' | Resource: /finance/q4 | Action: Suspended</CardContent>
            </Card>
             <Card className="bg-blue-500/10 border-blue-500/40 shadow-sm">
                <CardHeader className="p-1.5 pb-0.5"><CardTitle className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Info: New Login from DE</CardTitle></CardHeader>
                <CardContent className="p-1.5 text-xs text-muted-foreground">User: 'AlexR' | IP: 88.67.12.3 | Action: Monitored</CardContent>
            </Card>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function BehavioralFingerprintContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none p-0">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Behavioral Analysis & Trust Graph</CardTitle>
      </CardHeader>
      <CardContent className="p-1.5 md:p-2 flex-grow flex flex-col md:flex-row gap-1.5 md:gap-2">
        <div className="md:w-1/2 h-1/2 md:h-full bg-muted/20 rounded-md flex items-center justify-center p-2 border border-border/50">
            <Image src="https://placehold.co/400x300.png" alt="Behavioral Fingerprint Chart" width={400} height={300} className="rounded-md object-contain opacity-70" data-ai-hint="user behavior anomaly chart waves" />
        </div>
        <div className="md:w-1/2 h-1/2 md:h-full bg-muted/20 rounded-md flex items-center justify-center p-2 border border-border/50">
            <Image src="https://placehold.co/400x300.png" alt="Visual Trust Graph" width={400} height={300} className="rounded-md object-contain opacity-70" data-ai-hint="network graph trust relationships flagged" />
        </div>
      </CardContent>
      <CardFooter className="p-2 md:p-3 border-t border-border/60 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Anomalies: <span className="text-yellow-500 font-semibold">2</span> | Risk Score: <span className="text-yellow-500 font-semibold">Elevated</span></p>
        <Button variant="outline" size="sm" className="text-xs bg-card/60 hover:bg-muted/60">Investigate</Button>
      </CardFooter>
    </Card>
  );
}

function SecurityProtocolEditorContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Security Protocol Editor</CardTitle>
      </CardHeader>
      <CardContent className="p-1.5 md:p-2 space-y-2 flex-grow overflow-y-auto">
        <p className="text-xs text-muted-foreground mb-1">Define agent behavior thresholds and system responses.</p>
        {[
          { title: "Login Attempt Threshold", details: "Max attempts: 5. Action: Lock account for 30 mins." },
          { title: "Data Exfiltration Alert", details: "Threshold: >1GB/hr by single agent. Action: Notify admin, suspend agent." },
          { title: "New Agent Permission Scope", details: "Default: Read-only for critical modules. Action: Manual approval for write access." }
        ].map(protocol => (
          <Card key={protocol.title} className="bg-card/50 border-border/50 shadow-sm">
            <CardHeader className="p-2 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-semibold text-foreground">{protocol.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4 text-muted-foreground hover:text-primary"/></Button>
            </CardHeader>
            <CardContent className="p-2 pt-0 text-xs text-muted-foreground">{protocol.details}</CardContent>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="p-2 md:p-3 border-t border-border/60">
        <Button variant="outline" className="w-full bg-card/60 hover:bg-muted/60" size="sm">Add New Protocol</Button>
      </CardFooter>
    </Card>
  );
}

function RbacZbacSimulationContent(): ReactNode {
    return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3"><CardTitle className="text-md font-semibold font-headline text-foreground">RBAC/ZBAC Simulation</CardTitle></CardHeader>
      <CardContent className="p-1.5 md:p-2 space-y-2 flex-grow">
        <p className="text-xs text-muted-foreground mb-1">Simulate access attempts based on current rules.</p>
        <Image src="https://placehold.co/400x200.png" alt="RBAC/ZBAC Simulation UI" width={400} height={200} className="rounded-md border border-border/60 opacity-70" data-ai-hint="permission test scenario form" />
        <div className="grid grid-cols-2 gap-2 mt-2">
            <div><Label htmlFor="sim-role" className="text-xs text-muted-foreground">Role/Agent</Label><Input id="sim-role" placeholder="e.g., Analyst" className="h-8 text-sm mt-0.5 bg-background/70"/></div>
            <div><Label htmlFor="sim-resource" className="text-xs text-muted-foreground">Resource/Action</Label><Input id="sim-resource" placeholder="e.g., BillingModule:write" className="h-8 text-sm mt-0.5 bg-background/70"/></div>
        </div>
      </CardContent>
      <CardFooter className="p-2 md:p-3 border-t border-border/60">
        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">Run Simulation</Button>
      </CardFooter>
    </Card>
  );
}

function EmergencyControlsContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col items-center justify-center p-3 md:p-4 border-destructive/60 bg-destructive/10 text-center">
      <AlertOctagon className="h-10 w-10 text-destructive mb-2" />
      <p className="text-lg font-semibold text-destructive mb-1 font-headline">System Lockdown Controls</p>
      <p className="text-xs text-muted-foreground mb-3 max-w-xs">
        Initiate immediate system-wide lockdown in case of a critical security breach. This will restrict agent actions and user access.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
        <Button variant="destructive" size="lg" className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm h-10">
            <Power className="mr-2 h-4 w-4" /> Full Lockdown
        </Button>
        <Button variant="outline" size="lg" className="flex-1 border-destructive text-destructive hover:bg-destructive/20 hover:text-destructive-foreground text-sm h-10">
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
      icon: <Globe className="w-4 h-4" />, 
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
      icon: <Share2 className="w-4 h-4" />,
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
      icon: <SlidersHorizontal className="w-4 h-4" />,
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
      icon: <ShieldQuestion className="w-4 h-4" />,
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
      icon: <AlertOctagon className="w-4 h-4 text-destructive" />,
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
      className="flex-grow p-1 md:p-2"
       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
