
// src/app/loom-studio/page.tsx
'use client';

import GridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import type { ReactNode } from 'react';
import { TopBar } from '@/components/core/top-bar';
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
import React from 'react';
import { Label } from '@/components/ui/label';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLogs } from '@/contexts/LogContext'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowNode {
  id: string;
  type: string; // e.g., 'prompt', 'agentCall', 'decision'
  position: { x: number; y: number; };
  title: string;
  details: string;
  icon?: ReactNode;
  status?: 'queued' | 'running' | 'failed' | 'completed';
  connections: Array<{
    targetNodeId: string;
 // targetConnectionPointType?: string; // Optional: to specify which point on the target
    type?: string; // e.g., 'success', 'failure'
    // Add startPoint and endPoint type to connections for more specific line drawing later
    // startPointType?: string; // e.g., 'right', 'bottom'
    // endPointType?: string; // e.g., 'left', 'top'
  }>;
  previewText?: string; // For simple text previews
  previewData?: any; // For more complex preview data
  groupId?: string; // Optional: ID of the group this node belongs to
}

interface WorkflowGroup {
  id: string;
  label?: string;
  // You might add position and size properties later for manual group placement/resizing
}


interface CanvasNodeProps {
  title: string;
  details: string;
  className?: string;
  icon?: ReactNode;
 selected?: boolean;
  status?: 'queued' | 'running' | 'failed' | 'completed';
  previewText?: string; // For simple text previews
  previewData?: any;
}

const CanvasNode: React.FC<CanvasNodeProps> = ({ title, details, className, icon, status, previewText, previewData }) => {
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
    <div className={cn("relative p-3 rounded-lg shadow-lg bg-card backdrop-blur-sm border border-border/60 w-48 min-h-[70px] flex flex-col justify-center transition-all hover:shadow-primary/30 hover:border-primary/50 cursor-grab", className)}>
      {status && <Badge className={cn("absolute top-1.5 right-1.5 text-[9px] h-4 px-1", statusBadgeClass)}>{status}</Badge>}
      {/* Placeholder Connection Points (adjust positioning as needed) */}
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
      {/* Placeholder for more complex preview UI based on previewData */}
      {previewData && typeof previewData === 'object' && (
        <div className="mt-1 h-10 text-[9px] text-muted-foreground leading-tight border-t border-border/50 pt-1 pr-2 overflow-hidden">... Complex Preview ...</div>
      )}
    </div>
  );
};

