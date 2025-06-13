
// src/components/dashboard/CommandObservatory.tsx
'use client';

import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Activity, LayoutDashboard, Workflow, ShieldCheck, RadioTower, X as CloseIcon, ExternalLink, Package, TerminalSquare, PackageSearch, Cpu, ListChecks, Loader2, Users } from 'lucide-react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed';
import AgentPresenceGrid from './AgentPresenceGrid';
import type { MicroApp } from '@/types/micro-app';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { getDynamicImportFn } from '@/micro-apps/registry';
import { MicroAppCard } from './MicroAppCard';

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
  const defaultProps = { className: "h-6 w-6 mb-1 text-primary opacity-80", ...props };
  if (!iconName) return <Package {...defaultProps} />;
  switch (iconName.toLowerCase()) {
    case 'workflow': return <Workflow {...defaultProps} />;
    case 'shieldcheck': return <ShieldCheck {...defaultProps} />;
    case 'radiotower': return <RadioTower {...defaultProps} />;
    case 'terminalsquare': return <TerminalSquare {...defaultProps} />;
    case 'layoutdashboard': return <LayoutDashboard {...defaultProps} />;
    case 'cpu': return <Cpu {...defaultProps} />;
    case 'listchecks': return <ListChecks {...defaultProps} />;
    case 'package': return <Package {...defaultProps} />;
    case 'users': return <Users {...defaultProps} />;
    default: return <Package {...defaultProps} />;
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

  const MicroAppLauncherContent: React.FC = () => {
    const appsToDisplay = dashboardMicroApps;

    return (
      <Card className="h-full bg-transparent border-none shadow-none">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-2">
              {appsToDisplay.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {appsToDisplay.map((app) => (
                    <MicroAppCard
                      key={app.id}
                      id={app.id}
                      name={app.displayName}
                      description={app.description}
                      onLaunch={() => handleLaunchApp(app)}
                      tags={app.tags?.slice(0, 2)} // Passing tags
                      // metricPreview can be added if app.metricPreview exists
                      icon={getLucideIcon(app.icon, { className: "h-5 w-5 text-primary group-hover:text-accent transition-colors" })}
                      className="aspect-auto min-h-[150px]"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground h-full flex flex-col items-center justify-center">
                  <PackageSearch className="mx-auto h-10 w-10 opacity-50 mb-2" />
                  No micro-apps available for dashboard.
                  <p className="text-xs mt-1">(Check Admin settings or deploy some!)</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

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

    const dynamicImportFn = getDynamicImportFn(currentApp.id);

    if (!dynamicImportFn) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
          <PackageSearch className="h-12 w-12 text-destructive/70 mb-3" />
          <p className="text-sm text-destructive">Micro-app component not found!</p>
          <p className="text-xs text-muted-foreground/80">
            No dynamic import function registered for "{currentApp.displayName}" (ID: {currentApp.id}).
          </p>
        </div>
      );
    }
    
    const AppComponent = lazy(dynamicImportFn);
    
    return (
        <Card className="h-full flex flex-col relative bg-transparent border-none shadow-none">
            <CardContent className="flex-grow p-0 overflow-y-auto h-full">
                 <Suspense fallback={
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground">Loading {currentApp.displayName}...</p>
                    </div>
                }>
                    <AppComponent />
                </Suspense>
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
      icon: launchedApp ? getLucideIconSmall(launchedApp.icon, '!mr-0') : <Package className="h-4 w-4" />,
      content: <LaunchedAppDisplayContent currentApp={launchedApp} />,
      defaultLayout: { x: 4, y: 12, w: 8, h: 12, minW: 4, minH: 6 },
      canClose: !!launchedApp,
      onClose: launchedApp ? handleCloseApp : undefined, // Only allow close if an app is launched
      canPin: false, 
      canMinimize: !!launchedApp, // Allow minimize if an app is launched
      canMaximize: !!launchedApp, // Allow maximize if an app is launched
    }
  ], [launchedApp, dashboardMicroApps, handleLaunchApp, handleCloseApp]); // dashboardMicroApps added to dependency array

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
        storageKey="commandObservatoryLayout_v3" // Consider updating storageKey if layout structure changes significantly
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={20} // Adjust row height as needed
      />
    </div>
  );
}
