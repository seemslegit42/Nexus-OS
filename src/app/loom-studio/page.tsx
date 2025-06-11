
// src/app/loom-studio/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Workflow, Palette as PaletteIcon, ListChecks, GanttChartSquare, Terminal, Users,
  Link as LinkIcon, FileText, Clock, Zap, Timer, Eye, Ear, Repeat, HelpCircle, Mail, Database, CheckSquare, Bell, Server, Settings2, Sigma, Edit3, Aperture, SquareStack, MousePointerSquare, PenTool, Eraser, CaseUpper, StopCircle, FastForward, PlayCircle
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


function CanvasNode({ title, details, className }: { title: string; details: string; className?: string }) {
  return (
    <div className={cn("bg-card/80 border border-border/50 backdrop-blur-sm shadow-lg rounded-lg p-3 w-48 h-24 flex flex-col justify-center relative", className)}>
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary/70 rounded-full border-2 border-background"></div>
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary/70 rounded-full border-2 border-background"></div>
      <h4 className="text-sm font-semibold text-foreground truncate">{title}</h4>
      <p className="text-xs text-muted-foreground truncate">{details}</p>
    </div>
  );
}

function CanvasContent(): ReactNode {
  return (
    <Card className="h-full bg-muted/10 border-dashed border-border flex items-center justify-center relative overflow-hidden">
      {/* Subtle background grid pattern */}
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
      {/* Placeholder Nodes */}
      <div className="absolute top-1/4 left-1/4 flex gap-4 items-center z-10">
        <CanvasNode title="New Lead Trigger" details="POST /hooks/new_lead_event" />
        <div className="w-16 h-0.5 bg-primary/50"></div> {/* Connector */}
        <CanvasNode title="Send Welcome Email" details="To: {{lead.email}}, Template: welcome_v1" />
         <div className="w-16 h-0.5 bg-primary/50"></div> {/* Connector */}
        <CanvasNode title="Log Email Sent in CRM" details="CRM: HubSpot, Action: Update Lead Activity" />
      </div>
       <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 border-border/50 backdrop-blur-sm"><Edit3 className="h-4 w-4"/></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 border-border/50 backdrop-blur-sm"><Sigma className="h-4 w-4"/></Button>
        </div>
    </Card>
  );
}

