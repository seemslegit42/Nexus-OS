
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
  PlusCircle, Play, PauseCircle, Sparkles, Edit3, Sigma, Blocks, LinkIcon, Clock, Timer, Eye, Ear, Repeat, HelpCircle, Mail, Database, CheckSquare, Bell, PackagePlus, Trash2,
  Undo, Redo, Lightbulb, Info, Settings, Calendar, AlertCircle, Activity, BarChart2, Loader2
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
import { useLogs } from '@/contexts/LogContext'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface CanvasNodeProps {
  title: string;
  details: string;
  className?: string;
  icon?: ReactNode;
  status?: 'queued' | 'running' | 'failed' | 'completed';
}

const CanvasNode: React.FC<CanvasNodeProps> = ({ title, details, className, icon, status }) => {
  return (
    <div className={cn("relative p-3 rounded-lg shadow-lg bg-card backdrop-blur-sm border border-border/60 w-48 min-h-[70px] flex flex-col justify-center transition-all hover:shadow-primary/30 hover:border-primary/50 cursor-grab", className)}>
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ring border-2 border-background shadow-sm"></div>
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ring border-2 border-background shadow-sm"></div>
      
      <div className="flex items-center mb-1">
        {icon && <span className="mr-1.5 text-primary/90">{React.cloneElement(icon as React.ReactElement, { className: "w-3.5 h-3.5" })}</span>}
        <h4 className="text-xs font-semibold text-foreground truncate">{title}</h4>
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight">{details}</p>
    </div>
  );
};

