
// src/app/security/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, MapPin, Fingerprint, GitFork, Edit, Power, Activity, ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress'; // For threat level

function LiveThreatAnalysisContent(): ReactNode { // Merged Session Map into Live Threat Analysis
  return (
    <div className="h-full flex flex-col">
      <div className="h-3/5 bg-muted/30 rounded-md mb-2 relative">
        <Image src="https://placehold.co/800x400.png" alt="Live Threat Map" layout="fill" objectFit="cover" className="rounded-md" data-ai-hint="world map cyber threats" />
        <div className="absolute bottom-2 left-2 bg-background/70 p-2 rounded-md text-xs">
          <p>Active Threats: 3 (2 High, 1 Medium)</p>
          <p>Sessions Monitored: 125</p>
        </div>
      </div>
      <div className="h-2/5 space-y-2 overflow-y-auto p-1">
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader className="p-2">
            <CardTitle className="text-sm text-destructive">High Severity: Brute-force attempt on Agent 'AuthMaster'</CardTitle>
            <CardDescription className="text-xs">IP: 203.0.113.45 | Action: IP Blocked, Admin Notified</CardDescription>
          </CardHeader>
        </Card>
         <Card className="bg-yellow-500/10 border-yellow-500">
          <CardHeader className="p-2">
            <CardTitle className="text-sm text-yellow-600">Medium Severity: Anomalous data access by Agent 'DataScout'</CardTitle>
            <CardDescription className="text-xs">Resource: /finance/q4_projections | Action: Agent Suspended Pending Review</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

function BehavioralFingerprintContent(): ReactNode {
  return (
    <div className="h-full flex flex-col p-1">
      <p className="text-sm text-muted-foreground mb-1">User & Agent Anomaly Detection</p>
      <div className="h-4/5 bg-muted/30 rounded-md flex items-center justify-center p-2 mb-2">
        <Image src="https://placehold.co/400x300.png" alt="Behavioral Fingerprint Chart" width={400} height={300} className="rounded-md object-contain" data-ai-hint="user behavior anomaly chart" />
      </div>
      <div className="h-1/5 space-y-1 text-xs">
        <p>Anomalies Detected: 2 (User 'Bob', Agent 'FileMover')</p>
        <p>Current Risk Score: <span className="text-yellow-500">Elevated</span></p>
        <Button variant="outline" size="sm" className="w-full">Investigate Anomalies</Button>
      </div>
    </>
  );
}

function RbacZbacSimulationContent(): ReactNode { // This is for RBAC/ZBAC simulation
    return (
    <div className="p-1 space-y-3">
      <p className="text-sm text-muted-foreground mb-2">Simulate access attempts based on current RBAC/ZBAC rules.</p>
      <Image src="https://placehold.co/600x300.png" alt="RBAC/ZBAC Simulation UI" width={600} height={300} className="rounded-md" data-ai-hint="permission test scenario form" />
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1">Select Role/Agent</Button>
        <Button variant="outline" className="flex-1">Select Resource/Action</Button>
        <Button className="flex-1 bg-primary hover:bg-primary/90">Run Simulation</Button>
      </div>
    </div>
  );
}

function SecurityProtocolEditorContent(): ReactNode {
  return (
    <div className="space-y-3 p-1 overflow-y-auto h-full">
      <p className="text-sm text-muted-foreground">Define agent behavior thresholds and system responses.</p>
      <Card className="bg-background/50">
        <CardHeader className="p-2"><CardTitle className="text-sm font-headline">Login Attempt Threshold</CardTitle></CardHeader>
        <CardContent className="p-2 text-xs">Max attempts: 5. Action: Lock account for 30 mins.</CardContent>
      </Card>
      <Card className="bg-background/50">
        <CardHeader className="p-2"><CardTitle className="text-sm font-headline">Data Exfiltration Alert</CardTitle></CardHeader>
        <CardContent className="p-2 text-xs">Threshold: &gt;1GB/hr. Action: Notify admin, suspend agent.</CardContent>
      </Card>
      <Button variant="outline" className="w-full">Edit Protocols</Button>
    </div>
  );
}

function EmergencyControlsContent(): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <p className="text-lg font-semibold text-foreground mb-2 font-headline">System Lockdown</p>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Initiate an immediate system-wide lockdown in case of a critical security breach.
      </p>
      <Button variant="destructive" size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
        <Power className="mr-2 h-5 w-5" /> Initiate Lockdown
      </Button>
    </div>
  );
}

export default function SecurityCenterPage() {
  const securityPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'liveThreatAnalysis', // Updated ID
      title: 'Live Threat Analysis & Session Map', // Updated Title
      icon: <Activity className="w-5 h-5" />, // Changed Icon
      content: <LiveThreatAnalysisContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 8, h: 10, minW: 4, minH: 7 },
        md: { x: 0, y: 0, w: 6, h: 10, minW: 3, minH: 7 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 3, minH: 6 },
      },
    },
    {
      id: 'behavioralFingerprint',
      title: 'Behavioral Fingerprint Analysis',
      icon: <Fingerprint className="w-5 h-5" />,
      content: <BehavioralFingerprintContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 10, minW: 3, minH: 7 },
        md: { x: 6, y: 0, w: 4, h: 10, minW: 3, minH: 7 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'rbacZbacSimulation', // New zone from user description
      title: 'RBAC/ZBAC Simulation',
      icon: <ShieldQuestion className="w-5 h-5" />,
      content: <RbacZbacSimulationContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 5 },
        md: { x: 0, y: 10, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'securityProtocolEditor',
      title: 'Security Protocol Editor',
      icon: <Edit className="w-5 h-5" />,
      content: <SecurityProtocolEditorContent />,
      defaultLayout: {
        lg: { x: 6, y: 10, w: 6, h: 8, minW: 3, minH: 5 },
        md: { x: 5, y: 10, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 24, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'emergencyControls',
      title: 'Emergency Controls',
      icon: <ShieldCheck className="w-5 h-5 text-destructive" />,
      content: <EmergencyControlsContent />,
      defaultLayout: {
        lg: { x: 0, y: 18, w: 12, h: 6, minW: 6, minH: 4 }, // Adjusted height
        md: { x: 0, y: 18, w: 10, h: 6, minW: 5, minH: 4 },
        sm: { x: 0, y: 31, w: 6, h: 5, minW: 4, minH: 3 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={securityPageZoneConfigs}
      className="flex-grow"
    />
  );
}

    