function AgentBlocksPaletteContent(): ReactNode { 
  const inputBlocks = [
    { name: 'Webhook', icon: <LinkIcon /> },
    { name: 'Form Submit', icon: <FileText /> },
    { name: 'Time Trigger', icon: <Clock /> },
    { name: 'External Event', icon: <Zap /> },
  ];
  const stateBlocks = [
    { name: 'Wait', icon: <Timer /> },
    { name: 'Monitor', icon: <Eye /> },
    { name: 'Listen', icon: <Ear /> },
    { name: 'Loop', icon: <Repeat /> },
    { name: 'Condition', icon: <HelpCircle /> },
  ];
  const actionBlocks = [
    { name: 'Send Email', icon: <Mail /> },
    { name: 'Update CRM', icon: <Database /> },
    { name: 'Create Task', icon: <CheckSquare /> },
    { name: 'Notify Team', icon: <Bell /> },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-1 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          <Accordion type="multiple" defaultValue={['inputs', 'state-blocks', 'actions']} className="w-full">
            <AccordionItem value="inputs">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 hover:no-underline text-muted-foreground hover:text-foreground">Inputs</AccordionTrigger>
              <AccordionContent className="pb-1">
                {inputBlocks.map(tool => (
                  <Button key={tool.name} variant="ghost" className="w-full justify-start text-sm h-8 px-2 draggable-palette-item">
                    {React.cloneElement(tool.icon, { className: "mr-2 h-4 w-4 text-primary/80" })}
                    {tool.name}
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="state-blocks">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 hover:no-underline text-muted-foreground hover:text-foreground">State Blocks</AccordionTrigger>
              <AccordionContent className="pb-1">
                {stateBlocks.map(tool => (
                  <Button key={tool.name} variant="ghost" className="w-full justify-start text-sm h-8 px-2 draggable-palette-item">
                    {React.cloneElement(tool.icon, { className: "mr-2 h-4 w-4 text-primary/80" })}
                    {tool.name}
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="actions" className="border-b-0">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 hover:no-underline text-muted-foreground hover:text-foreground">Actions</AccordionTrigger>
              <AccordionContent className="pb-1">
                {actionBlocks.map(tool => (
                  <Button key={tool.name} variant="ghost" className="w-full justify-start text-sm h-8 px-2 draggable-palette-item">
                    {React.cloneElement(tool.icon, { className: "mr-2 h-4 w-4 text-primary/80" })}
                    {tool.name}
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ConsoleContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-2 flex-grow flex flex-col gap-2">
        <ScrollArea className="flex-grow border border-input bg-background/80 rounded-sm p-1.5">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-code">
            [timestamp] Agent 'WelcomeBot' started processing lead_123...{'\n'}
            [timestamp] Action: Send Welcome Email to john.doe@example.com{'\n'}
            [timestamp] Email sent successfully.{'\n'}
            [timestamp] Action: Log Email Sent in CRM for lead_123{'\n'}
            [timestamp] CRM updated.{'\n'}
            [timestamp] Agent 'WelcomeBot' completed processing lead_123.{'\n'}
          </pre>
        </ScrollArea>
        <Input placeholder="Enter command for Console/Agent..." className="h-8 bg-background border-input focus:ring-primary font-code text-sm" />
      </CardContent>
    </Card>
  );
}

function InspectorContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardContent className="p-2">
        <ScrollArea className="h-full p-1">
          <div className="text-center text-xs text-muted-foreground space-y-2 py-4">
             <Sparkles className="h-10 w-10 text-primary mx-auto mb-2 opacity-70" />
            <p className="font-semibold text-foreground">Select a node on the canvas to inspect and configure its properties.</p>
            <p>The canvas is your playground for building agentic workflows!</p>
          </div>
          {/* Placeholder for when a node IS selected */}
          {/* 
          <div className="text-xs space-y-3 p-1">
            <div>
              <p className="font-semibold text-sm text-foreground mb-0.5">Selected: <span className="text-primary font-bold">Send Welcome Email</span></p>
              <p><span className="text-muted-foreground">Type:</span> <Badge variant="secondary" className="text-xs">Action Block</Badge></p>
              <p><span className="text-muted-foreground">Status:</span> <Badge variant="default" className="text-xs bg-green-500/90 dark:bg-green-600/90 text-white">Configured</Badge></p>
            </div>
            <Separator className="bg-border/50" />
            <div>
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Properties</h4>
              <Label htmlFor="template-id" className="text-xs">Template ID</Label>
              <Input id="template-id" defaultValue="welcome_v1" className="h-7 text-xs"/>
              <Label htmlFor="recipient" className="text-xs mt-1.5 block">Recipient Email</Label>
              <Input id="recipient" defaultValue="{{lead.email}}" className="h-7 text-xs"/>
            </div>
            <Separator className="bg-border/50" />
            <div>
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <Shield className="h-3.5 w-3.5 mr-1 text-primary/80"/>Security Context
              </h4>
              <p className="text-muted-foreground italic">Required Permissions: email:send</p>
              <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-0.5">Manage Permissions</Button>
            </div>
          </div>
          */}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TimelineContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-2 border-b border-border/50">
          <CardTitle className="text-sm font-headline text-foreground">Workflow Execution Timeline</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Recording: LeadProcessing_Run_004</CardDescription>
      </CardHeader>
      <CardContent className="p-2 text-center flex-grow flex items-center justify-center bg-muted/20">
        <Image src="https://placehold.co/400x200.png" alt="Timeline visualization with token/logic graphs" width={400} height={200} className="object-contain rounded opacity-70" data-ai-hint="timeline event graph tokens debug" />
      </CardContent>
    </Card>
  );
}

function AgentHubContent(): ReactNode {
  const agents = [
    { name: 'WelcomeBot', status: 'Active', permissions: 'email:send, crm:update', logs: 'View Logs' },
    { name: 'LeadQualifier', status: 'Idle', permissions: 'crm:read, ai:analyze', logs: 'View Logs' },
    { name: 'ReportingAgent', status: 'Error', permissions: 'db:read_all', logs: 'View Logs' },
  ];
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-2 border-b">
        <CardTitle className="text-sm font-headline text-foreground">Agent Hub</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Live connected agents overview.</CardDescription>
      </CardHeader>
      <CardContent className="p-1 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          <div className="space-y-1.5">
            {agents.map(agent => (
              <Card key={agent.name} className="bg-background/60">
                <CardHeader className="p-1.5 pb-0.5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-semibold text-primary">{agent.name}</CardTitle>
                    <Badge 
                        variant={
                            agent.status === 'Active' ? 'default' : 
                            agent.status === 'Error' ? 'destructive' : 'secondary'
                          }
                          className={`text-[10px] px-1.5 py-0 h-5 ${agent.status === 'Active' ? 'bg-green-500/80': ''}`}
                    >
                        {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-1.5 text-[10px]">
                  <p className="text-muted-foreground">Perms: {agent.permissions}</p>
                   <Button variant="link" size="sm" className="p-0 h-auto text-[10px] text-accent-foreground hover:text-accent-foreground/80">{agent.logs}</Button>
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
      title: 'Loom Canvas', 
      icon: <Workflow className="w-5 h-5" />, 
      content: <CanvasContent />,
      defaultLayout: { 
        // Central, large, and static
        lg: { x: 3, y: 0, w: 6, h: 24, static: true }, 
        md: { x: 2, y: 0, w: 6, h: 24, static: true },
        sm: { x: 0, y: 0, w: 6, h: 12, static: true },
      },
      isDraggable: false, 
      isResizable: false, 
      canPin: false, 
      canMaximize: false, 
      canMinimize: false, 
      canClose: false, 
    },
    {
      id: 'agentBlocksPalette', // Renamed from toolsPalette
      title: 'Palette (Agent Blocks)', 
      icon: <PaletteIcon className="w-5 h-5" />,
      content: <AgentBlocksPaletteContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 3, h: 16, minW: 2, minH: 8 }, 
        md: { x: 0, y: 0, w: 2, h: 16, minW: 2, minH: 8 },
        sm: { x: 0, y: 12, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-5 h-5" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 9, y: 0, w: 3, h: 16, minW: 2, minH: 8 }, 
        md: { x: 8, y: 0, w: 2, h: 16, minW: 2, minH: 8 },
        sm: { x: 0, y: 20, w: 6, h: 7, minW: 3, minH: 4 }, 
      },
    },
     {
      id: 'console', // Renamed from promptLayerEditor
      title: 'Console',
      icon: <Terminal className="w-5 h-5" />,
      content: <ConsoleContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 3, h: 8, minW: 3, minH: 4 }, 
        md: { x: 0, y: 16, w: 4, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 27, w: 6, h: 6, minW: 3, minH: 3 },
      },
    },
    {
      id: 'timeline', // Renamed from timelineRecordings
      title: 'Timeline', 
      icon: <GanttChartSquare className="w-5 h-5" />, 
      content: <TimelineContent />,
      defaultLayout: {
        lg: { x: 9, y: 16, w: 3, h: 8, minW: 3, minH: 4 }, 
        md: { x: 8, y: 16, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 33, w: 6, h: 6, minW: 3, minH: 4 }, 
      },
    },
    {
      id: 'agentHub',
      title: 'Agent Hub',
      icon: <Users className="w-5 h-5" />,
      content: <AgentHubContent />,
      defaultLayout: {
        lg: { x: 0, y: 24, w: 12, h: 6, minW: 4, minH: 4 }, // Example: bottom full width
        md: { x: 4, y: 16, w: 4, h: 8, minW: 3, minH: 4 },
        sm: { x: 0, y: 39, w: 6, h: 6, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow p-1" 
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
    />
  );
}

