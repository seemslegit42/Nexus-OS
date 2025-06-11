
'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Users, AlertTriangle as AlertTriangleIconLucide, LayoutGrid, Cpu, Rocket, Info as InfoIcon, Zap, Newspaper, BarChartHorizontalBig, Shield, CalendarDays, GitMerge, Bell, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import type { MicroApp } from '@/types/micro-app';

interface QuickActionItemProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

function QuickActionItem({ href, icon, title, description }: QuickActionItemProps) {
  return (
    <Button variant="outline" className="w-full justify-start p-3 h-auto text-left bg-card hover:bg-muted/70 border-border/70 transition-all duration-150 ease-in-out hover:shadow-lg hover:border-primary/50" asChild>
      <Link href={href}>
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="font-semibold font-headline text-sm text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </Link>
    </Button>
  );
}

function QuickActionsContent(): ReactNode {
  const actions: QuickActionItemProps[] = [
    { href: "/onboarding", icon: <Cpu className="h-5 w-5 text-primary" />, title: "Spawn New Agent", description: "Configure and deploy an AI agent." },
    { href: "/command", icon: <Zap className="h-5 w-5 text-primary" />, title: "Initiate Prompt Chain", description: "Open Command & Cauldron." },
    { href: "/loom-studio", icon: <LayoutGrid className="h-5 w-5 text-primary" />, title: "Open Loom Studio", description: "Visual workflow editor." },
  ];

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {actions.map((action) => (
            <QuickActionItem key={action.title} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityFeedContent(): ReactNode {
  const feedItems = [
    { id: 'act1', agent: 'OptimizerPrime', task: 'Code Review #123', time: '2m ago', icon: <Cpu className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
    { id: 'act2', agent: 'DataMinerX', task: 'Sales Data Sync Q3', time: '15m ago', icon: <BarChartHorizontalBig className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
    { id: 'act3', agent: 'SecureGuard', task: 'System Scan initiated', time: '30m ago', icon: <Shield className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
    { id: 'act4', agent: 'ContentCreatorAI', task: 'Blog Post Draft v2', time: '1h ago', icon: <Newspaper className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
  ];

  return (
     <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2">
        <ul className="space-y-2">
          {feedItems.map((item) => (
            <li key={item.id}>
              <Card className="bg-card hover:bg-muted/70 border-border/70 transition-colors duration-150 ease-in-out hover:shadow-md">
                <CardContent className="p-2.5 text-xs flex items-start">
                  {item.icon}
                  <div className="flex-grow">
                    <span className="font-medium text-foreground">Agent '{item.agent}'</span> {item.task.toLowerCase().includes("completed") || item.task.toLowerCase().includes("initiated") ? "" : "completed task:"} <span className="text-accent-foreground">{item.task}</span>.
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto text-xs">View all activity</Button>
      </CardContent>
    </Card>
  );
}

function AgentStatusContent(): ReactNode {
  const agents = [
    { id: 'agent1', name: "OptimizerPrime", status: "Active", tasks: 2, load: 75 },
    { id: 'agent2', name: "DataMinerX", status: "Idle", tasks: 0, load: 10 },
    { id: 'agent3', name: "SecureGuard", status: "Monitoring", tasks: 5, load: 90 },
    { id: 'agent4', name: "ContentCreatorAI", status: "Processing", tasks: 1, load: 60 },
  ];
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2">
        <div className="space-y-1.5">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-card hover:bg-muted/70 border-border/70 transition-colors duration-150 ease-in-out hover:shadow-md">
              <CardContent className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.status} - {agent.tasks} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-1/3 max-w-[100px]">
                  <Progress
                    value={agent.load}
                    className={cn(
                      "h-1.5 w-full",
                      agent.load <= 50 && "[&>div]:bg-green-500",
                      agent.load > 50 && agent.load <= 80 && "[&>div]:bg-yellow-500",
                      agent.load > 80 && "[&>div]:bg-destructive"
                    )}
                    aria-label={`${agent.name} load ${agent.load}%`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
         <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto text-xs">View agent console</Button>
      </CardContent>
    </Card>
  );
}

interface DashboardWidgetCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  valueOrStatus: string;
  valueColorClass?: string;
  href: string;
}

function DashboardWidgetCard({ title, icon, description, valueOrStatus, valueColorClass, href }: DashboardWidgetCardProps) {
  return (
    <Link href={href} passHref className="block h-full">
      <Card className="bg-card hover:bg-muted/70 border-border/70 transition-colors h-full flex flex-col cursor-pointer">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="flex items-center text-sm font-headline text-foreground gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow px-3 pb-3">
          <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{description}</p>
          <p className={cn("text-sm font-semibold", valueColorClass)}>{valueOrStatus}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function DeployableAppsGridContent(): ReactNode {
  const deployableApps = useMicroAppRegistryStore(state => state.getDeployableApps());

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2">
        {deployableApps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="p-4">
              <Rocket className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No deployable micro-apps available yet.</p>
              <p className="text-xs text-muted-foreground">Enable some in the Admin Micro-App Registry.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {deployableApps.map(app => (
              <DashboardWidgetCard
                key={app.id}
                title={app.displayName}
                // TODO: Implement dynamic icon mapping based on app.icon string
                icon={<PackageIcon className="h-4 w-4 text-primary" />} 
                description={app.description}
                valueOrStatus={app.category || "Launch App"}
                valueColorClass="text-primary"
                href={app.entryPoint || `/`} // Fallback to home if no entry point
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


const dashboardZoneConfigs: ZoneConfig[] = [
  {
    id: 'quickActionsLaunchpad',
    title: 'Workspace Launchpad',
    icon: <Rocket className="w-5 h-5" />,
    content: <QuickActionsContent />,
    defaultLayout: {
      lg: { x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
      md: { x: 0, y: 0, w: 10, h: 4, minW: 5, minH: 3 },
      sm: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
    },
  },
  {
    id: 'activityFeed',
    title: 'Recent Activity Feed',
    icon: <Activity className="w-5 h-5" />,
    content: <ActivityFeedContent />,
    defaultLayout: {
      lg: { x: 0, y: 4, w: 6, h: 8, minW: 3, minH: 5 },
      md: { x: 0, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
      sm: { x: 0, y: 4, w: 6, h: 7, minW: 3, minH: 4 },
    },
  },
  {
    id: 'liveAgentPresence',
    title: 'Live Agent Presence',
    icon: <Cpu className="w-5 h-5" />,
    content: <AgentStatusContent />,
    defaultLayout: {
      lg: { x: 6, y: 4, w: 6, h: 8, minW: 3, minH: 5 },
      md: { x: 5, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
      sm: { x: 0, y: 11, w: 6, h: 7, minW: 3, minH: 4 },
    },
  },
  {
    id: 'deployableAppsGrid', // Renamed id
    title: 'Available Micro-Apps', // Renamed title
    icon: <LayoutGrid className="w-5 h-5" />, // Changed icon to represent apps
    content: <DeployableAppsGridContent />, // Using the new content component
    defaultLayout: {
      lg: { x: 0, y: 12, w: 12, h: 6, minW: 6, minH: 4 }, 
      md: { x: 0, y: 12, w: 10, h: 6, minW: 5, minH: 4 }, 
      sm: { x: 0, y: 18, w: 6, h: 7, minW: 4, minH: 4 },
    },
  },
];


export default function HomePage() {
  return (
    <WorkspaceGrid
      zoneConfigs={dashboardZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}

