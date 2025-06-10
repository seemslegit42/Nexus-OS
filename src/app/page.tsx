
'use client';

import type { ReactNode } from 'react';
import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Activity, Users, AlertTriangle, LayoutGrid, Cpu, Rocket, Info as InfoIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';

function QuickActionsContent(): ReactNode {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button variant="outline" className="w-full justify-start p-4 h-auto text-left">
        <Cpu className="mr-3 h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold font-headline">Spin Up Agent</p>
          <p className="text-xs text-muted-foreground">Create and configure a new AI agent.</p>
        </div>
      </Button>
      <Button variant="outline" className="w-full justify-start p-4 h-auto text-left">
        <Rocket className="mr-3 h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold font-headline">Initiate Prompt Chain</p>
          <p className="text-xs text-muted-foreground">Start a complex task with a series of prompts.</p>
        </div>
      </Button>
      <Link href="/loom-studio">
        <Button variant="outline" className="w-full justify-start p-4 h-auto text-left">
          <LayoutGrid className="mr-3 h-6 w-6 text-primary" />
          <div>
            <p className="font-semibold font-headline">Open Loom Studio</p>
            <p className="text-xs text-muted-foreground">Access the creative and debugging workspace.</p>
          </div>
        </Button>
      </Link>
    </div>
  );
}

function ActivityFeedContent(): ReactNode {
  return (
    <>
      <ul className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="flex items-start text-sm p-2 rounded-md hover:bg-muted/50">
            <Cpu className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Agent 'OptimizerPrime'</span> completed task: <span className="text-accent-foreground">Code Review #{123 + i}</span>.
              <p className="text-xs text-muted-foreground">{(i + 1) * 2} minutes ago</p>
            </div>
          </li>
        ))}
      </ul>
      <Button variant="link" className="mt-2 text-primary">View all activity</Button>
    </>
  );
}