function CanvasContent({ addLog }: { addLog: (message: string, source?: string) => void }): ReactNode {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = React.useState<WorkflowNode[]>([]);
  const [groups, setGroups] = React.useState<WorkflowGroup[]>([]);
 const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [connecting, setConnecting] = React.useState<{ startNodeId: string; startPointType: string; startPos: { x: number; y: number; }; } | null>(null);
  const [tempLineEnd, setTempLineEnd] = React.useState<{ x: number; y: number; } | null>(null);


  const [isCreatingGroup, setIsCreatingGroup] = React.useState(false);
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

  React.useEffect(() => {
    // Simulate workflow execution status and preview data updates
    const intervalId = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => {
          // Simulate status change
          const statuses: ('queued' | 'running' | 'failed' | 'completed')[] = ['queued', 'running', 'failed', 'completed'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Simulate preview text update
          let newPreviewText = node.previewText;
          if (randomStatus === 'completed') {
            newPreviewText = `Completed successfully at ${new Date().toLocaleTimeString()}. Output: ${Math.random().toString(36).substring(2, 8)}`;
          } else if (randomStatus === 'failed') {
             newPreviewText = `Failed with error: ${Math.random() > 0.5 ? 'Timeout' : 'Invalid input'}.`;
          } else if (randomStatus === 'running') {
             newPreviewText = `Executing... Step ${Math.floor(Math.random() * 10) + 1} of 15`;
          } else {
             newPreviewText = undefined; // Clear preview for queued
          }

          // Simulate complex preview data (placeholder)
          const newPreviewData = randomStatus === 'completed' && Math.random() > 0.5 ? { metrics: { tokens: Math.floor(Math.random() * 500), time: Math.floor(Math.random() * 5000) } } : undefined;

          return { ...node, status: randomStatus, previewText: newPreviewText, previewData: newPreviewData };
        })
      );
    }, 5000); // Update every 5 seconds
    return () => clearInterval(intervalId);
  }, []);
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('text/plain');
    const paletteItem = JSON.parse(type); // Assuming you stringify the item

    const canvasRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: paletteItem.name, // Use name from palette as type for now
      position: { x, y },
      title: paletteItem.name,
      details: `New ${paletteItem.name} block`,
      icon: paletteItem.icon,
      status: 'queued', // Default status
      connections: [], // Initialize with no connections
      // groupId: undefined, // Initially not in a group
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodePropertyChange = (nodeId: string, property: keyof WorkflowNode, value: any) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, [property]: value } : node
      )
    );
  };

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  // Offset for connection points relative to the node's top-left corner
  const connectionPointOffset = 6; // Half the size of the connection point div + border

  const getConnectionPointPosition = (node: WorkflowNode, pointType: string) => {
    const nodeElement = document.getElementById(node.id);
    if (!nodeElement) return null;

    const pointElement = nodeElement.querySelector(`.connection-point.${pointType}`) as HTMLElement;
    if (!pointElement) return null;

    const nodeRect = nodeElement.getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

    // Calculate position relative to the canvas origin
    let x = node.position.x;
    let y = node.position.y;

    // Adjust for the connection point's absolute positioning
    switch (pointType) {
      case 'top': y -= connectionPointOffset; x += nodeElement.offsetWidth / 2; break;
      case 'bottom': y += nodeElement.offsetHeight + connectionPointOffset; x += nodeElement.offsetWidth / 2; break;
      case 'left': x -= connectionPointOffset; y += nodeElement.offsetHeight / 2; break;
      case 'right': x += nodeElement.offsetWidth + connectionPointOffset; y += nodeElement.offsetHeight / 2; break;
 default: break;
    }


    return { x, y };
  }; 

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent canvas click for selection when starting connection drag

    const target = event.target as HTMLElement;
    if (target.classList.contains('connection-point')) {
      const nodeElement = target.closest('.relative') as HTMLElement;
      if (!nodeElement) return;

      const nodeId = nodeElement.id;
      const pointType = Array.from(target.classList).find(cls => ['top', 'bottom', 'left', 'right'].includes(cls));
      if (!nodeId || !pointType) return;

      const startPos = getConnectionPointPosition(nodes.find(n => n.id === nodeId)!, pointType);
      if (!startPos) return;

      setConnecting({ startNodeId: nodeId, startPointType: pointType, startPos });
      setTempLineEnd(startPos);
      
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (connecting && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setTempLineEnd({
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top,
      });
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent canvas click for selection when ending connection drag
    if (connecting && canvasRef.current) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('connection-point')) {
        const endNodeElement = target.closest('.relative') as HTMLElement;
        if (endNodeElement) {
          const endNodeId = endNodeElement.id;
          const endPointType = Array.from(target.classList).find(cls => ['top', 'bottom', 'left', 'right'].includes(cls));

          if (endNodeId && endPointType && endNodeId !== connecting.startNodeId) {
            // Create the connection
            setNodes(prevNodes =>
              prevNodes.map(node =>
                node.id === connecting.startNodeId
                  ? {
                      ...node,
                      connections: [...node.connections, { targetNodeId: endNodeId }],
                    }
                  : node
              )
            );
          }
        }
      }
      setConnecting(null);
      setTempLineEnd(null);
    }
  };

  const handleCanvasClick = () => {
    setSelectedNodeId(null); // Deselect node when clicking canvas
  };

  // Logic to calculate group bounding box
  const calculateGroupBounds = (groupId: string) => {
    const groupNodes = nodes.filter(node => node.groupId === groupId);
    if (groupNodes.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    groupNodes.forEach(node => {
      // You'll need a way to get the actual rendered size of the node here.
      // For now, let's use a placeholder size.
      const nodeElement = document.getElementById(node.id);
      const nodeWidth = nodeElement?.offsetWidth || 200; // Placeholder width
      const nodeHeight = nodeElement?.offsetHeight || 70; // Placeholder height

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });

    const padding = 20; // Add some padding around the nodes

    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding,
    };
  };

  // Basic multiple selection placeholder - can be improved later
  const selectedNodeIds = selectedNodeId ? [selectedNodeId] : [];

  const handleCreateGroup = () => {
    if (selectedNodeIds.length === 0) {
      // Optionally show a message that no nodes are selected
      return;
    }

    const newGroupId = uuidv4();
    const newGroup: WorkflowGroup = { id: newGroupId, label: `Group ${groups.length + 1}` }; // Default label

    setNodes(prevNodes =>
      prevNodes.map(node => selectedNodeIds.includes(node.id) ? { ...node, groupId: newGroupId } : node)
    );
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };


  return (
    <div ref={canvasRef} className="flex-grow relative" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
      {/* Define arrowhead marker */}
      <svg className="absolute inset-0 z-10 pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
          </marker>
        </defs>
         {/* Temporary line for drawing connections */}
        {connecting && tempLineEnd && (
          <line
            x1={connecting.startPos.x}
            y1={connecting.startPos.y}
            x2={tempLineEnd.x}
            y2={tempLineEnd.y}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
        {nodes.map(sourceNode => (
          sourceNode.connections.map(connection => {
            const targetNode = nodes.find(n => n.id === connection.targetNodeId);
            if (!targetNode) return null;

            // For simplicity, let's assume connections always go from the right of the source to the left of the target
            const sourcePoint = getConnectionPointPosition(sourceNode, 'right'); // You'll need logic to determine the actual points
            const targetPoint = getConnectionPointPosition(targetNode, 'left'); // You'll need logic to determine the actual points

            if (!sourcePoint || !targetPoint) return null;

            // Create a path for a slightly curved line (optional)
            const midX = (sourcePoint.x + targetPoint.x) / 2;
            const pathData = `M ${sourcePoint.x} ${sourcePoint.y} C ${midX} ${sourcePoint.y}, ${midX} ${targetPoint.y}, ${targetPoint.x} ${targetPoint.y}`;

            return (
              <path key={`${sourceNode.id}-${targetNode.id}`} d={pathData} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            );
          })
        ))}
      </svg>

      {/* Render Groups */}
      {groups.map(group => {
        const bounds = calculateGroupBounds(group.id);
        if (!bounds) return null;

        return (
          <div
            key={group.id}
            className="absolute border-2 border-dashed border-muted-foreground/50 rounded-md pointer-events-none"
            style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }}
          >
            {group.label && <div className="absolute -top-5 left-2 text-xs text-muted-foreground">{group.label}</div>}
          </div>
        );
      })}

      <div className="absolute inset-0 z-0" onClick={handleCanvasClick}>
          {/* Background click handler for deselecting */}
      </div>

    {/* Render Nodes */}
    {nodes.map(node => {
 return (
 <div
 key={node.id}
 id={node.id}
 className="absolute"
 style={{ left: node.position.x, top: node.position.y }}
 onClick={() => handleNodeClick(node.id)} // Add click listener for selection
 onMouseDown={handleMouseDown} // Add mouse down listener for connection start
 >
 <CanvasNode {...node} selected={selectedNodeId === node.id} />
 </div>
 );
 })}

       <CardHeader className="absolute top-0 left-0 right-0 z-20 flex flex-row items-center justify-between p-1.5 bg-card/50 backdrop-blur-sm rounded-t-md border-b border-border/50">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Undo (Ctrl+Z)"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Redo (Ctrl+Shift+Z)"><Redo className="h-4 w-4" /></Button>
        </div>
        <Button onClick={handleCreateGroup} size="sm" className="h-7 text-xs mr-2">Group Selected Nodes</Button> {/* Added Group Button */}
        <Button onClick={handleTestWorkflow} disabled={isTestingWorkflow} size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
          {isTestingWorkflow ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
          Test Workflow
        </Button>
      </CardHeader>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.07] mt-8 bg-[url('/path/to/grid-pattern.svg')] bg-repeat"></div> {/* Replace with actual grid pattern */}
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center opacity-30 group-hover:opacity-100 transition-opacity mt-8">
        <Blocks className="h-12 w-12 text-primary mx-auto mb-3" />
        <h2 className="text-lg font-headline text-foreground mb-1">Autopilot Workflow Canvas</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          Drag blocks from the Palette. Pro Tip: Use Del to delete selected blocks.
        </p>

      <div className="absolute bottom-1.5 right-1.5 z-20 flex gap-1">
 <TooltipProvider>
 <Tooltip>
 <TooltipTrigger asChild>
 <Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70">
 <Edit3 className="h-3.5 w-3.5"/>
 </Button></TooltipTrigger><TooltipContent><p>Edit Canvas Properties</p></TooltipContent></Tooltip>
 <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Sigma className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>View Variables & State</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Edit3 className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>Edit Canvas Properties</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-7 w-7 bg-card/60 backdrop-blur-sm hover:bg-muted/70"><Sigma className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent><p>View Variables & State</p></TooltipContent></Tooltip>
        </TooltipProvider>
      </div>
    </Card>
    </div>
  );
}

