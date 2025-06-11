
// src/app/agents/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Cpu, PlusCircle, Search, Eye, Settings2, Trash2, Zap, BarChart2, FileCode, Bot } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const agents = [
  { id: 'agt_001', name: 'OptimizerPrime', status: 'Active', role: 'Code Optimizer', training: 'Python, JS', scope: 'Project Alpha', lastActivity: '5m ago' },
  { id: 'agt_002', name: 'DataMinerX', status: 'Idle', role: 'Data Analyst', training: 'SQL, R', scope: 'Sales Data Q3', lastActivity: '2h ago' },
  { id: 'agt_003', name: 'SecureGuard', status: 'Error', role: 'Security Monitor', training: 'Network Protocols', scope: 'All Systems', lastActivity: '10s ago' },
  { id: 'agt_004', name: 'ContentCreatorAI', status: 'Active', role: 'Writer', training: 'NLP Models', scope: 'Marketing Blog', lastActivity: '30m ago' },
  { id: 'agt_005', name: 'SysAdminBot', status: 'Maintenance', role: 'System Admin', training: 'Bash, Ansible', scope: 'Production Servers', lastActivity: '1hr ago' },
];

function AgentListContent(): ReactNode { // Agent List & Overview
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3 border-b">
         <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search agents (name, role, scope...)" className="pl-10 bg-background border-input focus:ring-primary h-9 text-sm" />
            </div>
            <Link href="/onboarding" passHref> {/* Spawn agent button opens agent creation wizard */}
                <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-9">
                    <PlusCircle className="mr-2 h-4 w-4" /> Spawn New Agent
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <TooltipProvider>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Training</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {agents.map((agent) => (
                <TableRow key={agent.id}>
                    <TableCell className="font-medium text-foreground text-sm py-2">{agent.name}</TableCell>
                    <TableCell className="py-2">
                    <Badge
                        variant={
                        agent.status === 'Active' ? 'default' :
                        agent.status === 'Error' ? 'destructive' :
                        agent.status === 'Maintenance' ? 'outline' : 'secondary'
                        }
                        className={cn('text-xs',
                        agent.status === 'Active' && 'bg-primary text-primary-foreground', // Simplified for default variant
                        agent.status === 'Maintenance' && 'text-yellow-600 border-yellow-500/80 dark:text-yellow-400 dark:border-yellow-500/60'
                        )}
                    >
                        {agent.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{agent.role}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{agent.training}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{agent.scope}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{agent.lastActivity}</TableCell>
                    <TableCell className="text-right py-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>View Details / Shadow Mode</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Settings2 className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Configure Agent / Edit Scope</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete Agent</p></TooltipContent>
                    </Tooltip>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            </TooltipProvider>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AgentConfigurationContent(): ReactNode { // Scope Editing / Config Panel
  return (
    <Card className="h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Configure: <span className="text-primary">OptimizerPrime</span></CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <p className="text-xs text-muted-foreground">Adjust agent parameters, training data sources, and operational scope.</p>
        <Image src="https://placehold.co/400x300.png" alt="Agent Config Form" width={400} height={300} className="rounded-md border opacity-70" data-ai-hint="settings form interface parameters" />
        <Button className="w-full" size="sm">Save Changes</Button>
      </CardContent>
    </Card>
  );
}

function LiveAgentActivityContent(): ReactNode { // Real-time activity / Visual Debugger / "Shadow Mode"
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">Shadow Mode: <span className="text-primary">OptimizerPrime</span></CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Real-time visualization of actions and decision-making process.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 flex-grow bg-muted/30 rounded-b-md">
        <Image src="https://placehold.co/600x300.png" alt="Agent Activity Stream / Visual Debugger" width={600} height={300} className="rounded-md border" data-ai-hint="data stream activity graph logs" />
      </CardContent>
    </Card>
  );
}


export default function AgentConsolePage() {
  const agentPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'agentList',
      title: 'Agent Fleet Overview', 
      icon: <Bot className="w-5 h-5" />, 
      content: <AgentListContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 10, minW: 6, minH: 6 },
        md: { x: 0, y: 0, w: 10, h: 10, minW: 5, minH: 6 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
      },
    },
    {
      id: 'agentConfiguration', 
      title: 'Agent Configuration & Scope', 
      icon: <FileCode className="w-5 h-5" />, 
      content: <AgentConfigurationContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 5, h: 10, minW: 3, minH: 6 },
        md: { x: 0, y: 10, w: 5, h: 9, minW: 3, minH: 6 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'liveAgentDebugger', 
      title: "Live Agent Activity / Debugger", 
      icon: <BarChart2 className="w-5 h-5" />, 
      content: <LiveAgentActivityContent />,
      defaultLayout: {
        lg: { x: 5, y: 10, w: 7, h: 10, minW: 4, minH: 6 },
        md: { x: 5, y: 10, w: 5, h: 9, minW: 3, minH: 6 },
        sm: { x: 0, y: 17, w: 6, h: 8, minW: 3, minH: 5 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={agentPageZoneConfigs}
      className="flex-grow"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
    />
  );
}