function LiveAgentPresenceContent(): ReactNode {
  return (
    <div className="space-y-2">
      {[
        { name: "EchoBot", status: "Idle", tasks: 2 },
        { name: "DataMinerX", status: "Processing", tasks: 1 },
        { name: "SecureGuard", status: "Monitoring", tasks: 5 },
      ].map((agent, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{agent.name}</p>
              <p className="text-xs text-muted-foreground">{agent.status} - {agent.tasks} active tasks</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'Processing' ? 'bg-green-500/20 text-green-700' : 'bg-muted text-muted-foreground'}`}>
            {agent.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function SecurityPulseContent(): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="w-12 h-12 text-destructive mb-2" />
      <p className="text-lg font-semibold text-foreground">All Systems Nominal</p>
      <p className="text-sm text-muted-foreground">No active security threats detected.</p>
      <Button variant="outline" size="sm" className="mt-4">View Security Center</Button>
    </div>
  );
}

function WorkspaceLaunchpadContent(): ReactNode {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid />, hint: "creative workspace" },
        { name: 'Agent Console', href: '/agents', icon: <Cpu />, hint: "agent management" },
        { name: 'Command', href: '/command', icon: <Rocket />, hint: "command line" },
        { name: 'Modules', href: '/modules', icon: <LayoutGrid />, hint: "system modules" },
      ].map(item => (
        <Link href={item.href} key={item.name} className="flex flex-col items-center p-4 bg-background hover:bg-muted rounded-lg transition-colors border border-border">
          <div className="text-primary mb-2">{item.icon}</div>
          <span className="text-sm font-medium text-center text-foreground font-headline">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}

function SystemOverviewContent(): ReactNode {
  return (
    <>
      <Image src="https://placehold.co/600x400.png" alt="System Status Chart" width={600} height={400} className="rounded-md" data-ai-hint="status chart" />
      <div className="mt-2 text-sm text-muted-foreground">
        <p>Status: <span className="text-green-500">Operational</span></p>
        <p>Pending Upgrades: 0</p>
        <p>Notifications: 3 unread</p>
      </div>
    </>
  );
}


const dashboardZoneConfigs: ZoneConfig[] = [
  {
    id: 'quickActions',
    title: 'Quick Actions',
    icon: <Rocket className="w-5 h-5" />,
    content: <QuickActionsContent />,
    defaultLayout: {
      lg: { x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
      md: { x: 0, y: 0, w: 10, h: 4, minW: 5, minH: 3 },
      sm: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
      xs: { x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 3 },
      xxs: { x: 0, y: 0, w: 2, h: 4, minW: 1, minH: 3 },
    },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'activityFeed',
    title: 'Activity Feed',
    icon: <Activity className="w-5 h-5" />,
    content: <ActivityFeedContent />,
    defaultLayout: {
      lg: { x: 0, y: 4, w: 4, h: 8, minW: 3, minH: 6 },
      md: { x: 0, y: 4, w: 5, h: 8, minW: 3, minH: 6 },
      sm: { x: 0, y: 4, w: 6, h: 6, minW: 3, minH: 4 },
      xs: { x: 0, y: 4, w: 4, h: 6, minW: 2, minH: 4 },
      xxs: { x: 0, y: 4, w: 2, h: 6, minW: 1, minH: 4 },
    },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'liveAgentPresence',
    title: 'Live Agent Presence',
    icon: <Users className="w-5 h-5" />,
    content: <LiveAgentPresenceContent />,
    defaultLayout: {
      lg: { x: 4, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
      md: { x: 5, y: 4, w: 5, h: 4, minW: 3, minH: 3 },
      sm: { x: 0, y: 10, w: 3, h: 4, minW: 2, minH: 3 },
      xs: { x: 0, y: 10, w: 4, h: 4, minW: 2, minH: 3 },
      xxs: { x: 0, y: 10, w: 2, h: 4, minW: 1, minH: 3 },
    },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'securityPulse',
    title: 'Security Pulse',
    icon: <AlertTriangle className="w-5 h-5" />,
    content: <SecurityPulseContent />,
    defaultLayout: {
      lg: { x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
      md: { x: 0, y: 8, w: 5, h: 4, minW: 3, minH: 3 },
      sm: { x: 3, y: 10, w: 3, h: 4, minW: 2, minH: 3 },
      xs: { x: 0, y: 14, w: 4, h: 4, minW: 2, minH: 3 },
      xxs: { x: 0, y: 14, w: 2, h: 4, minW: 1, minH: 3 },
    },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'workspaceLaunchpad',
    title: 'Workspace Launchpad',
    icon: <LayoutGrid className="w-5 h-5" />,
    content: <WorkspaceLaunchpadContent />,
    defaultLayout: {
      lg: { x: 4, y: 8, w: 8, h: 4, minW: 4, minH: 3 },
      md: { x: 5, y: 8, w: 5, h: 4, minW: 3, minH: 3 },
      sm: { x: 0, y: 14, w: 6, h: 4, minW: 3, minH: 3 },
      xs: { x: 0, y: 18, w: 4, h: 4, minW: 2, minH: 3 },
      xxs: { x: 0, y: 18, w: 2, h: 4, minW: 1, minH: 3 },
    },
    isResizable: true,
    isDraggable: true,
  },
  {
    id: 'systemOverview',
    title: 'System Overview',
    icon: <InfoIcon className="w-5 h-5" />,
    content: <SystemOverviewContent />,
    defaultLayout: {
      lg: { x: 0, y: 12, w: 12, h: 8, minW: 4, minH: 5 }, // Span full width for a larger chart-like view
      md: { x: 0, y: 12, w: 10, h: 7, minW: 4, minH: 5 },
      sm: { x: 0, y: 18, w: 6, h: 6, minW: 3, minH: 4 },
      xs: { x: 0, y: 22, w: 4, h: 6, minW: 2, minH: 4 },
      xxs: { x: 0, y: 22, w: 2, h: 6, minW: 1, minH: 4 },
    },
    isResizable: true,
    isDraggable: true,
  },
];


export default function HomePage() {
  return (
    <WorkspaceGrid
      zoneConfigs={dashboardZoneConfigs}
      className="flex-grow"
      // rowHeight={30} // You can adjust this if needed, or let WorkspaceGrid calculate it
      // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // Default cols
    />
  );
}

