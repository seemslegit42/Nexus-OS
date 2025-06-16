// src/components/dashboard/CommandObservatory.tsx
'use client';

import React, { useState, useMemo, useCallback, Suspense } from 'react'; 
import { Card, CardContent } from '@/components/ui/card'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Workflow, ShieldCheck, RadioTower, Package, TerminalSquare, PackageSearch, Cpu, ListChecks, Loader2, Users, Rocket, Activity } from 'lucide-react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed';
import AgentPresenceGrid from './AgentPresenceGrid';
import type { MicroApp } from '@/types/micro-app';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { getDynamicImportFn } from '@/micro-apps/registry';
import { MicroAppCard } from './MicroAppCard';
import SystemSnapshot from './SystemSnapshot';

// Helper function to get Lucide icons dynamically
const getLucideIcon = (iconName: string | undefined, props?: any): React.ReactNode => {
  const defaultProps = { className: "h-6 w-6 mb-1 text-primary opacity-80", ...props };
  if (!iconName) return <Package {...defaultProps} />;
  switch (iconName.toLowerCase()) {
    case 'workflow': return <Workflow {...defaultProps} />;
    case 'shieldcheck': return <ShieldCheck {...defaultProps} />;
    case 'shieldalert': return <ShieldCheck {...defaultProps} />;
    case 'radiotower': return <RadioTower {...defaultProps} />;
    case 'terminalsquare': return <TerminalSquare {...defaultProps} />;
    case 'layoutdashboard': return <LayoutDashboard {...defaultProps} />;
    case 'cpu': return <Cpu {...defaultProps} />;
    case 'listchecks': return <ListChecks {...defaultProps} />;
    case 'package': return <Package {...defaultProps} />;
    case 'users': return <Users {...defaultProps} />;
    case 'activity': return <Activity {...defaultProps} />;
    case 'rocket': return <Rocket {...defaultProps} />;
    default: return <Package {...defaultProps} />;
  }
};

const getLucideIconSmall = (iconName: string | undefined, customClassName?: string): React.ReactNode => {
  const iconToUse = iconName || 'LayoutDashboard';
  return getLucideIcon(iconToUse, { className: cn("h-4 w-4 mr-2", customClassName) });
};

