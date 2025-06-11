
// src/app/loom-studio/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, Rows, Edit3, ListChecks, PlayCircle, Aperture, Palette, Sparkles as AiFeedbackIcon, 
  Sigma, Workflow, GanttChartSquare, MousePointerSquare, PenTool, Eraser, CaseUpper, SquareStack, StopCircle, FastForward, Settings2, Shield
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function CanvasContent(): ReactNode {
  return (
    <Card className="h-full bg-muted/10 border-dashed border-border flex items-center justify-center relative overflow-hidden">
      {/* Subtle background grid pattern */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-5">
        <defs>
          <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGrid)"/>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="text-center z-10 p-6 bg-background/50 rounded-lg shadow-xl">
        <Workflow className="h-20 w-20 text-primary mx-auto mb-3 opacity-70" />
        <p className="text-lg font-semibold text-foreground">Loom Canvas</p>
        <p className="text-sm text-muted-foreground">Drag nodes from the Tools Palette or right-click to begin.</p>
      </div>
    </Card>
  );
}

function ToolsPaletteContent(): ReactNode { 
  const toolCategories = [
    { 
      name: 'Recording & Control', 
      tools: [
        { name: 'Start Recorder', icon: <PlayCircle /> }, 
        { name: 'Stop Recorder', icon: <StopCircle /> }, 
        { name: 'Playback Speed', icon: <FastForward /> }
      ] 
    },
    { 
      name: 'Canvas Tools', 
      tools: [
        { name: 'Node Tool', icon: <MousePointerSquare /> }, 
        { name: 'Connector', icon: <PenTool /> }, 
        { name: 'Eraser', icon: <Eraser /> }, 
        { name: 'Text Tool', icon: <CaseUpper /> }, 
        { name: 'Group Tool', icon: <SquareStack /> }
      ] 
    },
     { 
      name: 'Agent Operations', 
      tools: [
        { name: 'Spawn Agent Node', icon: <Aperture /> }, 
        { name: 'Configure Agent', icon: <Settings2 /> }, 
      ] 
    },
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-1">
        <ScrollArea className="h-full">
          <div className="p-1 space-y-2">
            {toolCategories.map((category, idx) => (
              <div key={category.name}>
                {idx > 0 && <Separator className="my-1.5 bg-border/50" />}
                <p className="text-xs text-muted-foreground px-1.5 pt-1 pb-0.5 font-semibold tracking-wide uppercase">{category.name}</p>
                {category.tools.map(tool => (
                  <Button key={tool.name} variant="ghost" className="w-full justify-start text-sm h-8 px-2">
                    {React.cloneElement(tool.icon, { className: "mr-2 h-4 w-4 text-primary/80" })}
                    {tool.name}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function PromptLayerEditorContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-2 flex-grow flex flex-col">
        <Textarea placeholder="Enter prompt for selected node or global script..." className="h-full flex-grow font-code text-xs bg-background/80 border-input focus:ring-primary resize-none" />
        <div className="mt-2 flex justify-end">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlayCircle className="mr-2 h-4 w-4" /> Run Prompt/Script
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InspectorContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardContent className="p-2">
        <ScrollArea className="h-full">
          <div className="text-xs space-y-3 p-1">
            <div>
              <p className="font-semibold text-sm text-foreground mb-0.5">Selected: <span className="text-primary font-bold">Agent_Start_01</span></p>
              <p><span className="text-muted-foreground">Type:</span> <Badge variant="secondary" className="text-xs">Trigger Node</Badge></p>
              <p><span className="text-muted-foreground">Status:</span> <Badge variant="default" className="text-xs bg-green-500/90 dark:bg-green-600/90 text-white">Active</Badge></p>
            </div>
            <Separator className="bg-border/50" />
            <div>
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Properties</h4>
              <p><span className="text-muted-foreground">Connections:</span> 3</p>
              <p><span className="text-muted-foreground">Token Cost Est.:</span> 150</p>
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7">Edit Node Properties</Button>
            </div>
            <Separator className="bg-border/50" />
            <div>
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <Shield className="h-3.5 w-3.5 mr-1 text-primary/80"/>Security Context
              </h4>
              <p className="text-muted-foreground italic">RBAC: Admin, Editor</p>
              <p className="text-muted-foreground italic">Data Access: Read-Only</p>
               <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-0.5">Manage Permissions</Button>
            </div>
             <Image src="https://placehold.co/200x100.png" alt="Node properties visual form" width={200} height={100} className="rounded-md mt-2 border opacity-60" data-ai-hint="form fields parameters" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TimelineRecordingsContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-2 border-b border-border/50">
          <CardTitle className="text-sm font-headline text-foreground">Session_Alpha_003</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Token + Logic Graph</CardDescription>
      </CardHeader>
      <CardContent className="p-2 text-center flex-grow flex items-center justify-center bg-muted/20">
        <Image src="https://placehold.co/400x200.png" alt="Timeline visualization with token/logic graphs" width={400} height={200} className="object-contain rounded opacity-70" data-ai-hint="timeline event graph tokens" />
      </CardContent>
    </Card>
  );
}

function AiFeedbackOverlayContent(): ReactNode {
  return (
    <Card className="h-full bg-accent/10 border-accent/30">
        <CardHeader className="p-2 pt-2 pb-1">
            <CardTitle className="text-sm flex items-center text-accent-foreground font-headline">
                <AiFeedbackIcon className="h-4 w-4 mr-1.5"/> AI Feedback
            </CardTitle>
        </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-full">
          <div className="space-y-1.5 text-xs">
            <p className="text-muted-foreground p-1.5 bg-background/50 rounded-sm">"Consider adding a conditional branch after 'Data Input Node' for error handling." <Button variant="link" size="sm" className="p-0 h-auto text-xs ml-1 text-accent-foreground hover:text-accent-foreground/80">Apply Suggestion</Button></p>
            <p className="text-muted-foreground p-1.5 bg-background/50 rounded-sm">"The 'Summarize Text' prompt could be more specific for better results."</p>
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
        lg: { x: 3, y: 0, w: 9, h: 16, static: true }, 
        md: { x: 2, y: 0, w: 8, h: 16, static: true },
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
      id: 'toolsPalette',
      title: 'Tools Palette', 
      icon: <Palette className="w-5 h-5" />,
      content: <ToolsPaletteContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 6 }, // Increased height
        md: { x: 0, y: 0, w: 2, h: 12, minW: 2, minH: 6 },
        sm: { x: 0, y: 12, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'promptLayerEditor',
      title: 'Prompt Layer / Editor',
      icon: <Edit3 className="w-5 h-5" />,
      content: <PromptLayerEditorContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 9, h: 8, minW: 4, minH: 4 }, 
        md: { x: 0, y: 16, w: 7, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 18, w: 6, h: 6, minW: 3, minH: 3 }, // Adjusted y for sm
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-5 h-5" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 3, h: 12, minW: 2, minH: 6 }, // Increased height, matched ToolsPalette new height
        md: { x: 0, y: 12, w: 2, h: 12, minW: 2, minH: 6 },
        sm: { x: 0, y: 24, w: 3, h: 6, minW: 2, minH: 3 }, // Adjusted y for sm
      },
    },
    {
      id: 'timelineRecordings',
      title: 'Timeline & Recordings', 
      icon: <GanttChartSquare className="w-5 h-5" />, 
      content: <TimelineRecordingsContent />,
      defaultLayout: {
        lg: { x: 9, y: 16, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 7, y: 16, w: 3, h: 7, minW: 2, minH: 4 },
        sm: { x: 3, y: 24, w: 3, h: 6, minW: 2, minH: 3 }, // Adjusted y for sm
      },
    },
     {
      id: 'aiFeedbackOverlay',
      title: 'AI Feedback',
      icon: <AiFeedbackIcon className="w-5 h-5" />,
      content: <AiFeedbackOverlayContent />,
      defaultLayout: {
        lg: { x: 9, y: 8, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 7, y: 8, w: 3, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 30, w: 6, h: 5, minW: 3, minH: 3 }, // Adjusted y for sm
      },
    },
    {
      id: 'aiPromptSandbox',
      title: 'AI Prompt Injection Sandbox',
      icon: <Sigma className="w-5 h-5" />, 
      content: <PromptSandbox />, // Functional component
      defaultLayout: {
        lg: { x: 0, y: 24, w: 12, h: 8, minW: 6, minH: 5 },
        md: { x: 0, y: 23, w: 10, h: 8, minW: 5, minH: 5 },
        sm: { x: 0, y: 35, w: 6, h: 7, minW: 3, minH: 4 }, // Adjusted y for sm
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow p-1" // Reduced padding slightly for more immersive feel
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
    />
  );
}

