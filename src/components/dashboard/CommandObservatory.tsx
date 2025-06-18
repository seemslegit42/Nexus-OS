// src/components/dashboard/CommandObservatory.tsx
'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  useEffect,
} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  SquaresFour as LayoutDashboard,
  FlowArrow as Workflow,
  ShieldCheck,
  Radio as RadioTower,
  Package,
  Terminal as TerminalSquare,
  MagnifyingGlass as PackageSearch,
  Cpu,
  ListChecks,
  CircleNotch as Loader2,
  Users,
  Rocket,
  Pulse,
  Sparkle,
  Lightning,
  Eye,
  TrendUp,
  Activity,
} from '@phosphor-icons/react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed';
import AgentPresenceGrid from './AgentPresenceGrid';
import type { MicroApp } from '@/types/micro-app';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { getDynamicImportFn } from '@/micro-apps/registry';
import { MicroAppCard } from './MicroAppCard';
import { SystemMetrics } from './SystemMetrics';
import { PerformanceDashboard } from './PerformanceDashboard';

// Helper function to get Phosphor icons dynamically
const getPhosphorIcon = (
  iconName: string | undefined,
  props?: any
): React.ReactNode => {
  const defaultProps = {
    className: 'h-6 w-6 mb-1 text-primary opacity-80',
    ...props,
  };
  if (!iconName) return <Package {...defaultProps} />;
  switch (iconName.toLowerCase()) {
    case 'workflow':
      return <Workflow {...defaultProps} />;
    case 'shieldcheck':
      return <ShieldCheck {...defaultProps} />;
    case 'shieldalert':
      return <ShieldCheck {...defaultProps} />;
    case 'radiotower':
      return <RadioTower {...defaultProps} />;
    case 'terminalsquare':
      return <TerminalSquare {...defaultProps} />;
    case 'layoutdashboard':
      return <LayoutDashboard {...defaultProps} />;
    case 'cpu':
      return <Cpu {...defaultProps} />;
    case 'listchecks':
      return <ListChecks {...defaultProps} />;
    case 'package':
      return <Package {...defaultProps} />;
    case 'users':
      return <Users {...defaultProps} />;
    case 'activity':
      return <Pulse {...defaultProps} />;
    case 'rocket':
      return <Rocket {...defaultProps} />;
    default:
      return <Package {...defaultProps} />;
  }
};

const getPhosphorIconSmall = (
  iconName: string | undefined,
  customClassName?: string
): React.ReactNode => {
  const iconToUse = iconName || 'LayoutDashboard';
  return getPhosphorIcon(iconToUse, {
    className: cn('h-4 w-4 mr-2', customClassName),
  });
};

interface MicroAppLauncherProps {
  appsToDisplay: MicroApp[];
  onLaunchApp: (app: MicroApp) => void;
}
const MicroAppLauncherContentInternal = React.memo<MicroAppLauncherProps>(
  ({ appsToDisplay, onLaunchApp }) => {
    return (
      <Card className="h-full border-none bg-transparent shadow-none">
        <CardContent className="h-full p-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {appsToDisplay.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                  {appsToDisplay.map(app => (
                    <MicroAppCard
                      key={app.id}
                      id={app.id}
                      name={app.displayName}
                      description={app.description}
                      onLaunch={() => onLaunchApp(app)}
                      icon={getPhosphorIcon(app.icon, {
                        className:
                          'h-7 w-7 text-primary group-hover:text-accent transition-colors duration-150',
                      })}
                      displayMode="compact"
                      className="min-h-[90px] sm:min-h-[100px]"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
                  <PackageSearch className="mx-auto mb-2 h-10 w-10 opacity-50" />
                  No micro-apps available.
                  <p className="mt-1 text-xs">
                    (Deploy apps from Admin or check visibility settings.)
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
);
MicroAppLauncherContentInternal.displayName = 'MicroAppLauncherContentInternal';

interface LaunchedAppDisplayProps {
  currentApp: MicroApp | null;
}
const LaunchedAppDisplayContentInternal = React.memo<LaunchedAppDisplayProps>(
  ({ currentApp }) => {
    if (!currentApp) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          <LayoutDashboard className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No micro-app launched.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Select an app from the "Micro-App Launcher".
          </p>
        </div>
      );
    }

    const dynamicImportFn = getDynamicImportFn(currentApp.id);

    if (!dynamicImportFn) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          <PackageSearch className="mb-3 h-12 w-12 text-destructive/70" />
          <p className="text-sm font-semibold text-destructive">
            Component not registered for ID: {currentApp.id}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Unable to load micro-app "{currentApp.displayName}". Please check
            the micro-app registry.
          </p>
        </div>
      );
    }

    const AppComponent = React.lazy(dynamicImportFn);

    return (
      <Card className="relative flex h-full flex-col border-none bg-transparent shadow-none">
        <CardContent className="h-full flex-grow overflow-y-auto p-0">
          <Suspense
            fallback={
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading {currentApp.displayName}...
                </p>
              </div>
            }
          >
            <AppComponent />
          </Suspense>
        </CardContent>
      </Card>
    );
  }
);
LaunchedAppDisplayContentInternal.displayName =
  'LaunchedAppDisplayContentInternal';

