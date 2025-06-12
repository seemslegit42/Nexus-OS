
// src/app/loom-studio/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'; // Added React, useState, useEffect, useMemo, useCallback, useRef
import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Workflow, Palette as PaletteIcon, ListChecks, GanttChartSquare, Terminal, Users,
  FileText as PromptIcon, Aperture as AgentCallIcon, GitFork as DecisionIcon, Zap as TriggerIcon, FunctionSquare as CustomLogicIcon,
  PlusCircle, Play, PauseCircle, Sparkles, Edit3, Sigma, Blocks, LinkIcon, Clock, Timer, Eye, Ear, Repeat, HelpCircle, Mail, Database, CheckSquare, Bell, PackagePlus, Trash2,
 Undo, Redo, Lightbulb, Info, Settings, Calendar, AlertCircle, Activity, BarChart2, Loader2, X
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
// import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox'; // Kept commented
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLogs } from '@/contexts/LogContext'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// DND Kit imports are present but full drag-and-drop for nodes on canvas is not yet implemented beyond palette drop
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowNode {
  id: string;
  type: string; 
  position: { x: number; y: number; };
  title: string;
  details: string;
  icon?: ReactNode;
  status?: 'queued' | 'running' | 'failed' | 'completed';
  connections: Array<{
    targetNodeId: string;
    type?: string; 
  }>;
  previewText?: string; 
  previewData?: any; 
  groupId?: string; 
}

interface WorkflowGroup {
  id: string;
  label?: string;
}


interface CanvasNodeProps {
  title: string;
  details: string;
  className?: string;
  icon?: ReactNode;
 selected?: boolean;
  status?: 'queued' | 'running' | 'failed' | 'completed';
  previewText?: string; 
  previewData?: any;
}

const CanvasNode: React.FC<CanvasNodeProps> = ({ title, details, className, icon, status, previewText, previewData, selected }) => {
  const statusBadgeClass = React.useMemo(() => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/80 text-white';
      case 'running':
        return 'bg-yellow-500/80 text-black';
      case 'failed':
        return 'bg-destructive text-white';
      case 'queued':
      default:
        return 'bg-muted text-muted-foreground';
    }
  }, [status]);

  return (
    <div className={cn(
        "relative p-3 rounded-lg shadow-lg bg-card backdrop-blur-sm border border-border/60 w-48 min-h-[70px] flex flex-col justify-center transition-all hover:shadow-primary/30 hover:border-primary/50 cursor-grab", 
        selected && "ring-2 ring-primary shadow-primary/40",
        className
      )}>
      {status && <Badge className={cn("absolute top-1.5 right-1.5 text-[9px] h-4 px-1", statusBadgeClass)}>{status}</Badge>}
 <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm connection-point top"></div>
 <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm connection-point bottom"></div>
 <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm connection-point left"></div>
 <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm connection-point right"></div>
      
      <div className="flex items-center mb-1">
        {icon && <span className="mr-1.5 text-primary/90">{React.cloneElement(icon as React.ReactElement, { className: "w-3.5 h-3.5" })}</span>}
        <h4 className="text-xs font-semibold text-foreground truncate">{title}</h4>
      </div>
      {previewText ? (
        <ScrollArea className="mt-1 h-10 text-[9px] text-muted-foreground leading-tight border-t border-border/50 pt-1 pr-2">
          <p>{previewText}</p>
        </ScrollArea>
      ) : (
        <p className="text-[10px] text-muted-foreground leading-tight">{details}</p>
      )}
      {previewData && typeof previewData === 'object' && (
        <div className="mt-1 h-10 text-[9px] text-muted-foreground leading-tight border-t border-border/50 pt-1 pr-2 overflow-hidden">... Complex Preview ...</div>
      )}
    </div>
  );
};

interface CanvasContentProps {
    nodes: WorkflowNode[];
    setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
    groups: WorkflowGroup[];
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    addLog: (message: string, source?: string) => void;
    onNodeClick: (nodeId: string) => void;
}