function CanvasContent({ addLog }: { addLog: (message: string, source?: string) => void }): ReactNode {
  const [isTestingWorkflow, setIsTestingWorkflow] = React.useState(false);

  const handleTestWorkflow = async () => {
    setIsTestingWorkflow(true);
    addLog("Workflow test initiated for 'Current Autopilot Workflow'...", "AutopilotTest");
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockOutput = { data: `Sample output ${Math.random().toString(36).substring(7)}`, status: Math.random() > 0.2 ? 'Success' : 'Failure', warnings: Math.random() > 0.7 ? ['Minor configuration issue detected'] : [] };
    addLog(`Test Output for 'Current Autopilot Workflow': ${JSON.stringify(mockOutput)}`, "AutopilotTest");
    setIsTestingWorkflow(false);
  };

  return (
    <Card className="h-full bg-muted/10 border-dashed border-border/50 flex flex-col items-center justify-center relative overflow-hidden p-1">
       <CardHeader className="absolute top-0 left-0 right-0 z-20 flex flex-row items-center justify-between p-1.5 bg-card/50 backdrop-blur-sm rounded-t-md border-b border-border/50">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Undo (Ctrl+Z)"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Redo (Ctrl+Shift+Z)"><Redo className="h-4 w-4" /></Button>
        </div>
        <Button onClick={handleTestWorkflow} disabled={isTestingWorkflow} size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
          {isTestingWorkflow ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
          Test Workflow
        </Button>
      </CardHeader>

      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-10 dark:opacity-[0.07] mt-8">
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
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center opacity-30 group-hover:opacity-100 transition-opacity mt-8">
        <Blocks className="h-12 w-12 text-primary mx-auto mb-3" />
        <h2 className="text-lg font-headline text-foreground mb-1">Autopilot Workflow Canvas</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          Drag blocks from the Palette. Pro Tip: Use Del to delete selected blocks.
        </p>
      </div>

      {/* Example nodes for visual context */}
      <div className="absolute top-[30%] left-[15%] z-10">
        <CanvasNode title="New Lead Trigger" details="Webhook: new_lead_hook" icon={<LinkIcon />} />
      </div>
      <div className="absolute top-[31.5%] left-[calc(15%_+_12rem_+_0.5rem)] w-10 h-0.5 bg-border/70 z-0"></div>
      <div className="absolute top-[28%] left-[calc(15%_+_12rem_+_3.5rem)] z-10">
         <CanvasNode title="Send Welcome Email" details="Agent: EmailBot" icon={<Mail />} />
      </div>
       <div className="absolute top-[calc(28%_+_4.5rem_+_1rem)] left-[calc(15%_+_12rem_+_6rem)] w-0.5 h-12 bg-border/70 z-0 rotate-[30deg] origin-top-left"></div>
       <div className="absolute top-[calc(28%_+_4.5rem_+_1rem)] left-[calc(15%_+_12rem_+_6rem)] w-0.5 h-12 bg-border/70 z-0 rotate-[-30deg] origin-top-left"></div>

      <div className="absolute top-[calc(28%_+_10rem)] left-[calc(15%_+_12rem_+_0.5rem)] z-10">
         <CanvasNode title="If HighValueLead?" details="Condition: lead.score > 70" icon={<GitFork />} />
      </div>
       <div className="absolute top-[calc(28%_+_11.5rem)] left-[calc(15%_+_12rem_+_12rem_+_1rem)] w-10 h-0.5 bg-border/70 z-0"></div>
      <div className="absolute top-[calc(28%_+_10rem)] left-[calc(15%_+_12rem_+_12rem_+_4rem)] z-10">
         <CanvasNode title="Notify Sales Rep" details="Agent: SlackBot" icon={<Bell />} />
      </div>


      <div className="absolute bottom-1.5 right-1.5 z-20 flex gap-1">
        <TooltipProvider>
          <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Edit3 className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>Edit Canvas Properties</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Sigma className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>View Variables & State</p></TooltipContent></Tooltip>
        </TooltipProvider>
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
        { name: 'Time Trigger', icon: <Clock /> }, { name: 'Internal Event', icon: <TriggerIcon /> },
      ]
    },
    { 
      name: "State Blocks", 
      icon: <Blocks/>,
      blocks: [
        { name: 'Wait', icon: <Timer /> }, { name: 'Monitor', icon: <Eye /> },
        { name: 'Listen', icon: <Ear /> }, { name: 'Loop', icon: <Repeat /> }, { name: 'Condition', icon: <GitFork /> } 
      ]
    },
    { 
      name: "Actions", 
      icon: <TriggerIcon/>, 
      blocks: [
        { name: 'Send Email', icon: <Mail /> }, { name: 'Update CRM', icon: <Database /> },
        { name: 'Create Task', icon: <CheckSquare /> }, { name: 'Notify Team', icon: <Bell /> },
        { name: 'Call Agent', icon: <AgentCallIcon /> }, { name: 'Run Script', icon: <Terminal /> },
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
                      <Button key={block.name} variant="outline" className="w-full justify-start text-xs h-9 bg-card hover:bg-muted/70 border-border/70 draggable-palette-item p-2">
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
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  // Simulate suggestion when a (conceptual) "Email" node is selected
  React.useEffect(() => {
    // This would normally be triggered by canvas interaction state
    const timeoutId = setTimeout(() => setSuggestion("Add 'Summarize Text' node before this email for clarity?"), 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-2 md:p-3 h-full">
        <ScrollArea className="h-full">
           <div className="space-y-3">
             {/* Placeholder for when no node is selected or for global workflow settings */}
             <Card className="bg-card/80 border-border/60">
                <CardHeader className="p-2"><CardTitle className="text-sm font-headline">Workflow Settings</CardTitle></CardHeader>
                <CardContent className="p-2 space-y-2">
                    <div>
                        <Label htmlFor="workflow-expiry" className="text-xs">Set Expiry Date/Time</Label>
                        <Input id="workflow-expiry" type="datetime-local" className="mt-1 h-8 text-xs bg-input border-input focus:ring-primary" />
                    </div>
                    <div>
                        <Label htmlFor="workflow-max-runs" className="text-xs">Max Execution Limit (0 for unlimited)</Label>
                        <Input id="workflow-max-runs" type="number" placeholder="e.g., 100" defaultValue="0" className="mt-1 h-8 text-xs bg-input border-input focus:ring-primary" />
                    </div>
                </CardContent>
             </Card>

            <Card className="bg-card/80 border-border/60">
                <CardHeader className="p-2">
                    <CardTitle className="text-sm font-headline flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-accent"/> Smart Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2 text-xs">
                    {suggestion ? (
                        <>
                            <p className="text-muted-foreground">{suggestion}</p>
                            <div className="flex gap-2 mt-1.5">
                                <Button size="xs" variant="outline" className="h-6 text-xs">Accept</Button>
                                <Button size="xs" variant="ghost" className="h-6 text-xs">Dismiss</Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground">Select a block or add one to see contextual suggestions.</p>
                    )}
                </CardContent>
            </Card>
            
            <Card className="bg-card/80 border-border/60">
                <CardHeader className="p-2"><CardTitle className="text-sm font-headline flex items-center gap-1.5"><Activity className="w-4 h-4 text-primary"/>Execution Analytics</CardTitle></CardHeader>
                <CardContent className="p-2 text-xs space-y-0.5 text-muted-foreground">
                    <p>Total Runs (24h): <span className="font-medium text-foreground">27</span></p>
                    <p>Success Rate: <span className="font-medium text-green-400">92%</span></p>
                    <p>Avg. Runtime: <span className="font-medium text-foreground">15.3s</span></p>
                    <p>Failures Today: <span className="font-medium text-destructive">1</span></AlertCircle></p>
                </CardContent>
            </Card>

             <div className="text-center py-4 text-muted-foreground hidden"> {/* Default placeholder for selected node */}
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                <p className="text-xs">Select a node on the canvas to inspect and configure its properties.</p>
             </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TimelineContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-2 text-center flex-grow flex flex-col items-center justify-center bg-muted/10 rounded-md border border-dashed border-border/50">
        <BarChart2 className="h-10 w-10 text-primary opacity-50 mb-2"/>
        <p className="text-sm font-medium text-foreground">Execution Timeline & Logic Path</p>
        <p className="text-xs text-muted-foreground mt-1">Visual feedback on execution order, token usage, and branching logic outcomes will appear here after a test run.</p>
      </CardContent>
       <CardFooter className="p-1.5 border-t border-border/60">
        <p className="text-xs text-muted-foreground">Analyze workflow performance and debug paths.</p>
      </CardFooter>
    </Card>
  );
}

function PersistentConsoleContent(): ReactNode { 
  const { logEntries, clearLogs } = useLogs();
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-1.5 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-headline text-foreground">System & Autopilot Console</CardTitle> {/* Updated Title */}
        <Button variant="ghost" size="icon" onClick={clearLogs} className="h-6 w-6 text-muted-foreground hover:text-destructive" title="Clear logs">
          <Trash2 className="h-3.5 w-3.5"/>
        </Button>
      </CardHeader>
      <CardContent className="p-1.5 flex-grow flex flex-col gap-1.5 overflow-hidden">
        <ScrollArea className="flex-grow border border-input/70 bg-background/60 rounded-sm p-1.5 min-h-[80px]">
          {logEntries.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2 text-center">Console initialized. Waiting for log entries...</p>
          ) : (
            logEntries.map(entry => (
              <div key={entry.id} className="text-xs font-code mb-1 last:mb-0">
                <span className="text-muted-foreground/80 mr-1.5">{entry.timestamp}</span>
                {entry.source && <span className={cn(
                    "mr-1.5",
                    entry.source === "AutopilotTest" ? "text-accent-foreground font-semibold" : "text-primary/90"
                )}>
                    [{entry.source}]
                </span>}
                <span className="text-foreground/90">{entry.message}</span>
              </div>
            ))
          )}
        </ScrollArea>
        <Input placeholder="Enter command or query (read-only for logs)..." className="h-8 bg-input border-input/70 focus:ring-primary font-code text-sm" readOnly />
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
        <Button variant="outline" size="xs" className="text-xs h-7 bg-card hover:bg-muted/60">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Spawn New
        </Button>
      </CardHeader>
      <CardContent className="p-1 flex-grow overflow-hidden">
        <div className="flex gap-1 mb-1.5 px-0.5">
            <Button variant="secondary" size="xs" className="flex-1 h-7 text-xs bg-card hover:bg-muted/60"><Play className="mr-1.5 h-3.5 w-3.5"/>Resume All</Button>
            <Button variant="destructive" size="xs" className="flex-1 h-7 text-xs"><PauseCircle className="mr-1.5 h-3.5 w-3.5"/>Pause All</Button>
        </div>
        <ScrollArea className="h-[calc(100%_-_2.5rem)] p-0.5">
          <div className="space-y-1.5">
            {agents.map(agent => (
              <Card key={agent.name} className="bg-card border-border/60 shadow-sm">
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

export default function AutopilotStudioPage() { // Renamed from LoomStudioPage
  const { addLog } = useLogs(); // Get addLog from context

  const autopilotStudioPageZoneConfigs: ZoneConfig[] = [ // Renamed variable
    {
      id: 'canvas',
      title: 'Autopilot Workflow Canvas',  // Updated title
      icon: <Workflow className="w-4 h-4" />, 
      content: <CanvasContent addLog={addLog} />, // Pass addLog
      defaultLayout: { 
        lg: { x: 3, y: 0, w: 6, h: 14, minW: 4, minH: 8 }, 
        md: { x: 2, y: 0, w: 6, h: 14, minW: 4, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 6 },
      },
      isDraggable: false, isResizable: false, canPin: false, canMaximize: false, canMinimize: false, canClose: false, 
    },
    {
      id: 'agentBlocksPalette', 
      title: 'Autopilot Blocks Palette', // Updated title
      icon: <PaletteIcon className="w-4 h-4" />,
      content: <AgentBlocksPaletteContent />, 
      defaultLayout: {
        lg: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 7 }, 
        md: { x: 0, y: 0, w: 2, h: 12, minW: 2, minH: 7 },
        sm: { x: 0, y: 9, w: 6, h: 7, minW: 3, minH: 5 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector & Suggestions', // Updated title
      icon: <Settings className="w-4 h-4" />, // Changed Icon
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 9, y: 0, w: 3, h: 12, minW: 2, minH: 7 }, 
        md: { x: 8, y: 0, w: 2, h: 12, minW: 2, minH: 7 },
        sm: { x: 0, y: 16, w: 6, h: 7, minW: 3, minH: 5 }, 
      },
    },
     {
      id: 'console',
      title: 'System & Autopilot Console', // Updated title
      icon: <Terminal className="w-4 h-4" />,
      content: <PersistentConsoleContent />, 
      defaultLayout: {
        lg: { x: 0, y: 12, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 0, y: 12, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 23, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'timeline',
      title: 'Execution Timeline & Path',  // Updated title
      icon: <GanttChartSquare className="w-4 h-4" />, 
      content: <TimelineContent />, 
      defaultLayout: {
        lg: { x: 9, y: 12, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 8, y: 12, w: 2, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 29, w: 6, h: 6, minW: 3, minH: 4 }, 
      },
    },
    {
      id: 'agentHub',
      title: 'Agent Hub',
      icon: <Users className="w-4 h-4" />,
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
      zoneConfigs={autopilotStudioPageZoneConfigs} // Use renamed variable
      className="flex-grow p-1" 
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
      rowHeight={25} 
    />
  );
}