export default function CommandObservatory() {
  const [launchedApp, setLaunchedApp] = useState<MicroApp | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');

  const allRegisteredApps = useMicroAppRegistryStore(state => state.apps);

  // Dynamic greeting based on time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeOfDay('Good Morning');
      else if (hour < 17) setTimeOfDay('Good Afternoon');
      else setTimeOfDay('Good Evening');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

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
  const liveOrchestrationsFeedContent = useMemo(
    () => <LiveOrchestrationsFeed />,
    []
  );
  const systemMetricsContent = useMemo(() => <SystemMetrics />, []);
  const performanceDashboardContent = useMemo(
    () => <PerformanceDashboard />,
    []
  );

  const microAppLauncherContent = useMemo(
    () => (
      <MicroAppLauncherContentInternal
        appsToDisplay={dashboardMicroApps}
        onLaunchApp={handleLaunchApp}
      />
    ),
    [dashboardMicroApps, handleLaunchApp]
  );

  const launchedAppDisplayContent = useMemo(
    () => <LaunchedAppDisplayContentInternal currentApp={launchedApp} />,
    [launchedApp]
  );

  const zoneConfigs = useMemo(
    (): ZoneConfig[] => [
      {
        id: 'systemMetrics',
        title: 'System Overview',
        icon: getPhosphorIconSmall('activity', 'text-primary/90'),
        content: systemMetricsContent,
        defaultLayout: { x: 0, y: 0, w: 3, h: 8, minW: 3, minH: 6 },
      },
      {
        id: 'agentPresence',
        title: 'Agent Fleet',
        icon: getPhosphorIconSmall('cpu', 'text-primary/90'),
        content: agentPresenceGridContent,
        defaultLayout: { x: 3, y: 0, w: 3, h: 12, minW: 3, minH: 8 },
      },
      {
        id: 'performanceMetrics',
        title: 'Performance Analytics',
        icon: getPhosphorIconSmall('TrendUp', 'text-primary/90'),
        content: performanceDashboardContent,
        defaultLayout: { x: 0, y: 8, w: 3, h: 8, minW: 3, minH: 6 },
      },
      {
        id: 'microAppLauncher',
        title: 'Quick Launch',
        icon: getPhosphorIconSmall('rocket', 'text-primary/90'),
        content: microAppLauncherContent,
        defaultLayout: { x: 0, y: 16, w: 3, h: 8, minW: 3, minH: 5 },
      },
      {
        id: 'orchestrationFeed',
        title: 'Live Orchestrations',
        icon: getPhosphorIconSmall('listchecks', 'text-primary/90'),
        content: liveOrchestrationsFeedContent,
        defaultLayout: { x: 6, y: 0, w: 6, h: 12, minW: 4, minH: 8 },
      },
      {
        id: 'launchedAppDisplay',
        title: launchedApp
          ? `${launchedApp.displayName}`
          : 'Application Workspace',
        icon: getPhosphorIconSmall(
          launchedApp?.icon || 'Package',
          launchedApp ? 'text-primary/90' : 'text-muted-foreground mr-2'
        ),
        content: launchedAppDisplayContent,
        defaultLayout: { x: 6, y: 12, w: 6, h: 12, minW: 4, minH: 7 },
        canClose: !!launchedApp,
        onClose: launchedApp ? handleCloseApp : undefined,
        canPin: false,
        canMinimize: !!launchedApp,
        canMaximize: !!launchedApp,
      },
    ],
    [
      launchedApp,
      handleCloseApp,
      agentPresenceGridContent,
      microAppLauncherContent,
      liveOrchestrationsFeedContent,
      launchedAppDisplayContent,
      systemMetricsContent,
      performanceDashboardContent,
    ]
  );

  return (
    <div
      className={cn(
        'relative mx-auto flex h-full w-full max-w-none flex-col overflow-hidden p-0',
        'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900',
        'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]',
        'after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_50%)]'
      )}
    >
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/4 top-1/4 h-2 w-2 animate-pulse rounded-full bg-primary/20"
          style={{ animationDelay: '0s', animationDuration: '4s' }}
        />
        <div
          className="absolute right-1/3 top-3/4 h-1 w-1 animate-pulse rounded-full bg-secondary/30"
          style={{ animationDelay: '2s', animationDuration: '3s' }}
        />
        <div
          className="absolute right-1/4 top-1/2 h-1.5 w-1.5 animate-pulse rounded-full bg-accent/20"
          style={{ animationDelay: '1s', animationDuration: '5s' }}
        />
      </div>

      {/* Header with greeting and status */}
      <div className="relative z-10 border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {timeOfDay}, Commander
                </h1>
                <p className="text-xs text-white/70">
                  Your Nexus OS Command Observatory is ready
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-white/80">
              <Eye className="h-3 w-3" />
              <span>Live Monitoring</span>
            </div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>

      <WorkspaceGrid
        zoneConfigs={zoneConfigs}
        className="relative z-10 flex-grow p-2"
        storageKey="commandObservatoryLayout_v6_enhanced"
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={35}
      />
    </div>
  );
}