/* Existing imports and component definitions (excluding CanvasContent) */

/* Other component definitions */

export default function LoomStudioPage() {
  // This is a placeholder for the Loom Studio page structure.
  // The actual content for each section (Palette, Canvas, Inspector, etc.)
  // will need to be implemented separately.

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="flex flex-grow overflow-hidden relative">
        {/* Floating Panels Container (Placeholder) */}
        {/* This div will contain the movable, resizable, stacked, and pinned panels */}
        {/* A library like react-grid-layout would typically manage the children within this container */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Placeholder Panel: Palette */}
            <div className="absolute top-2 left-2 w-64 h-[calc(100%-4rem)] pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                <AgentBlocksPaletteContent /> {/* Using existing Palette content */}
            </div>

            {/* Placeholder Panel: Inspector */}
            <div className="absolute top-2 right-2 w-80 h-[calc(50%-2rem)] pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <InspectorContent selectedNode={selectedNode} onNodePropertyChange={handleNodePropertyChange} /> {/* Pass selected node and update handler */}
            </div>

             {/* Placeholder Panel: Agent Hub */}
            <div className="absolute top-[calc(50%+1rem)] right-2 w-80 h-[calc(50%-2rem)] pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <AgentHubContent /> {/* Using existing Agent Hub content */}
            </div>

             {/* Placeholder Panel: Timeline */}
            <div className="absolute bottom-2 left-[280px] w-[calc(50%-280px-1rem)] h-64 pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <TimelineContent /> {/* Using existing Timeline content */}
            </div>

             {/* Placeholder Panel: Console */}
            <div className="absolute bottom-2 right-2 w-[calc(50%-1rem)] h-64 pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <PersistentConsoleContent /> {/* Using existing Console content */}
            </div>

           {/* Placeholder Panel: AI Prompt Sandbox (Example of another potential panel) */}
            {/* <div className="absolute top-2 left-[calc(256px+1rem)] w-96 h-64 pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <PromptSandbox />
            </div> */}
        </div>

        {/* Central Canvas Zone - Adjusted to fill the remaining space */}
        {/* The z-index is set lower than panels to allow interaction */}
        <section className="flex-grow flex items-center justify-center overflow-auto relative z-0">
             {/* The CanvasContent component now fills this section */}
            <CanvasContent addLog={() => {}} /> {/* Placeholder for addLog */}
        </section>

            // For simplicity, let's assume connections always go from the right of the source to the left of the target
            const sourcePoint = getConnectionPointPosition(sourceNode, 'right');
            const targetPoint = getConnectionPointPosition(targetNode, 'left');

            if (!sourcePoint || !targetPoint) return null;

            // Create a path for a slightly curved line (optional)
            const midX = (sourcePoint.x + targetPoint.x) / 2;
            const pathData = `M ${sourcePoint.x} ${sourcePoint.y} C ${midX} ${sourcePoint.y}, ${midX} ${targetPoint.y}, ${targetPoint.x} ${targetPoint.y}`;

            return (
              <path key={`${sourceNode.id}-${targetNode.id}`} d={pathData} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            );
          })
        ))}
    </div>
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
  const [suggestion, setSuggestion] = React.useState<string | null>(null); // Keep suggestion for now
  // Simulate suggestion when a (conceptual) "Email" node is selected
  React.useEffect(() => {
    // This would normally be triggered by canvas interaction state
    const timeoutId = setTimeout(() => setSuggestion("Add 'Summarize Text' node before this email for clarity?"), 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Assuming InspectorContent receives selectedNode and an update handler
  interface InspectorContentProps {
    selectedNode: WorkflowNode | null;
    onNodePropertyChange: (nodeId: string, property: keyof WorkflowNode, value: any) => void;
  }

  // This InspectorContent now takes selectedNode and onNodePropertyChange props
  const InspectorContent: React.FC<InspectorContentProps> = ({ selectedNode, onNodePropertyChange }) => {
    // Existing logic for suggestion remains...
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
                    <p>Failures Today: <span className="font-medium text-destructive">1</span> <AlertCircle className="inline h-3.5 w-3.5 ml-1 text-destructive" /></p>
                </CardContent>
            </Card>

            {selectedNode ? (
                <Card className="bg-card/80 border-border/60">
                  <CardHeader className="p-2">
                    <CardTitle className="text-sm font-headline">Node: {selectedNode.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-2">
                    <div>
                      <Label htmlFor="node-title" className="text-xs">Title</Label>
                      <Input id="node-title" type="text" value={selectedNode.title} onChange={(e) => onNodePropertyChange(selectedNode.id, 'title', e.target.value)} className="mt-1 h-8 text-xs bg-input border-input focus:ring-primary" />
                    </div>
                    <div>
                      <Label htmlFor="node-details" className="text-xs">Details</Label>
                      <Textarea id="node-details" value={selectedNode.details} onChange={(e) => onNodePropertyChange(selectedNode.id, 'details', e.target.value)} className="mt-1 h-16 text-xs bg-input border-input focus:ring-primary" />
                    </div>
                    {/* Add more input fields for other node properties as needed */}
                  </CardContent>
                </Card>
            ) : (
              <div className="text-center py-4 text-muted-foreground"> {/* Default placeholder for selected node */}
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                <p className="text-xs">Select a node on the canvas to inspect and configure its properties.</p>
              </div>
            )}
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

export default function LoomStudioPage() { 
  // This is a placeholder for the Loom Studio page structure.
  // The actual content for each section (Palette, Canvas, Inspector, etc.)
  // will need to be implemented separately.

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="flex flex-grow overflow-hidden relative">
        {/* Floating Panels Container (Placeholder) */}
        {/* This div will contain the movable, resizable, stacked, and pinned panels */}
        {/* A library like react-grid-layout would typically manage the children within this container */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Placeholder Panel: Palette */}
            <div className="absolute top-2 left-2 w-64 h-[calc(100%-4rem)] pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                <AgentBlocksPaletteContent /> {/* Using existing Palette content */}
            </div>

            {/* Placeholder Panel: Inspector */}
            <div className="absolute top-2 right-2 w-80 h-[calc(50%-2rem)] pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <InspectorContent selectedNode={null} onNodePropertyChange={() => {}} /> {/* Placeholder, will be replaced by CanvasContent's Inspector */}
            </div>

             {/* Placeholder Panel: Agent Hub */}
            <div className="absolute top-[calc(50%+1rem)] right-2 w-80 h-[calc(50%-2rem)] pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <AgentHubContent /> {/* Using existing Agent Hub content */}
            </div>

             {/* Placeholder Panel: Timeline */}
            <div className="absolute bottom-2 left-[280px] w-[calc(50%-280px-1rem)] h-64 pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <TimelineContent /> {/* Using existing Timeline content */}
            </div>

             {/* Placeholder Panel: Console */}
            <div className="absolute bottom-2 right-2 w-[calc(50%-1rem)] h-64 pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <PersistentConsoleContent /> {/* Using existing Console content */}
            </div>

           {/* Placeholder Panel: AI Prompt Sandbox (Example of another potential panel) */}
            {/* <div className="absolute top-2 left-[calc(256px+1rem)] w-96 h-64 pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-md shadow-lg overflow-hidden">
                 <PromptSandbox />
            </div> */}
        </div>

        {/* Central Canvas Zone - Adjusted to fill the remaining space */}
        {/* The z-index is set lower than panels to allow interaction */}
        <section className="flex-grow flex items-center justify-center overflow-auto relative z-0">
             {/* The CanvasContent component now fills this section */}
            <CanvasContent addLog={() => {}} /> {/* Placeholder for addLog */}
        </section>

        {/* The original sidebar structure is removed as panels are floating */}
      </main>

      {/* Bottom Bar */}
      <footer className="flex items-center justify-between p-2 border-t border-gray-200 text-sm">
        <div>3 Issues</div>
        <nav className="flex space-x-4">
          <button>Palette</button>
          <button>Inspector</button>
          <button>Timeline</button>
          <button>Console</button>
          <button>Agent Hub</button>
          <button>Toggle All Tabs</button>
        </nav>
      </footer>
    </div>
  );
}

/*
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
  ];*/
    
