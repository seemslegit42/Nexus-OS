
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
  PlusCircle, Play, PauseCircle, Sparkles, Edit3, Sigma, Blocks, LinkIcon, Clock, Timer, Eye, Ear, Repeat, HelpCircle, Mail, Database, CheckSquare, Bell, PackagePlus
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CanvasNodeProps {
  title: string;
  details: string;
  className?: string;
  icon?: ReactNode;
  status?: 'queued' | 'running' | 'failed' | 'completed'; // For future badge
}

const CanvasNode: React.FC<CanvasNodeProps> = ({ title, details, className, icon, status }) => {
  return (
    <div className={cn("relative p-3 rounded-lg shadow-lg bg-card/80 backdrop-blur-sm border border-border/60 w-48 min-h-[70px] flex flex-col justify-center transition-all hover:shadow-primary/30 hover:border-primary/50 cursor-grab", className)}>
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ring border-2 border-background shadow-sm"></div>
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ring border-2 border-background shadow-sm"></div>
      
      <div className="flex items-center mb-1">
        {icon && <span className="mr-1.5 text-primary/90">{React.cloneElement(icon as React.ReactElement, { className: "w-3.5 h-3.5" })}</span>}
        <h4 className="text-xs font-semibold text-foreground truncate">{title}</h4>
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight">{details}</p>
      {/* Future status badge: <Badge variant="outline" className="absolute top-1 right-1 px-1 py-0 text-[8px] h-4">Queued</Badge> */}
    </div>
  );
};

function CanvasContent(): ReactNode {
  return (
    <Card className="h-full bg-muted/10 border-dashed border-border/50 flex flex-col items-center justify-center relative overflow-hidden p-4">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-10 dark:opacity-[0.07]">
        <defs>
          <pattern id="smallGridLoomCanvas" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.3"/>
          </pattern>
          <pattern id="gridLoomCanvas" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGridLoomCanvas)"/>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridLoomCanvas)" />
      </svg>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center opacity-30 group-hover:opacity-100 transition-opacity">
        <Blocks className="h-12 w-12 text-primary mx-auto mb-3" />
        <h2 className="text-lg font-headline text-foreground mb-1">Loom Workflow Canvas</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          Drag blocks from the Palette or use the top-bar command palette to assemble your workflow.
        </p>
      </div>

      {/* Placeholder nodes & connectors */}
      <div className="absolute top-[20%] left-[15%] z-10">
        <CanvasNode title="New Lead Trigger" details="Webhook: new_lead_hook" icon={<LinkIcon />} />
      </div>
      <div className="absolute top-[21.5%] left-[calc(15%_+_12rem_+_0.5rem)] w-10 h-0.5 bg-border/70 z-0"></div> {/* Connector */}
      <div className="absolute top-[18%] left-[calc(15%_+_12rem_+_3.5rem)] z-10">
         <CanvasNode title="Send Welcome Email" details="Agent: EmailBot" icon={<Mail />} />
      </div>
      <div className="absolute top-[35%] left-[calc(15%_+_12rem_+_6rem)] w-0.5 h-12 bg-border/70 z-0"></div> {/* Connector */}
       <div className="absolute top-[45%] left-[calc(15%_+_12rem_+_3.5rem)] z-10">
         <CanvasNode title="Log Email Sent" details="Action: Update CRM" icon={<Database/>} />
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 bg-card/70 backdrop-blur-sm hover:bg-muted/70"><Edit3 className="h-4 w-4"/></Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-card/70 backdrop-blur-sm hover:bg-muted/70"><Sigma className="h-4 w-4"/></Button>
      </div>
    </Card>
  );
}

