
// src/app/loom-studio/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Workflow, Palette as PaletteIcon, ListChecks, GanttChartSquare, Terminal, Users,
  FileText as PromptIcon, Aperture as AgentCallIcon, GitFork as DecisionIcon, Zap as TriggerIcon, FunctionSquare as CustomLogicIcon,
  PlusCircle, Play, PauseCircle, Sparkles, Edit3, Sigma, Blocks
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import { Label } from '@/components/ui/label';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';


function CanvasContent(): ReactNode {
  return (
    <Card className="h-full bg-muted/10 border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden p-8">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-5">
        <defs>
          <pattern id="smallGridLoom" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
          </pattern>
          <pattern id="gridLoom" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGridLoom)"/>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridLoom)" />
      </svg>
      <div className="relative z-10 text-center">
        <Blocks className="h-16 w-16 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="text-xl font-headline text-foreground mb-2">Canvas Zone</h2>
        <p className="text-muted-foreground max-w-md">
          This is where your workflows will be visually assembled. Use the input in the top bar to generate a flow using natural language, or drag elements from the Palette.
        </p>
      </div>
    </Card>
  );
}

function PaletteContent(): ReactNode { 
  const blocks = [
    { name: 'Prompt', icon: <PromptIcon /> },
    { name: 'Agent Call', icon: <AgentCallIcon /> },
    { name: 'Decision', icon: <DecisionIcon /> },
    { name: 'Trigger', icon: <TriggerIcon /> },
    { name: 'Custom Logic', icon: <CustomLogicIcon /> },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-2 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          <p className="text-xs text-muted-foreground px-2 mb-2">Drag blocks to the canvas:</p>
          <div className="space-y-1.5">
            {blocks.map(block => (
              <Button key={block.name} variant="outline" className="w-full justify-start text-sm h-10 bg-card hover:bg-accent/80 border-border/70 draggable-palette-item">
                {React.cloneElement(block.icon, { className: "mr-2 h-4 w-4 text-primary/90" })}
                {block.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function InspectorContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardContent className="p-3 h-full">
        <ScrollArea className="h-full">
           <div className="space-y-3">
            <div>
                <Label htmlFor="node-name" className="text-xs">Node Name</Label>
                <Input id="node-name" defaultValue="Prompt Step 1" placeholder="Enter node name" className="mt-1 h-8 text-sm bg-background border-input focus:ring-primary"/>
            </div>
            <div>
                <Label htmlFor="node-description" className="text-xs">Description</Label>
                <Textarea id="node-description" placeholder="Optional description" className="mt-1 min-h-[60px] text-sm bg-background border-input focus:ring-primary"/>
            </div>
            {/* 
            <Separator />
             <div>
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <Shield className="h-3.5 w-3.5 mr-1 text-primary/80"/>Security Context
              </h4>
              <p className="text-muted-foreground italic text-xs">Required Permissions: email:send</p>
              <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-0.5">Manage Permissions</Button>
            </div>
            */}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TimelineContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-3 text-center flex-grow flex items-center justify-center bg-muted/20">
        <Image src="https://placehold.co/400x200.png" alt="Timeline visualization" width={400} height={200} className="object-contain rounded opacity-70" data-ai-hint="timeline event graph tokens debug" />
      </CardContent>
       <CardFooter className="p-2 border-t">
        <p className="text-xs text-muted-foreground">Execution order, token usage, and debug path visualizer.</p>
      </CardFooter>
    </Card>
  );
}

function ConsoleContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-2 flex-grow flex flex-col gap-2">
        <ScrollArea className="flex-grow border border-input bg-background/80 rounded-sm p-1.5 min-h-[100px]">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-code">
            [timestamp] Canvas initialized.{'\n'}
            [timestamp] Palette loaded with 5 blocks.{'\n'}
          </pre>
        </ScrollArea>
        <Input placeholder="Enter command or query..." className="h-8 bg-background border-input focus:ring-primary font-code text-sm" />
      </CardContent>
    </Card>
  );
}

function AgentHubContent(): ReactNode {
  const agents = [
    { name: 'DataScribe Alpha', tasks: 5, workload: 75, permissions: 'Read/Write', status: 'Active' },
    { name: 'InsightGen Beta', tasks: 0, workload: 10, permissions: 'Read-Only', status: 'Idle' },
    { name: 'AutoResponder Gamma', tasks: 1, workload: 5, permissions: 'Send Email', status: 'Error' },
  ];
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-headline text-foreground">Connected Agents</CardTitle>
        <Button variant="outline" size="xs" className="text-xs h-7">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Spawn New Agent
        </Button>
      </CardHeader>
      <CardContent className="p-1 flex-grow overflow-hidden">
        <div className="flex gap-1 mb-1.5 px-1">
            <Button variant="secondary" size="xs" className="flex-1 h-7 text-xs"><Play className="mr-1.5 h-3.5 w-3.5"/>Resume All</Button>
            <Button variant="destructive" size="xs" className="flex-1 h-7 text-xs"><PauseCircle className="mr-1.5 h-3.5 w-3.5"/>Pause All (Safe)</Button>
        </div>
        <ScrollArea className="h-[calc(100%_-_2.5rem)] p-1">
          <div className="space-y-1.5">
            {agents.map(agent => (
              <Card key={agent.name} className="bg-background/80 border-border/60">
                <CardHeader className="p-1.5 pb-1">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-semibold text-primary">{agent.name}</CardTitle>
                    <Badge 
                        variant={
                            agent.status === 'Active' ? 'default' : 
                            agent.status === 'Error' ? 'destructive' : 'secondary'
                          }
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-5 leading-tight",
                            agent.status === 'Active' ? 'bg-green-500/80': ''
                          )}
                    >
                        {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-1.5 pt-0 text-[10px] text-muted-foreground">
                  <p>Tasks: {agent.tasks} | Workload: {agent.workload}%</p>
                  <p>Permissions: {agent.permissions}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


export default function LoomStudioPage() {
  const loomStudioPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'canvas',
      title: 'Loom Workflow Canvas', 
      icon: <Workflow className="w-5 h-5" />, 
      content: <CanvasContent />,
      defaultLayout: { 
        lg: { x: 3, y: 0, w: 6, h: 14, minW: 4, minH: 8 }, 
        md: { x: 2, y: 0, w: 6, h: 14, minW: 4, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 6 },
      },
      isDraggable: false, 
      isResizable: false, 
      canPin: false, 
      canMaximize: false, 
      canMinimize: false, 
      canClose: false, 
    },
    {
      id: 'palette',
      title: 'Palette', 
      icon: <PaletteIcon className="w-5 h-5" />,
      content: <PaletteContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 3, h: 10, minW: 2, minH: 6 }, 
        md: { x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 6 },
        sm: { x: 0, y: 9, w: 6, h: 7, minW: 3, minH: 5 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-5 h-5" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 9, y: 0, w: 3, h: 10, minW: 2, minH: 6 }, 
        md: { x: 8, y: 0, w: 2, h: 10, minW: 2, minH: 6 },
        sm: { x: 0, y: 16, w: 6, h: 7, minW: 3, minH: 5 }, 
      },
    },
     {
      id: 'console',
      title: 'Console',
      icon: <Terminal className="w-5 h-5" />,
      content: <ConsoleContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 0, y: 10, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 23, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'timeline',
      title: 'Timeline', 
      icon: <GanttChartSquare className="w-5 h-5" />, 
      content: <TimelineContent />,
      defaultLayout: {
        lg: { x: 9, y: 10, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 8, y: 10, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 29, w: 6, h: 6, minW: 3, minH: 4 }, 
      },
    },
    {
      id: 'agentHub',
      title: 'Agent Hub',
      icon: <Users className="w-5 h-5" />,
      content: <AgentHubContent />,
      defaultLayout: {
        lg: { x: 3, y: 14, w: 6, h: 10, minW: 4, minH: 6 }, 
        md: { x: 2, y: 14, w: 6, h: 10, minW: 4, minH: 6 },
        sm: { x: 0, y: 35, w: 6, h: 8, minW: 4, minH: 5 },
      },
    },
     {
      id: 'aiPromptSandbox',
      title: 'AI Prompt Sandbox',
      icon: <Sparkles className="h-5 w-5" />,
      content: <PromptSandbox />, // Re-using existing component
      defaultLayout: {
        lg: {x: 0, y: 18, w: 12, h: 6, minW: 6, minH: 4}, // Changed to fit bottom row
        md: {x: 0, y: 18, w: 10, h: 6, minW: 5, minH: 4},
        sm: {x: 0, y: 43, w: 6, h: 7, minW: 4, minH: 4},
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow p-1" 
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
      rowHeight={30} // Consistent row height
    />
  );
}
    
