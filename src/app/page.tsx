
import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Activity, Users, AlertTriangle, LayoutGrid, Cpu, Rocket, Info as InfoIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-min">
      <Zone title="Quick Actions" icon={<Rocket className="w-5 h-5" />} className="lg:col-span-3">
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
      </Zone>

      <Zone title="Activity Feed" icon={<Activity className="w-5 h-5" />} className="lg:row-span-2">
        <ul className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="flex items-start text-sm p-2 rounded-md hover:bg-muted/50">
              <Cpu className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Agent 'OptimizerPrime'</span> completed task: <span className="text-accent-foreground">Code Review #{123+i}</span>.
                <p className="text-xs text-muted-foreground">{(i+1)*2} minutes ago</p>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="link" className="mt-2 text-primary">View all activity</Button>
      </Zone>

      <Zone title="Live Agent Presence" icon={<Users className="w-5 h-5" />}>
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
      </Zone>
      
      <Zone title="Security Pulse" icon={<AlertTriangle className="w-5 h-5" />}>
         <div className="flex flex-col items-center justify-center h-full">
            <AlertTriangle className="w-12 h-12 text-destructive mb-2" />
            <p className="text-lg font-semibold text-foreground">All Systems Nominal</p>
            <p className="text-sm text-muted-foreground">No active security threats detected.</p>
            <Button variant="outline" size="sm" className="mt-4">View Security Center</Button>
          </div>
      </Zone>

      <Zone title="Workspace Launchpad" icon={<LayoutGrid className="w-5 h-5" />} className="lg:col-span-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid/>, hint: "creative workspace" },
            { name: 'Agent Console', href: '/agents', icon: <Cpu/>, hint: "agent management" },
            { name: 'Command', href: '/command', icon: <Rocket/>, hint: "command line" },
            { name: 'Modules', href: '/modules', icon: <LayoutGrid/>, hint: "system modules" },
          ].map(item => (
            <Link href={item.href} key={item.name} className="flex flex-col items-center p-4 bg-background hover:bg-muted rounded-lg transition-colors border border-border">
                <div className="text-primary mb-2">{item.icon}</div>
                <span className="text-sm font-medium text-center text-foreground font-headline">{item.name}</span>
            </Link>
          ))}
        </div>
      </Zone>

      <Zone title="System Overview" icon={<InfoIcon className="w-5 h-5" />} className="lg:col-span-1">
        <Image src="https://placehold.co/600x400.png" alt="System Status Chart" width={600} height={400} className="rounded-md" data-ai-hint="status chart"/>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Status: <span className="text-green-500">Operational</span></p>
          <p>Pending Upgrades: 0</p>
          <p>Notifications: 3 unread</p>
        </div>
      </Zone>
    </div>
  );
}