function AgentBlocksPaletteContent(): ReactNode { 
  const paletteSections = [
    { 
      name: "Inputs", 
      icon: <PackagePlus/>,
      blocks: [
        { name: 'Webhook', icon: <LinkIcon /> }, { name: 'Form Submit', icon: <FileText /> },
        { name: 'Time Trigger', icon: <Clock /> }, { name: 'Internal Event', icon: <Zap /> },
      ]
    },
    { 
      name: "State Blocks", 
      icon: <Blocks/>,
      blocks: [
        { name: 'Wait', icon: <Timer /> }, { name: 'Monitor', icon: <Eye /> },
        { name: 'Listen', icon: <Ear /> }, { name: 'Loop', icon: <Repeat /> }, { name: 'Condition', icon: <HelpCircle /> }
      ]
    },
    { 
      name: "Actions", 
      icon: <Zap/>,
      blocks: [
        { name: 'Send Email', icon: <Mail /> }, { name: 'Update CRM', icon: <Database /> },
        { name: 'Create Task', icon: <CheckSquare /> }, { name: 'Notify Team', icon: <Bell /> },
        { name: 'Call Agent', icon: <Aperture /> }, { name: 'Run Script', icon: <Terminal /> },
      ]
    }
  ];

  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-1 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          <Accordion type="multiple" defaultValue={["Inputs", "Actions"]} className="w-full">
            {paletteSections.map(section => (
              <AccordionItem value={section.name} key={section.name} className="border-border/50">
                <AccordionTrigger className="py-2 px-2 text-xs font-semibold hover:no-underline text-muted-foreground hover:text-foreground">
                  <div className="flex items-center gap-1.5">
                     {React.cloneElement(section.icon, { className: "w-3.5 h-3.5" })} {section.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-1">
                  <div className="grid grid-cols-2 gap-1.5">
                    {section.blocks.map(block => (
                      <Button key={block.name} variant="outline" className="w-full justify-start text-xs h-9 bg-card/60 hover:bg-muted/70 border-border/70 draggable-palette-item p-2">
                        {React.cloneElement(block.icon, { className: "mr-1.5 h-3.5 w-3.5 text-primary/90" })}
                        {block.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function InspectorContent(): ReactNode {
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2 md:p-3 h-full">
        <ScrollArea className="h-full">
           <div className="space-y-3">
             <div className="text-center py-4 text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                <p className="text-xs">Select a node on the canvas to inspect and configure its properties.</p>
             </div>
            {/* 
            // Example of selected node properties:
            <div>
                <Label htmlFor="node-name" className="text-xs text-muted-foreground">Node Name</Label>
                <Input id="node-name" defaultValue="Send Welcome Email" placeholder="Enter node name" className="mt-0.5 h-8 text-sm bg-background/70 border-input focus:ring-primary"/>
            </div>
            <div>
                <Label htmlFor="node-type" className="text-xs text-muted-foreground">Type</Label>
                <Input id="node-type" defaultValue="Agent Call" disabled className="mt-0.5 h-8 text-sm bg-muted/50 border-input"/>
            </div>
             <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="mt-0.5"><Badge variant="default" className="bg-green-500/80 text-white">Completed</Badge></div>
            </div>
            <Separator className="my-3 border-border/60"/>
             <div>
                <Label htmlFor="agent-select" className="text-xs text-muted-foreground">Agent</Label>
                <Input id="agent-select" defaultValue="EmailBot" className="mt-0.5 h-8 text-sm bg-background/70 border-input focus:ring-primary"/>
            </div>
            <div>
                <Label htmlFor="email-template" className="text-xs text-muted-foreground">Email Template</Label>
                <Textarea id="email-template" placeholder="Select or create email template..." className="mt-0.5 min-h-[60px] text-sm bg-background/70 border-input focus:ring-primary"/>
            </div>
            <Separator className="my-3 border-border/60"/>
            <div>
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-primary/80"/>Security Context
              </h4>
              <p className="text-xs text-muted-foreground mb-1">Role Permissions: <Badge variant="outline">agent:execute</Badge> <Badge variant="outline">email:send</Badge></p>
              <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-0.5 text-primary">Manage Permissions</Button>
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
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-2 text-center flex-grow flex items-center justify-center bg-muted/10 rounded-md border border-dashed border-border/50">
        <Image src="https://placehold.co/400x200.png" alt="Timeline visualization" width={400} height={200} className="object-contain rounded opacity-60" data-ai-hint="timeline event graph tokens debug" />
      </CardContent>
       <CardFooter className="p-1.5 border-t border-border/60">
        <p className="text-xs text-muted-foreground">Execution order, token usage, and debug path visualizer.</p>
      </CardFooter>
    </Card>
  );
}

function ConsoleContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-1.5 flex-grow flex flex-col gap-1.5">
        <ScrollArea className="flex-grow border border-input/70 bg-background/60 rounded-sm p-1.5 min-h-[80px]">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-code">
            {`[${new Date().toLocaleTimeString()}] Canvas initialized.
[${new Date().toLocaleTimeString()}] Palette loaded with 15 blocks.
[${new Date().toLocaleTimeString()}] Awaiting user interaction...`}
          </pre>
        </ScrollArea>
        <Input placeholder="Enter command or query..." className="h-8 bg-background/70 border-input/70 focus:ring-primary font-code text-sm" />
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
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-1.5 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-headline text-foreground">Connected Agents</CardTitle>
        <Button variant="outline" size="xs" className="text-xs h-7 bg-card/60 hover:bg-muted/60">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Spawn New
        </Button>
      </CardHeader>
      <CardContent className="p-1 flex-grow overflow-hidden">
        <div className="flex gap-1 mb-1.5 px-0.5">
            <Button variant="secondary" size="xs" className="flex-1 h-7 text-xs bg-card/50 hover:bg-muted/60"><Play className="mr-1.5 h-3.5 w-3.5"/>Resume All</Button>
            <Button variant="destructive" size="xs" className="flex-1 h-7 text-xs"><PauseCircle className="mr-1.5 h-3.5 w-3.5"/>Pause All</Button>
        </div>
        <ScrollArea className="h-[calc(100%_-_2.5rem)] p-0.5">
          <div className="space-y-1.5">
            {agents.map(agent => (
              <Card key={agent.name} className="bg-card/70 border-border/60 shadow-sm">
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
                            agent.status === 'Active' ? 'bg-green-500/80 text-white': ''
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
      icon: <Workflow className="w-4 h-4" />, 
      content: <CanvasContent />,
      defaultLayout: { 
        lg: { x: 3, y: 0, w: 6, h: 14, minW: 4, minH: 8 }, 
        md: { x: 2, y: 0, w: 6, h: 14, minW: 4, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 6 },
      },
      isDraggable: false, isResizable: false, canPin: false, canMaximize: false, canMinimize: false, canClose: false, 
    },
    {
      id: 'agentBlocksPalette', // Changed from 'palette'
      title: 'Agent Blocks Palette', // Updated title
      icon: <PaletteIcon className="w-4 h-4" />,
      content: <AgentBlocksPaletteContent />, // Updated content function
      defaultLayout: {
        lg: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 7 }, // Adjusted height
        md: { x: 0, y: 0, w: 2, h: 12, minW: 2, minH: 7 },
        sm: { x: 0, y: 9, w: 6, h: 7, minW: 3, minH: 5 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-4 h-4" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 9, y: 0, w: 3, h: 12, minW: 2, minH: 7 }, // Adjusted height
        md: { x: 8, y: 0, w: 2, h: 12, minW: 2, minH: 7 },
        sm: { x: 0, y: 16, w: 6, h: 7, minW: 3, minH: 5 }, 
      },
    },
     {
      id: 'console',
      title: 'Console',
      icon: <Terminal className="w-4 h-4" />,
      content: <ConsoleContent />, // Updated content function
      defaultLayout: {
        lg: { x: 0, y: 12, w: 3, h: 8, minW: 2, minH: 4 }, // Positioned below palette
        md: { x: 0, y: 12, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 23, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'timeline',
      title: 'Timeline', 
      icon: <GanttChartSquare className="w-4 h-4" />, 
      content: <TimelineContent />, // Updated content function
      defaultLayout: {
        lg: { x: 9, y: 12, w: 3, h: 8, minW: 2, minH: 4 }, // Positioned below inspector
        md: { x: 8, y: 12, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 29, w: 6, h: 6, minW: 3, minH: 4 }, 
      },
    },
    {
      id: 'agentHub',
      title: 'Agent Hub',
      icon: <Users className="w-4 h-4" />,
      content: <AgentHubContent />, // New content function
      defaultLayout: {
        lg: { x: 3, y: 14, w: 6, h: 10, minW: 4, minH: 6 }, // Positioned below canvas
        md: { x: 2, y: 14, w: 6, h: 10, minW: 4, minH: 6 },
        sm: { x: 0, y: 35, w: 6, h: 8, minW: 4, minH: 5 },
      },
    },
     {
      id: 'aiPromptSandbox',
      title: 'AI Prompt Sandbox',
      icon: <Sparkles className="h-4 w-4" />,
      content: <PromptSandbox />, 
      defaultLayout: {
        lg: {x: 0, y: 20, w: 12, h: 6, minW: 6, minH: 4}, 
        md: {x: 0, y: 20, w: 10, h: 6, minW: 5, minH: 4},
        sm: {x: 0, y: 43, w: 6, h: 7, minW: 4, minH: 4},
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow p-1" 
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
      rowHeight={25} // Adjusted for potentially denser layout
    />
  );
}
