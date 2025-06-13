
// src/components/dashboard/CommandObservatory.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Activity, LayoutDashboard, Workflow, ShieldCheck, RadioTower, X as CloseIcon, ExternalLink, Package, TerminalSquare, PackageSearch, Cpu, ListChecks } from 'lucide-react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed';
import AgentPresenceGrid from './AgentPresenceGrid';
import type { MicroApp } from '@/types/micro-app';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';

const SystemSnapshotPlaceholder: React.FC = () => {
  return (
    <Card className="h-full bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
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

const getLucideIcon = (iconName: string | undefined, props?: any): React.ReactNode => {
  const iconProps = { className: "h-6 w-6 mb-1 text-primary opacity-80", ...props };
  if (!iconName) return <Package {...iconProps} />;
  switch (iconName.toLowerCase()) {
    case 'workflow': return <Workflow {...iconProps} />;
    case 'shieldcheck': return <ShieldCheck {...iconProps} />;
    case 'radiotower': return <RadioTower {...iconProps} />;
    case 'terminalsquare': return <TerminalSquare {...iconProps} />;
    case 'layoutdashboard': return <LayoutDashboard {...iconProps} />;
    case 'cpu': return <Cpu {...iconProps} />;
    case 'listchecks': return <ListChecks {...iconProps} />;
    case 'package': return <Package {...iconProps} />;
    default: return <Package {...iconProps} />;
  }
};

const getLucideIconSmall = (iconName: string | undefined, customClassName?: string): React.ReactNode => {
  return getLucideIcon(iconName, { className: cn("h-4 w-4 mr-2", customClassName) });
};

export default function CommandObservatory() {
  const [launchedApp, setLaunchedApp] = useState<MicroApp | null>(null);
  const allRegisteredApps = useMicroAppRegistryStore(state => state.apps);

  const dashboardMicroApps = useMemo(() => {
    return allRegisteredApps.filter(
      app => app.isVisible && app.deployableTo.includes('dashboard')
    );
  }, [allRegisteredApps]);

  const handleLaunchApp = useCallback((app: MicroApp) => {
    setLaunchedApp(app);
  }, []);

  const handleCloseApp = useCallback(() => {
    setLaunchedApp(null);
  }, []);

  const MicroAppLauncherContent: React.FC = () => (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full">
           <div className="p-2">
            {dashboardMicroApps.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dashboardMicroApps.map((app) => (
                    <Card
                    key={app.id}
                    className="bg-[rgba(16,42,32,0.65)] border border-[rgba(142,255,215,0.25)] text-[rgba(220,255,240,0.9)] rounded-lg p-3 flex flex-col items-center justify-center text-center aspect-square"
                    >
                    {getLucideIcon(app.icon)}
                    <p className="text-xs font-semibold truncate w-full leading-tight" title={app.displayName}>{app.displayName}</p>
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
            ) : (
                <div className="text-center py-6 text-sm text-muted-foreground h-full flex flex-col items-center justify-center">
                <PackageSearch className="mx-auto h-10 w-10 opacity-50 mb-2" />
                No micro-apps available.
                <p className="text-xs mt-1">(Check Admin settings or deploy some!)</p>
                </div>
            )}
           </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const LaunchedAppDisplayContent: React.FC<{ currentApp: MicroApp | null }> = ({ currentApp }) => {
    if (!currentApp) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No micro-app launched.</p>
          <p className="text-xs text-muted-foreground/80">Select an app from the "Micro-Apps" launcher.</p>
        </div>
      );
    }
    return (
         <Card
            className="h-full flex flex-col relative bg-transparent border-none shadow-none"
        >
            <CardContent className="flex-grow p-3 overflow-y-auto">
            <div className="mt-1 p-3 bg-black/20 rounded-md border border-primary/15">
                <h4 className="text-xs font-semibold text-primary mb-1.5">Micro-App Details:</h4>
                <p className="text-xs text-muted-foreground mb-0.5"><strong>ID:</strong> {currentApp.id}</p>
                <p className="text-xs text-muted-foreground mb-0.5"><strong>Description:</strong> {currentApp.description || "No description available."}</p>
                <p className="text-xs text-muted-foreground"><strong>Entry Point:</strong> <code className="text-primary/80 bg-black/30 px-1 py-0.5 rounded-sm text-[11px]">{currentApp.entryPoint || 'Not configured'}</code></p>
            </div>
            <div className="mt-4 text-center text-muted-foreground">
                Content for "{currentApp.displayName}" (via entry: {currentApp.entryPoint || 'N/A'}) would be rendered here.
                <p className="text-xs mt-1">This is a placeholder for the actual micro-app UI.</p>
            </div>
            </CardContent>
        </Card>
    );
  };


  const zoneConfigs = useMemo((): ZoneConfig[] => [
    {
      id: "agentPresence",
      title: "Agent Presence",
      icon: getLucideIconSmall("cpu"),
      content: <AgentPresenceGrid />,
      defaultLayout: { x: 0, y: 0, w: 4, h: 9, minW: 3, minH: 6 },
    },
    {
      id: "systemSnapshot",
      title: "System Snapshot",
      icon: getLucideIconSmall("activity"),
      content: <SystemSnapshotPlaceholder />,
      defaultLayout: { x: 0, y: 9, w: 4, h: 7, minW: 3, minH: 4 },
    },
    {
      id: "microAppLauncher",
      title: "Micro-Apps",
      icon: getLucideIconSmall("layoutdashboard"),
      content: <MicroAppLauncherContent />,
      defaultLayout: { x: 0, y: 16, w: 4, h: 8, minW: 3, minH: 5 },
    },
    {
      id: "orchestrationFeed",
      title: "Live Orchestration Feed",
      icon: getLucideIconSmall("listchecks"),
      content: <LiveOrchestrationsFeed />,
      defaultLayout: { x: 4, y: 0, w: 8, h: 12, minW: 4, minH: 6 },
    },
    {
      id: "launchedAppDisplay",
      title: launchedApp ? `App: ${launchedApp.displayName}` : "Application View",
      icon: launchedApp ? getLucideIconSmall(launchedApp.icon, '!mr-0') : <Package className="h-4 w-4" />, // Removed mr-2 for the dynamic icon
      content: <LaunchedAppDisplayContent currentApp={launchedApp} />,
      defaultLayout: { x: 4, y: 12, w: 8, h: 12, minW: 4, minH: 6 },
      canClose: !!launchedApp,
      onClose: launchedApp ? handleCloseApp : undefined,
      canPin: false, // Usually app views are not pinnable in this dynamic context
      canMinimize: !!launchedApp,
      canMaximize: !!launchedApp, // Allow maximizing the launched app view
    }
  ], [launchedApp, dashboardMicroApps, handleLaunchApp, handleCloseApp]);


  return (
    <div
      className={cn(
        "w-full h-full flex flex-col max-w-none mx-auto overflow-hidden backdrop-blur-md p-0",
        "bg-observatory-bg border-observatory-border shadow-observatory-inner"
      )}
    >
      <WorkspaceGrid
        zoneConfigs={zoneConfigs}
        className="flex-grow p-2 md:p-3"
        storageKey="commandObservatoryLayout_v3" // Incremented version for layout changes
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={20} // Consider adjusting if content needs more/less vertical space per unit
      />
    </div>
  );
}
