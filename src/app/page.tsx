
'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Users, AlertTriangle, LayoutGrid, Cpu, Rocket, Info as InfoIcon, Zap, Newspaper, BarChartHorizontalBig } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';

function QuickActionsContent(): ReactNode {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Button variant="outline" className="w-full justify-start p-4 h-auto text-left">
        <Cpu className="mr-3 h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold font-headline">Spawn New Agent</p>
          <p className="text-xs text-muted-foreground">Configure and deploy an AI agent.</p>
        </div>
      </Button>
      <Button variant="outline" className="w-full justify-start p-4 h-auto text-left">
        <Zap className="mr-3 h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold font-headline">Execute Command</p>
          <p className="text-xs text-muted-foreground">Open Command & Cauldron.</p>
        </div>
      </Button>
      <Link href="/loom-studio">
        <Button variant="outline" className="w-full justify-start p-4 h-auto text-left">
          <LayoutGrid className="mr-3 h-6 w-6 text-primary" />
          <div>
            <p className="font-semibold font-headline">Open Loom Studio</p>
            <p className="text-xs text-muted-foreground">Visual debugger and workflow editor.</p>
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
        {[
          { agent: 'OptimizerPrime', task: 'Code Review #123', time: '2m ago' },
          { agent: 'DataMinerX', task: 'Sales Data Sync Q3', time: '15m ago' },
          { agent: 'SecureGuard', task: 'System Scan initiated', time: '30m ago' },
          { agent: 'ContentCreatorAI', task: 'Blog Post Draft v2', time: '1h ago' },
        ].map((item, i) => (
          <li key={i} className="flex items-start text-sm p-2 rounded-md hover:bg-muted/50">
            <Cpu className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Agent '{item.agent}'</span> completed task: <span className="text-accent-foreground">{item.task}</span>.
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <Button variant="link" className="mt-2 text-primary">View all activity</Button>
    </>
  );
}

function AgentStatusContent(): ReactNode {
  return (
    <div className="space-y-2">
      {[
        { name: "OptimizerPrime", status: "Active", tasks: 2, load: 75 },
        { name: "DataMinerX", status: "Idle", tasks: 0, load: 10 },
        { name: "SecureGuard", status: "Monitoring", tasks: 5, load: 90 },
         { name: "ContentCreatorAI", status: "Processing", tasks: 1, load: 60 },
      ].map((agent, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
          <div className="flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{agent.name}</p>
              <p className="text-xs text-muted-foreground">{agent.status} - {agent.tasks} active tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'Processing' || agent.status === 'Active' ? 'bg-green-500/20 text-green-700' : agent.status === 'Monitoring' ? 'bg-blue-500/20 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
              {agent.status}
            </span>
             {/* Simple load bar, replace with Progress component if available and desired */}
            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${agent.load > 80 ? 'bg-destructive' : agent.load > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${agent.load}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


function PinnedWidgetsContent(): ReactNode {
  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link href="/security" className="block p-4 bg-background/50 hover:bg-muted/50 rounded-lg border border-border/70 transition-colors">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
          <h3 className="font-headline text-md text-foreground">Security Pulse</h3>
        </div>
        <p className="text-xs text-muted-foreground">All systems nominal. No active threats detected.</p>
        <p className="text-2xl font-bold text-green-500 mt-1">Normal</p>
      </Link>
      <Link href="/updates" className="block p-4 bg-background/50 hover:bg-muted/50 rounded-lg border border-border/70 transition-colors">
        <div className="flex items-center mb-2">
          <Newspaper className="h-6 w-6 mr-2 text-primary" />
          <h3 className="font-headline text-md text-foreground">NexOS Updates</h3>
        </div>
        <p className="text-xs text-muted-foreground">Version 1.1.0 "Orion" is live. Check changelog.</p>
        <p className="text-sm font-semibold text-accent-foreground mt-1">View Details</p>
      </Link>
    </div>
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
    },
  },
  {
    id: 'activityFeed',
    title: 'Recent Activity',
    icon: <Activity className="w-5 h-5" />,
    content: <ActivityFeedContent />,
    defaultLayout: {
      lg: { x: 0, y: 4, w: 6, h: 8, minW: 3, minH: 5 },
      md: { x: 0, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
      sm: { x: 0, y: 4, w: 6, h: 7, minW: 3, minH: 4 },
    },
  },
  {
    id: 'agentStatus',
    title: 'Agent Status',
    icon: <Cpu className="w-5 h-5" />,
    content: <AgentStatusContent />,
    defaultLayout: {
      lg: { x: 6, y: 4, w: 6, h: 8, minW: 3, minH: 5 },
      md: { x: 5, y: 4, w: 5, h: 8, minW: 3, minH: 5 },
      sm: { x: 0, y: 11, w: 6, h: 7, minW: 3, minH: 4 },
    },
  },
  {
    id: 'pinnedWidgets',
    title: 'Pinned Widgets',
    icon: <BarChartHorizontalBig className="w-5 h-5" />,
    content: <PinnedWidgetsContent />,
    defaultLayout: {
      lg: { x: 0, y: 12, w: 12, h: 5, minW: 6, minH: 4 },
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

    