interface MicroAppLauncherProps {
  appsToDisplay: MicroApp[];
  onLaunchApp: (app: MicroApp) => void;
}
const MicroAppLauncherContentInternal = React.memo<MicroAppLauncherProps>(({ appsToDisplay, onLaunchApp }) => {
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full">
          <div className="p-2">
            {appsToDisplay.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {appsToDisplay.map((app) => (
                  <MicroAppCard
                    key={app.id}
                    id={app.id}
                    name={app.displayName}
                    description={app.description}
                    onLaunch={() => onLaunchApp(app)}
                    icon={getLucideIcon(app.icon, { className: "h-7 w-7 text-primary group-hover:text-accent transition-colors duration-150" }) } 
                    displayMode="compact"
                    className="min-h-[90px] sm:min-h-[100px]" 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground h-full flex flex-col items-center justify-center">
                <PackageSearch className="mx-auto h-10 w-10 opacity-50 mb-2" />
                No micro-apps available.
                <p className="text-xs mt-1">(Deploy apps from Admin or check visibility settings.)</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});
MicroAppLauncherContentInternal.displayName = 'MicroAppLauncherContentInternal';

interface LaunchedAppDisplayProps {
  currentApp: MicroApp | null;
}
const LaunchedAppDisplayContentInternal = React.memo<LaunchedAppDisplayProps>(({ currentApp }) => {
  if (!currentApp) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <LayoutDashboard className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No micro-app launched.</p>
        <p className="text-xs text-muted-foreground/80">Select an app from the "Micro-App Launcher".</p>
      </div>
    );
  }

  const dynamicImportFn = getDynamicImportFn(currentApp.id);

  if (!dynamicImportFn) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <PackageSearch className="h-12 w-12 text-destructive/70 mb-3" />
        <p className="text-sm font-semibold text-destructive">Component not registered for ID: {currentApp.id}</p>
        <p className="text-xs text-muted-foreground/80 mt-1">
          Unable to load micro-app "{currentApp.displayName}". Please check the micro-app registry.
        </p>
      </div>
    );
  }
  
  const AppComponent = React.lazy(dynamicImportFn); 
  
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
});
LaunchedAppDisplayContentInternal.displayName = 'LaunchedAppDisplayContentInternal';


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

  const agentPresenceGridContent = useMemo(() => <AgentPresenceGrid />, []);
  const systemSnapshotContent = useMemo(() => <SystemSnapshot />, []);
  const liveOrchestrationsFeedContent = useMemo(() => <LiveOrchestrationsFeed />, []);

  const microAppLauncherContent = useMemo(() => (
    <MicroAppLauncherContentInternal appsToDisplay={dashboardMicroApps} onLaunchApp={handleLaunchApp} />
  ), [dashboardMicroApps, handleLaunchApp]);

  const launchedAppDisplayContent = useMemo(() => (
    <LaunchedAppDisplayContentInternal currentApp={launchedApp} />
  ), [launchedApp]);

  const zoneConfigs = useMemo((): ZoneConfig[] => [
    {
      id: "agentPresence",
      title: "Agent Fleet Overview", 
      icon: getLucideIconSmall("cpu", "text-primary/90"),
      content: agentPresenceGridContent,
      defaultLayout: { x: 0, y: 0, w: 4, h: 9, minW: 3, minH: 6 }, 
    },
    {
      id: "systemSnapshot",
      title: "System Vital Signs", 
      icon: getLucideIconSmall("activity", "text-primary/90"),
      content: systemSnapshotContent,
      defaultLayout: { x: 0, y: 9, w: 4, h: 8, minW: 3, minH: 5 }, 
    },
    {
      id: "microAppLauncher",
      title: "Micro-App Launcher",
      icon: getLucideIconSmall("rocket", "text-primary/90"), 
      content: microAppLauncherContent,
      defaultLayout: { x: 0, y: 17, w: 4, h: 7, minW: 3, minH: 5 }, 
    },
    {
      id: "orchestrationFeed",
      title: "Live System Orchestrations", 
      icon: getLucideIconSmall("listchecks", "text-primary/90"),
      content: liveOrchestrationsFeedContent,
      defaultLayout: { x: 4, y: 0, w: 8, h: 12, minW: 4, minH: 7 }, 
    },
    {
      id: "launchedAppDisplay",
      title: launchedApp ? `App: ${launchedApp.displayName}` : "Application View",
      icon: getLucideIconSmall(launchedApp?.icon || "Package", launchedApp ? "text-primary/90" : 'text-muted-foreground mr-2'),
      content: launchedAppDisplayContent,
      defaultLayout: { x: 4, y: 12, w: 8, h: 12, minW: 4, minH: 7 }, 
      canClose: !!launchedApp, 
      onClose: launchedApp ? handleCloseApp : undefined,
      canPin: false, 
      canMinimize: !!launchedApp,
      canMaximize: !!launchedApp,
    }
  ], [
    launchedApp, 
    handleCloseApp, 
    agentPresenceGridContent, 
    systemSnapshotContent, 
    microAppLauncherContent, 
    liveOrchestrationsFeedContent, 
    launchedAppDisplayContent
  ]);

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col max-w-none mx-auto overflow-hidden backdrop-blur-md p-0",
        "bg-observatory-bg border-observatory-border shadow-observatory-inner" 
      )}
    >
      <WorkspaceGrid
        zoneConfigs={zoneConfigs}
        className="flex-grow p-1.5 md:p-2" 
        storageKey="commandObservatoryLayout_v4" 
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }} 
        rowHeight={25} 
      />
    </div>
  );
}
