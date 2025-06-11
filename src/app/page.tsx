
'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Users, AlertTriangle, LayoutGrid, Cpu, Rocket, Info as InfoIcon, Zap, Newspaper, BarChartHorizontalBig, Shield, CalendarDays, GitMerge, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { Progress } from '@/components/ui/progress'; // Added Progress
import { cn } from '@/lib/utils';

function QuickActionsContent(): ReactNode { // Workspace Launchpad
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full justify-start p-3 h-auto text-left" asChild>
            <Link href="/onboarding"> {/* Assuming spawn agent leads to onboarding or a specific creation page */}
              <Cpu className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold font-headline text-sm">Spawn New Agent</p>
                <p className="text-xs text-muted-foreground">Configure and deploy an AI agent.</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start p-3 h-auto text-left" asChild>
            <Link href="/command">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold font-headline text-sm">Initiate Prompt Chain</p>
                <p className="text-xs text-muted-foreground">Open Command & Cauldron.</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start p-3 h-auto text-left" asChild>
            <Link href="/loom-studio">
              <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold font-headline text-sm">Open Loom Studio</p>
                <p className="text-xs text-muted-foreground">Visual workflow editor.</p>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityFeedContent(): ReactNode {
  const feedItems = [
    { agent: 'OptimizerPrime', task: 'Code Review #123', time: '2m ago', icon: <Cpu /> },
    { agent: 'DataMinerX', task: 'Sales Data Sync Q3', time: '15m ago', icon: <BarChartHorizontalBig /> },
    { agent: 'SecureGuard', task: 'System Scan initiated', time: '30m ago', icon: <Shield /> },
    { agent: 'ContentCreatorAI', task: 'Blog Post Draft v2', time: '1h ago', icon: <Newspaper /> },
  ];

  return (
     <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <ul className="space-y-2">
          {feedItems.map((item, i) => (
            <li key={i}>
              <Card className="bg-background/50 hover:bg-muted/50 border-border/70 transition-colors">
                <CardContent className="p-2.5 text-xs flex items-start">
                  <span className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0">{item.icon}</span>
                  <div className="flex-grow">
                    <span className="font-medium text-foreground">Agent '{item.agent}'</span> {item.task.toLowerCase().includes("completed") || item.task.toLowerCase().includes("initiated") ? "" : "completed task:"} <span className="text-accent-foreground">{item.task}</span>.
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto">View all activity</Button>
      </CardContent>
    </Card>
  );
}

function AgentStatusContent(): ReactNode { // Live Agent Presence
  const agents = [
    { name: "OptimizerPrime", status: "Active", tasks: 2, load: 75 },
    { name: "DataMinerX", status: "Idle", tasks: 0, load: 10 },
    { name: "SecureGuard", status: "Monitoring", tasks: 5, load: 90 },
    { name: "ContentCreatorAI", status: "Processing", tasks: 1, load: 60 },
  ];
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="space-y-1.5">
          {agents.map((agent, i) => (
            <Card key={i} className="bg-background/50 hover:bg-muted/50 border-border/70 transition-colors">
              <CardContent className="p-2.5 flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.status} - {agent.tasks} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-1/3 max-w-[100px]">
                  <Progress 
                    value={agent.load} 
                    className={cn(
                      "h-2 w-full",
                      agent.load <= 50 && "[&>div]:bg-green-500", // Default is primary, which is green
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
         <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto">View agent console</Button>
      </CardContent>
    </Card>
  );
}


function PinnedWidgetsContent(): ReactNode { // System Status, Upgrades, Notifications
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/security" passHref>
            <Card asChild className="bg-background/50 hover:bg-muted/50 border-border/70 transition-colors h-full">
              <a>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-headline">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    Security Pulse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">All systems nominal. No active threats.</p>
                  <p className="text-xl font-bold text-green-500 mt-1">Normal</p>
                </CardContent>
              </a>
            </Card>
          </Link>

          <Link href="/updates" passHref>
            <Card asChild className="bg-background/50 hover:bg-muted/50 border-border/70 transition-colors h-full">
              <a>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-headline">
                    <GitMerge className="h-5 w-5 mr-2 text-primary" />
                    OS Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">v1.1.0 "Orion" is live. Check changelog.</p>
                  <p className="text-sm font-semibold text-accent-foreground mt-1">View Details</p>
                </CardContent>
              </a>
            </Card>
          </Link>

           <Link href="/notifications" passHref>
            <Card asChild className="bg-background/50 hover:bg-muted/50 border-border/70 transition-colors h-full">
              <a>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-headline">
                    <Bell className="h-5 w-5 mr-2 text-yellow-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">3 Unread Alerts.</p>
                  <p className="text-sm font-semibold text-accent-foreground mt-1">View Alerts</p>
                </CardContent>
              </a>
            </Card>
          </Link>

          <Link href="/logs" passHref>
            <Card asChild className="bg-background/50 hover:bg-muted/50 border-border/70 transition-colors h-full">
                <a>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-headline">
                    <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">All services operational.</p>
                  <p className="text-xl font-bold text-green-500 mt-1">Operational</p>
                </CardContent>
                </a>
            </Card>
          </Link>
        </div>
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
    id: 'pinnedSystemWidgets', 
    title: 'System Overview & Pinned Widgets', 
    icon: <InfoIcon className="w-5 h-5" />, 
    content: <PinnedWidgetsContent />,
    defaultLayout: {
      lg: { x: 0, y: 12, w: 12, h: 6, minW: 6, minH: 4 }, 
      md: { x: 0, y: 12, w: 10, h: 6, minW: 5, minH: 4 },
      sm: { x: 0, y: 18, w: 6, h: 7, minW: 4, minH: 4 }, // Increased sm height
    },
  },
];


export default function HomePage() {
  return (
    <WorkspaceGrid
      zoneConfigs={dashboardZoneConfigs}
      className="flex-grow"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
