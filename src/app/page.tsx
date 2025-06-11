
// src/app/page.tsx
'use client';

import type { ReactNode } from 'react';
import { Activity, Cpu, LayoutGrid, Rocket, Package as PackageIconLucide } from 'lucide-react'; // Renamed Package to PackageIconLucide
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import type { MicroApp } from '@/types/micro-app';

// Import widget components
import { WorkspaceLaunchpadWidget } from '@/micro-apps/dashboard-widgets/workspace-launchpad-widget';
import { ActivityFeedWidget } from '@/micro-apps/dashboard-widgets/activity-feed-widget';
import { LiveAgentPresenceWidget } from '@/micro-apps/dashboard-widgets/live-agent-presence-widget';
import { AvailableMicroAppsWidget } from '@/micro-apps/dashboard-widgets/available-micro-apps-widget';

const widgetComponentMap: Record<string, () => ReactNode> = {
  workspaceLaunchpadWidget: WorkspaceLaunchpadWidget,
  activityFeedWidget: ActivityFeedWidget,
  liveAgentPresenceWidget: LiveAgentPresenceWidget,
  availableMicroAppsWidget: AvailableMicroAppsWidget,
};

const iconMap: Record<string, ReactNode> = {
  Rocket: <Rocket className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  Package: <PackageIconLucide className="w-5 h-5" />, // Use renamed import
  // Add other icons as needed
};

export default function HomePage() {
  const dashboardWidgetApps = useMicroAppRegistryStore(state => state.getDashboardWidgets());

  const dashboardZoneConfigs: ZoneConfig[] = dashboardWidgetApps.map((app: MicroApp) => {
    const WidgetContentComponent = app.componentKey ? widgetComponentMap[app.componentKey] : null;
    return {
      id: app.id,
      title: app.displayName,
      icon: app.icon ? iconMap[app.icon] || <PackageIconLucide className="w-5 h-5" /> : <PackageIconLucide className="w-5 h-5" />,
      content: WidgetContentComponent ? <WidgetContentComponent /> : <div>Widget component not found for {app.componentKey}</div>,
      defaultLayout: app.defaultLayout?.lg || { x: 0, y: 0, w: 4, h: 4 }, // Fallback default layout
      // Pass other properties from app if needed, e.g., minW, minH
      minW: app.defaultLayout?.lg?.minW,
      minH: app.defaultLayout?.lg?.minH,
      static: app.defaultLayout?.lg?.static,
    };
  });

  return (
    <WorkspaceGrid
      zoneConfigs={dashboardZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      storageKey="dashboard-layout-v1" // Added storageKey for layout persistence
    />
  );
}
    