function CanvasContent({ nodes, setNodes, groups, selectedNodeId, setSelectedNodeId, addLog, onNodeClick }: CanvasContentProps): ReactNode {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [connecting, setConnecting] = React.useState<{ startNodeId: string; startPointType: string; startPos: { x: number; y: number; }; } | null>(null);
  const [tempLineEnd, setTempLineEnd] = React.useState<{ x: number; y: number; } | null>(null);
  const [isTestingWorkflow, setIsTestingWorkflow] = React.useState(false);
  
  // Simplified palette item dragging logic
  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, item: { name: string; icon: ReactNode }) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(item)); // Pass item data
    event.dataTransfer.effectAllowed = 'copy';
  };


  const handleTestWorkflow = async () => {
    setIsTestingWorkflow(true);
    addLog("Workflow test initiated for 'Current Autopilot Workflow'...", "AutopilotTest");
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockOutput = { data: `Sample output ${Math.random().toString(36).substring(7)}`, status: Math.random() > 0.2 ? 'Success' : 'Failure', warnings: Math.random() > 0.7 ? ['Minor configuration issue detected'] : [] };
    addLog(`Test Output for 'Current Autopilot Workflow': ${JSON.stringify(mockOutput)}`, "AutopilotTest");
    setIsTestingWorkflow(false);
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => {
          const statuses: ('queued' | 'running' | 'failed' | 'completed')[] = ['queued', 'running', 'failed', 'completed'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          let newPreviewText = node.previewText;
          if (randomStatus === 'completed') newPreviewText = `Completed at ${new Date().toLocaleTimeString()}. Output: ${Math.random().toString(36).substring(2, 8)}`;
          else if (randomStatus === 'failed') newPreviewText = `Failed: ${Math.random() > 0.5 ? 'Timeout' : 'Invalid input'}.`;
          else if (randomStatus === 'running') newPreviewText = `Executing... Step ${Math.floor(Math.random() * 10) + 1}`;
          else newPreviewText = undefined; 
          const newPreviewData = randomStatus === 'completed' && Math.random() > 0.5 ? { metrics: { tokens: Math.floor(Math.random() * 500), time: Math.floor(Math.random() * 5000) } } : undefined;
          return { ...node, status: randomStatus, previewText: newPreviewText, previewData: newPreviewData };
        })
      );
    }, 7000); 
    return () => clearInterval(intervalId);
  }, [setNodes]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('text/plain');
    if (!type) return;
    const paletteItem = JSON.parse(type); 

    const canvasRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - canvasRect.left - (192 / 2); // Adjust for node width (192px = w-48)
    const y = event.clientY - canvasRect.top - (70 / 2);  // Adjust for node height (approx 70px)


    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: paletteItem.name, 
      position: { x: Math.max(0, x), y: Math.max(0, y) }, // Ensure non-negative positions
      title: paletteItem.name,
      details: `New ${paletteItem.name} block`,
      icon: paletteItem.icon, // Icon might not serialize well, consider passing name and re-creating
      status: 'queued', 
      connections: [], 
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    addLog(`Added new node: ${newNode.title}`, "Canvas");
  };

  const getConnectionPointPosition = (node: WorkflowNode, pointType: string) => {
    const nodeElement = document.getElementById(node.id);
    if (!nodeElement || !canvasRef.current) return null;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();
    
    let x = nodeRect.left - canvasRect.left;
    let y = nodeRect.top - canvasRect.top;

    const connectionPointRadius = 6; // Approximate center of the 12x12 point

    switch (pointType) {
      case 'top':    x += nodeRect.width / 2; y -= connectionPointRadius; break;
      case 'bottom': x += nodeRect.width / 2; y += nodeRect.height + connectionPointRadius; break;
      case 'left':   y += nodeRect.height / 2; x -= connectionPointRadius; break;
      case 'right':  y += nodeRect.height / 2; x += nodeRect.width + connectionPointRadius; break;
      default: return null;
    }
    return { x, y };
  }; 

  const handleMouseDownOnConnectionPoint = (event: React.MouseEvent<HTMLDivElement>, nodeId: string, pointType: string) => {
    event.stopPropagation(); 
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const startPos = getConnectionPointPosition(node, pointType);
    if (!startPos) return;

    setConnecting({ startNodeId: nodeId, startPointType: pointType, startPos });
    setTempLineEnd(startPos);
  };

  const handleMouseMoveOnCanvas = (event: React.MouseEvent<HTMLDivElement>) => {
    if (connecting && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setTempLineEnd({
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top,
      });
    }
  };

  const handleMouseUpOnCanvas = (event: React.MouseEvent<HTMLDivElement>) => {
    if (connecting && canvasRef.current) {
      const targetElement = event.target as HTMLElement;
      const connectionPointElement = targetElement.closest('.connection-point');
      const nodeElement = targetElement.closest('.canvas-node-wrapper'); // Assuming nodes have this class

      if (connectionPointElement && nodeElement) {
        const endNodeId = nodeElement.id;
        // Determine endPointType if needed, e.g., from data-attributes on connectionPointElement
        // const endPointType = connectionPointElement.dataset.pointType; 

        if (endNodeId && endNodeId !== connecting.startNodeId) {
          setNodes(prevNodes =>
            prevNodes.map(n =>
              n.id === connecting.startNodeId
                ? { ...n, connections: [...n.connections, { targetNodeId: endNodeId }] }
                : n
            )
          );
          addLog(`Connected ${connecting.startNodeId} to ${endNodeId}`, "Canvas");
        }
      }
      setConnecting(null);
      setTempLineEnd(null);
    }
  };
  
  const calculateGroupBounds = (groupId: string) => {
    const groupNodes = nodes.filter(node => node.groupId === groupId);
    if (groupNodes.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    groupNodes.forEach(node => {
      const nodeElement = document.getElementById(node.id);
      const nodeWidth = nodeElement?.offsetWidth || 192; 
      const nodeHeight = nodeElement?.offsetHeight || 70; 
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });
    const padding = 20;
    return { x: minX - padding, y: minY - padding, width: maxX - minX + 2 * padding, height: maxY - minY + 2 * padding };
  };

  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-1.5 md:p-2 border-b border-border/50 flex-row items-center justify-between sticky top-0 bg-card/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Undo (Ctrl+Z)"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Redo (Ctrl+Shift+Z)"><Redo className="h-4 w-4" /></Button>
        </div>
        {/* <Button onClick={handleCreateGroup} size="sm" className="h-7 text-xs mr-2">Group Selected</Button> */}
        <Button onClick={handleTestWorkflow} disabled={isTestingWorkflow} size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
          {isTestingWorkflow ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
          Test Workflow
        </Button>
      </CardHeader>
      <CardContent 
        ref={canvasRef} 
        className="flex-grow relative p-0" 
        onDrop={handleDrop} 
        onDragOver={(event) => event.preventDefault()}
        onMouseMove={handleMouseMoveOnCanvas}
        onMouseUp={handleMouseUpOnCanvas}
        onClick={() => onNodeClick(null)} // Deselect on canvas click
      >
        <svg className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
            </marker>
          </defs>
          {connecting && tempLineEnd && (
            <line
              x1={connecting.startPos.x} y1={connecting.startPos.y}
              x2={tempLineEnd.x} y2={tempLineEnd.y}
              stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5"
            />
          )}
          {nodes.map(sourceNode => (
            sourceNode.connections.map(connection => {
              const targetNode = nodes.find(n => n.id === connection.targetNodeId);
              if (!targetNode) return null;
              const sourcePoint = getConnectionPointPosition(sourceNode, 'right'); // Placeholder, improve connection point logic
              const targetPoint = getConnectionPointPosition(targetNode, 'left'); // Placeholder
              if (!sourcePoint || !targetPoint) return null;
              const midX = (sourcePoint.x + targetPoint.x) / 2;
              const pathData = `M ${sourcePoint.x} ${sourcePoint.y} C ${midX} ${sourcePoint.y}, ${midX} ${targetPoint.y}, ${targetPoint.x} ${targetPoint.y}`;
              return <path key={`${sourceNode.id}-${targetNode.id}`} d={pathData} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>;
            })
          ))}
        </svg>

        {groups.map(group => {
          const bounds = calculateGroupBounds(group.id);
          if (!bounds) return null;
          return (
            <div key={group.id} className="absolute border-2 border-dashed border-muted-foreground/50 rounded-md pointer-events-none" style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }}>
              {group.label && <div className="absolute -top-5 left-2 text-xs text-muted-foreground">{group.label}</div>}
            </div>
          );
        })}

        {nodes.map(node => (
          <div
            key={node.id} id={node.id}
            className="absolute canvas-node-wrapper" // Added wrapper class
            style={{ left: node.position.x, top: node.position.y, transform: `translate(${node.position.x}px, ${node.position.y}px)` }}
            onClick={(e) => { e.stopPropagation(); onNodeClick(node.id); }}
            onMouseDown={(e) => handleMouseDownOnConnectionPoint(e, node.id, 'right')} // Example point
          >
            <CanvasNode {...node} selected={selectedNodeId === node.id} />
          </div>
        ))}
        
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-50 pointer-events-none">
            <Blocks className="h-12 w-12 text-primary mx-auto mb-3" />
            <h2 className="text-lg font-headline text-foreground mb-1">Autopilot Workflow Canvas</h2>
            <p className="text-xs text-muted-foreground max-w-sm">Drag blocks from the Palette. Connect them to build workflows.</p>
          </div>
        )}
        <div className="absolute bottom-1.5 right-1.5 z-20 flex gap-1">
            <TooltipProvider>
                <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Edit3 className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>Edit Canvas Properties</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Sigma className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>View Variables & State</p></TooltipContent></Tooltip>
            </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentBlocksPaletteContent(): ReactNode { 
  const paletteSections = [
    { name: "Inputs", icon: <PackagePlus/>, blocks: [ { name: 'Webhook', icon: <LinkIcon /> }, { name: 'Form Submit', icon: <PromptIcon /> }, { name: 'Time Trigger', icon: <Clock /> }, { name: 'Event Trigger', icon: <TriggerIcon /> } ] },
    { name: "Logic", icon: <Blocks/>, blocks: [ { name: 'Condition', icon: <GitFork /> }, { name: 'Loop', icon: <Repeat /> }, { name: 'Wait', icon: <Timer /> }, { name: 'Custom Code', icon: <CustomLogicIcon /> } ] },
    { name: "Actions", icon: <TriggerIcon/>, blocks: [ { name: 'Agent Call', icon: <AgentCallIcon /> }, { name: 'Send Email', icon: <Mail /> }, { name: 'Database Op', icon: <Database /> }, { name: 'Notify', icon: <Bell /> } ] }
  ];
  
  // Simplified drag start for palette items
  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, item: { name: string; icon: ReactNode }) => {
    event.dataTransfer.setData('application/json', JSON.stringify(item)); // Pass item data as JSON
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-1 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          <Accordion type="multiple" defaultValue={["Inputs", "Actions"]} className="w-full">
            {paletteSections.map(section => (
              <AccordionItem value={section.name} key={section.name} className="border-border/50">
                <AccordionTrigger className="py-2 px-2 text-xs font-semibold hover:no-underline text-muted-foreground hover:text-foreground">
                  <div className="flex items-center gap-1.5">
                     {React.cloneElement(section.icon as React.ReactElement, { className: "w-3.5 h-3.5" })} {section.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-1">
                  <div className="grid grid-cols-2 gap-1.5">
                    {section.blocks.map(block => (
                      <Button 
                        key={block.name} 
                        variant="outline" 
                        className="w-full justify-start text-xs h-9 bg-card hover:bg-muted/70 border-border/70 draggable-palette-item p-2"
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)} // Use the modified handler
                        title={`Drag to add ${block.name}`}
                      >
                        {React.cloneElement(block.icon as React.ReactElement, { className: "mr-1.5 h-3.5 w-3.5 text-primary/90" })}
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

interface InspectorContentProps {
    selectedNode: WorkflowNode | null;
    onNodePropertyChange: (nodeId: string, property: keyof WorkflowNode, value: any) => void;
}
  
function InspectorContent({ selectedNode, onNodePropertyChange }: InspectorContentProps): ReactNode {
  const [suggestion, setSuggestion] = React.useState<string | null>(null); 
  React.useEffect(() => {
    const timeoutId = setTimeout(() => setSuggestion("Add 'Summarize Text' node before this email for clarity?"), 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2 h-full">
        <ScrollArea className="h-full p-0.5">
           <div className="space-y-3">
             <Card className="bg-card/80 border-border/60">
                <CardHeader className="p-2"><CardTitle className="text-sm font-headline">Workflow Settings</CardTitle></CardHeader>
                <CardContent className="p-2 space-y-2">
                    <div><Label htmlFor="workflow-expiry" className="text-xs">Set Expiry Date/Time</Label><Input id="workflow-expiry" type="datetime-local" className="mt-1 h-8 text-xs bg-input border-input focus:ring-primary" /></div>
                    <div><Label htmlFor="workflow-max-runs" className="text-xs">Max Execution Limit (0 for unlimited)</Label><Input id="workflow-max-runs" type="number" placeholder="e.g., 100" defaultValue="0" className="mt-1 h-8 text-xs bg-input border-input focus:ring-primary" /></div>
                </CardContent>
             </Card>
            <Card className="bg-card/80 border-border/60">
                <CardHeader className="p-2"><CardTitle className="text-sm font-headline flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-accent"/> Smart Suggestions</CardTitle></CardHeader>
                <CardContent className="p-2 text-xs">
                    {suggestion ? (<><p className="text-muted-foreground">{suggestion}</p><div className="flex gap-2 mt-1.5"><Button size="xs" variant="outline" className="h-6 text-xs">Accept</Button><Button size="xs" variant="ghost" className="h-6 text-xs">Dismiss</Button></div></>) : (<p className="text-muted-foreground">Select a block or add one to see contextual suggestions.</p>)}
                </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/60">
                <CardHeader className="p-2"><CardTitle className="text-sm font-headline flex items-center gap-1.5"><Activity className="w-4 h-4 text-primary"/>Execution Analytics</CardTitle></CardHeader>
                <CardContent className="p-2 text-xs space-y-0.5 text-muted-foreground">
                    <p>Total Runs (24h): <span className="font-medium text-foreground">27</span></p>
                    <p>Success Rate: <span className="font-medium text-green-400">92%</span></p>
                    <p>Avg. Runtime: <span className="font-medium text-foreground">15.3s</span></p>
                    <p>Failures Today: <span className="font-medium text-destructive">1</span> <AlertCircle className="inline h-3.5 w-3.5 ml-1 text-destructive" /></p>
                </CardContent>
            </Card>
            {selectedNode ? (
                <Card className="bg-card/80 border-border/60">
                  <CardHeader className="p-2"><CardTitle className="text-sm font-headline">Node: {selectedNode.title}</CardTitle></CardHeader>
                  <CardContent className="p-2 space-y-2">
                    <div><Label htmlFor="node-title" className="text-xs">Title</Label><Input id="node-title" type="text" value={selectedNode.title} onChange={(e) => onNodePropertyChange(selectedNode.id, 'title', e.target.value)} className="mt-1 h-8 text-xs bg-input border-input focus:ring-primary" /></div>
                    <div><Label htmlFor="node-details" className="text-xs">Details</Label><Textarea id="node-details" value={selectedNode.details} onChange={(e) => onNodePropertyChange(selectedNode.id, 'details', e.target.value)} className="mt-1 h-16 text-xs bg-input border-input focus:ring-primary" /></div>
                  </CardContent>
                </Card>
            ) : ( <div className="text-center py-4 text-muted-foreground"><Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50"/><p className="text-xs">Select a node on the canvas to inspect and configure its properties.</p></div> )}
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
        <CardTitle className="text-sm font-headline text-foreground">System & Autopilot Console</CardTitle>
        <Button variant="ghost" size="icon" onClick={clearLogs} className="h-6 w-6 text-muted-foreground hover:text-destructive" title="Clear logs"><Trash2 className="h-3.5 w-3.5"/></Button>
      </CardHeader>
      <CardContent className="p-1.5 flex-grow flex flex-col gap-1.5 overflow-hidden">
        <ScrollArea className="flex-grow border border-input/70 bg-background/60 rounded-sm p-1.5 min-h-[80px]">
          {logEntries.length === 0 ? (<p className="text-xs text-muted-foreground p-2 text-center">Console initialized. Waiting for log entries...</p>) : ( logEntries.map(entry => ( <div key={entry.id} className="text-xs font-code mb-1 last:mb-0"> <span className="text-muted-foreground/80 mr-1.5">{entry.timestamp}</span> {entry.source && <span className={cn("mr-1.5", entry.source === "AutopilotTest" ? "text-accent-foreground font-semibold" : "text-primary/90")}>[{entry.source}]</span>} <span className="text-foreground/90">{entry.message}</span></div>)))}
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
        <Button variant="outline" size="xs" className="text-xs h-7 bg-card hover:bg-muted/60"><PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Spawn New</Button>
      </CardHeader>
      <CardContent className="p-1 flex-grow overflow-hidden">
        <div className="flex gap-1 mb-1.5 px-0.5"><Button variant="secondary" size="xs" className="flex-1 h-7 text-xs bg-card hover:bg-muted/60"><Play className="mr-1.5 h-3.5 w-3.5"/>Resume All</Button><Button variant="destructive" size="xs" className="flex-1 h-7 text-xs"><PauseCircle className="mr-1.5 h-3.5 w-3.5"/>Pause All</Button></div>
        <ScrollArea className="h-[calc(100%_-_2.5rem)] p-0.5">
          <div className="space-y-1.5">
            {agents.map(agent => ( <Card key={agent.name} className="bg-card border-border/60 shadow-sm"><CardHeader className="p-1.5 pb-1"><div className="flex justify-between items-center"><CardTitle className="text-xs font-semibold text-primary">{agent.name}</CardTitle><Badge variant={agent.status === 'Active' ? 'default' : agent.status === 'Error' ? 'destructive' : 'secondary'} className={cn("text-[10px] px-1.5 py-0 h-5 leading-tight", agent.status === 'Active' ? 'bg-green-500/80 text-white': '')}>{agent.status}</Badge></div></CardHeader><CardContent className="p-1.5 pt-0 text-[10px] text-muted-foreground"><p>Tasks: {agent.tasks} | Workload: {agent.workload}%</p><p>Permissions: {agent.permissions}</p></CardContent></Card>))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default function LoomStudioPage() { 
  const { addLog } = useLogs();
  const [nodes, setNodes] = React.useState<WorkflowNode[]>([]);
  const [groups, setGroups] = React.useState<WorkflowGroup[]>([]); // Manage groups state
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  const handleNodeClick = useCallback((nodeId: string | null) => { // Allow null to deselect
    setSelectedNodeId(nodeId);
    if (nodeId) {
      addLog(`Selected node: ${nodes.find(n => n.id === nodeId)?.title || nodeId}`, "CanvasInteraction");
    } else {
      addLog("Deselected all nodes.", "CanvasInteraction");
    }
  }, [addLog, nodes]);

  const handleNodePropertyChange = useCallback((nodeId: string, property: keyof WorkflowNode, value: any) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, [property]: value, updatedAt: new Date().toISOString() } : node
      )
    );
    addLog(`Property '${String(property)}' changed for node ${nodeId}`, "Inspector");
  }, [addLog]);

  const selectedNodeObject = useMemo(() => nodes.find(node => node.id === selectedNodeId) || null, [nodes, selectedNodeId]);


  const loomStudioZoneConfigs: ZoneConfig[] = [
    {
      id: 'canvas',
      title: 'Autopilot Workflow Canvas',
      icon: <Workflow className="w-4 h-4 text-primary" />,
      content: <CanvasContent nodes={nodes} setNodes={setNodes} groups={groups} selectedNodeId={selectedNodeId} setSelectedNodeId={setSelectedNodeId} addLog={addLog} onNodeClick={handleNodeClick} />,
      defaultLayout: { lg: { x: 3, y: 0, w: 6, h: 20, minW: 4, minH: 10 } },
      canPin: false, // Canvas is central, shouldn't be pinned typically
    },
    {
      id: 'agentBlocksPalette',
      title: 'Palette',
      icon: <PaletteIcon className="w-4 h-4 text-primary" />,
      content: <AgentBlocksPaletteContent />,
      defaultLayout: { lg: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 6 } },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <Settings className="w-4 h-4 text-primary" />,
      content: <InspectorContent selectedNode={selectedNodeObject} onNodePropertyChange={handleNodePropertyChange} />,
      defaultLayout: { lg: { x: 9, y: 0, w: 3, h: 12, minW: 2, minH: 8 } },
    },
    {
      id: 'agentHub',
      title: 'Agent Hub',
      icon: <Users className="w-4 h-4 text-primary" />,
      content: <AgentHubContent />, 
      defaultLayout: { lg: { x: 0, y: 12, w: 3, h: 8, minW: 2, minH: 5 } },
    },
    {
      id: 'timeline',
      title: 'Timeline',
      icon: <GanttChartSquare className="w-4 h-4 text-primary" />,
      content: <TimelineContent />,
      defaultLayout: { lg: { x: 9, y: 12, w: 3, h: 8, minW: 2, minH: 5 } },
    },
    {
      id: 'persistentConsole',
      title: 'Console',
      icon: <Terminal className="w-4 h-4 text-primary" />,
      content: <PersistentConsoleContent />,
      defaultLayout: { lg: { x: 3, y: 20, w: 9, h: 6, minW: 4, minH: 4 } }, // Spans wider under canvas
    },
    // { id: 'aiPromptSandbox', title: 'AI Prompt Sandbox', icon: <Sparkles className="h-4 w-4 text-primary" />, content: <PromptSandbox />, defaultLayout: { lg: {x: 0, y: 20, w: 3, h: 6, minW: 2, minH: 4} } }
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      {/* TopBar is in root layout */}
      <main className="flex-grow flex pt-0"> {/* Removed pt-16 because TopBar is fixed */}
        <WorkspaceGrid
          zoneConfigs={loomStudioZoneConfigs}
          className="flex-grow p-1 md:p-2"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          storageKey="loom-studio-layout-v1"
        />
      </main>
    </div>
  );
}
