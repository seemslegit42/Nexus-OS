
'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Users, AlertTriangle, LayoutGrid, Cpu, Rocket, Info as InfoIcon, Zap, Newspaper, BarChartHorizontalBig, Shield, CalendarDays, GitMerge, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function QuickActionsContent(): ReactNode { // Workspace Launchpad
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full justify-start p-3 h-auto text-left">
            <Cpu className="mr-2 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold font-headline text-sm">Spawn New Agent</p>
              <p className="text-xs text-muted-foreground">Configure and deploy an AI agent.</p>
            </div>
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
  return (
     <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <ul className="space-y-2">
          {[
            { agent: 'OptimizerPrime', task: 'Code Review #123', time: '2m ago', icon: <Cpu /> },
            { agent: 'DataMinerX', task: 'Sales Data Sync Q3', time: '15m ago', icon: <BarChartHorizontalBig /> },
            { agent: 'SecureGuard', task: 'System Scan initiated', time: '30m ago', icon: <Shield /> },
            { agent: 'ContentCreatorAI', task: 'Blog Post Draft v2', time: '1h ago', icon: <Newspaper /> },
          ].map((item, i) => (
            <li key={i} className="flex items-start text-xs p-2 rounded-md hover:bg-muted/30">
              <span className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0">{item.icon}</span>
              <div>
                <span className="font-medium text-foreground">Agent '{item.agent}'</span> {item.task.toLowerCase().includes("completed") || item.task.toLowerCase().includes("initiated") ? "" : "completed task:"} <span className="text-accent-foreground">{item.task}</span>.
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto">View all activity</Button>
      </CardContent>
    </Card>
  );
}

function AgentStatusContent(): ReactNode { // Live Agent Presence
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="space-y-1.5">
          {[
            { name: "OptimizerPrime", status: "Active", tasks: 2, load: 75 },
            { name: "DataMinerX", status: "Idle", tasks: 0, load: 10 },
            { name: "SecureGuard", status: "Monitoring", tasks: 5, load: 90 },
            { name: "ContentCreatorAI", status: "Processing", tasks: 1, load: 60 },
          ].map((agent, i) => (
            <div key={i} className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/30">
              <div className="flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.status} - {agent.tasks} tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${agent.load > 80 ? 'bg-destructive' : agent.load > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${agent.load}%` }}></div>
                </div>
              </div>
            </div>
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
          <Link href="/security" className="block p-3 bg-background/50 hover:bg-muted/50 rounded-lg border border-border/70 transition-colors">
            <div className="flex items-center mb-1">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              <h3 className="font-headline text-sm text-foreground">Security Pulse</h3>
            </div>
            <p className="text-xs text-muted-foreground">All systems nominal. No active threats.</p>
            <p className="text-xl font-bold text-green-500 mt-0.5">Normal</p>
          </Link>
          <Link href="/updates" className="block p-3 bg-background/50 hover:bg-muted/50 rounded-lg border border-border/70 transition-colors">
            <div className="flex items-center mb-1">
              <GitMerge className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-headline text-sm text-foreground">OS Updates</h3>
            </div>
            <p className="text-xs text-muted-foreground">v1.1.0 "Orion" is live. Check changelog.</p>
             <p className="text-xs font-semibold text-accent-foreground mt-0.5">View Details</p>
          </Link>
           <Link href="/notifications" className="block p-3 bg-background/50 hover:bg-muted/50 rounded-lg border border-border/70 transition-colors">
            <div className="flex items-center mb-1">
              <Bell className="h-5 w-5 mr-2 text-yellow-500" />
              <h3 className="font-headline text-sm text-foreground">Notifications</h3>
            </div>
            <p className="text-xs text-muted-foreground">3 Unread Alerts.</p>
             <p className="text-xs font-semibold text-accent-foreground mt-0.5">View Alerts</p>
          </Link>
          <div className="block p-3 bg-background/50 hover:bg-muted/50 rounded-lg border border-border/70 transition-colors">
            <div className="flex items-center mb-1">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="font-headline text-sm text-foreground">System Status</h3>
            </div>
            <p className="text-xs text-muted-foreground">All services operational.</p>
             <p className="text-xl font-bold text-green-500 mt-0.5">Operational</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


const dashboardZoneConfigs: ZoneConfig[] = [
  {
    id: 'quickActionsLaunchpad', // Renamed
    title: 'Workspace Launchpad', // Updated
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
    title: 'Recent Activity Feed', // Updated
    icon: <Activity className="w-5 h-5" />,
    content: <ActivityFeedContent />,
    defaultLayout: {
      lg: { x: 0, y: 4, w: 6, h: 8, minW: 3, minH: 5 },
      md: { x: 0, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
      sm: { x: 0, y: 4, w: 6, h: 7, minW: 3, minH: 4 },
    },
  },
  {
    id: 'liveAgentPresence', // Renamed
    title: 'Live Agent Presence', // Updated
    icon: <Cpu className="w-5 h-5" />,
    content: <AgentStatusContent />,
    defaultLayout: {
      lg: { x: 6, y: 4, w: 6, h: 8, minW: 3, minH: 5 },
      md: { x: 5, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
      sm: { x: 0, y: 11, w: 6, h: 7, minW: 3, minH: 4 },
    },
  },
  {
    id: 'pinnedSystemWidgets', // Renamed
    title: 'System Overview & Pinned Widgets', // Updated
    icon: <InfoIcon className="w-5 h-5" />, // Changed Icon
    content: <PinnedWidgetsContent />,
    defaultLayout: {
      lg: { x: 0, y: 12, w: 12, h: 5, minW: 6, minH: 4 }, // Adjusted height
      md: { x: 0, y: 12, w: 10, h: 5, minW: 5, minH: 4 },
      sm: { x: 0, y: 18, w: 6, h: 6, minW: 4, minH: 4 },
    },
  },
];


export default function HomePage() {
  return (
    <WorkspaceGrid
      zoneConfigs={dashboardZoneConfigs}
      className="flex-grow"
    />
  );
}
