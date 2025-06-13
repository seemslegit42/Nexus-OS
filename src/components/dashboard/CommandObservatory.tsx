
// src/components/dashboard/CommandObservatory.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Activity, ListChecks, Cpu, LayoutDashboard, Workflow, ShieldCheck, RadioTower, X as CloseIcon, ExternalLink } from 'lucide-react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed';
import AgentPresenceGrid from './AgentPresenceGrid';

const SystemSnapshotPlaceholder: React.FC = () => {
  return (
    <Card className="h-auto bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" /> System Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-1.5 text-sm">
        <p className="text-muted-foreground">CPU Load: <span className="text-foreground font-medium">35%</span></p>
        <p className="text-muted-foreground">Memory Usage: <span className="text-foreground font-medium">60%</span></p>
        <p className="text-muted-foreground">Network I/O: <span className="text-foreground font-medium">1.2 Gbps</span></p>
        <p className="text-muted-foreground">Active Tasks: <span className="text-foreground font-medium">12</span></p>
        <p className="text-muted-foreground">Security Score: <span className="text-green-400 font-medium">98/100</span></p>
      </CardContent>
    </Card>
  );
};

interface MicroApp {
  id: string;
  displayName: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

const mockMicroApps: MicroApp[] = [
  { id: 'autopilot_v1', displayName: 'Autopilot Builder', icon: Workflow, description: "Visual workflow design." },
  { id: 'guardian_sec_v2.3', displayName: 'Guardian Security', icon: ShieldCheck, description: "System threat monitoring." },
  { id: 'pulse_monitor_v0.9b', displayName: 'System Pulse', icon: RadioTower, description: "Live system health overview." },
  { id: 'some_other_app', displayName: 'Data Analytics Suite', icon: LayoutDashboard, description: "Deep dive into metrics." },
];

export default function CommandObservatory() {
  const [launchedApp, setLaunchedApp] = useState<MicroApp | null>(null);

  const handleLaunchApp = (app: MicroApp) => {
    setLaunchedApp(app);
  };

  const handleCloseApp = () => {
    setLaunchedApp(null);
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col max-w-none mx-auto overflow-hidden backdrop-blur-md"
      )}
      style={{
        backgroundColor: 'rgba(12,22,26,0.85)',
        borderColor: 'rgba(142,255,215,0.12)',
        boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.05)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div className="flex-grow grid md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 overflow-hidden">
        {/* Left Column (1/3 width on md+) */}
        <div className="md:col-span-1 h-full flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow pr-1">
            <div className="space-y-3 md:space-y-4">
              <AgentPresenceGrid />
              <SystemSnapshotPlaceholder />
              
              {/* Micro-Apps Grid */}
              <Card className="h-auto bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-base font-medium text-foreground flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-primary" /> Micro-Apps
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="grid grid-cols-2 gap-2">
                    {mockMicroApps.map((app) => (
                      <Card 
                        key={app.id} 
                        className="bg-[rgba(16,42,32,0.65)] border border-[rgba(142,255,215,0.25)] text-[rgba(220,255,240,0.9)] rounded-lg p-3 flex flex-col items-center justify-center text-center"
                      >
                        {app.icon && <app.icon className="h-6 w-6 mb-1 text-primary opacity-80" />}
                        <p className="text-xs font-semibold truncate w-full" title={app.displayName}>{app.displayName}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 text-xs h-7 bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary hover:text-primary/90 w-full"
                          onClick={() => handleLaunchApp(app)}
                        >
                          Launch
                        </Button>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </ScrollArea>
        </div>

        {/* Right Column (2/3 width on md+) */}
        <div className="md:col-span-2 h-full flex flex-col overflow-hidden">
          <div className="flex-shrink-0"> {/* Adjust this div if feed needs to shrink */}
            <LiveOrchestrationsFeed />
          </div>
          
          {launchedApp && (
            <div className="mt-3 md:mt-4 flex-grow min-h-0">
              <Card 
                className="h-full max-h-[60vh] flex flex-col relative bg-[rgba(16,42,32,0.8)] border border-[rgba(142,255,215,0.3)] backdrop-blur-md shadow-[0_6px_25px_rgba(0,255,162,0.15)] rounded-2xl"
              >
                <CardHeader className="flex-row items-center justify-between p-2 border-b border-[rgba(142,255,215,0.2)]">
                  <CardTitle className="text-sm font-medium text-primary flex items-center">
                    {launchedApp.icon && <launchedApp.icon className="h-4 w-4 mr-2" />}
                    {launchedApp.displayName}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleCloseApp} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                    <CloseIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-grow p-3 overflow-y-auto">
                  <p className="text-sm text-[rgba(220,255,240,0.9)]">
                    Placeholder content for <span className="font-semibold">{launchedApp.displayName}</span>.
                  </p>
                  <p className="text-xs text-[rgba(220,255,240,0.7)] mt-1">
                    This area will display the actual micro-application's interface. For now, it's just a placeholder.
                    You can add more specific content or even an iframe here later.
                  </p>
                   <div className="mt-4 p-4 bg-black/20 rounded-md border border-primary/20">
                      <h4 className="text-xs font-semibold text-primary mb-1">Micro-App View Details:</h4>
                      <p className="text-xs text-muted-foreground">ID: {launchedApp.id}</p>
                      <p className="text-xs text-muted-foreground">Description: {launchedApp.description || "No description available."}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

