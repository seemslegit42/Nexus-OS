
// src/app/loom-studio/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Rows, Edit3, ListChecks, PlayCircle, Aperture, Palette, Sparkles as AiFeedbackIcon, Sigma, Workflow, GanttChartSquare } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CanvasContent(): ReactNode {
  return (
    <Card className="h-full bg-muted/30 border-dashed border-border flex items-center justify-center">
      <CardContent className="p-4 text-center">
        <Workflow className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Visual Workflow Canvas</p>
        <p className="text-xs text-muted-foreground">Drag nodes from Tools Palette here.</p>
         <Image src="https://placehold.co/800x500.png" alt="Canvas Area" width={800} height={500} className="object-contain max-h-full max-w-full rounded mt-4 opacity-30" data-ai-hint="visual programming canvas nodes" />
      </CardContent>
    </Card>
  );
}

function ToolsPaletteContent(): ReactNode { // Floating Tools Palette
  return (
    <Card className="h-full">
      <CardContent className="p-2">
        <ScrollArea className="h-full">
          <div className="p-1 space-y-2">
            <p className="text-xs text-muted-foreground px-1">Recording & Control</p>
            {['Start Recorder', 'Stop Recorder', 'Playback Speed'].map(tool => (
              <Button key={tool} variant="outline" className="w-full justify-start text-sm">
                <Palette className="mr-2 h-4 w-4" /> 
                {tool}
              </Button>
            ))}
            <p className="text-xs text-muted-foreground px-1 mt-3">Canvas Tools</p>
            {['Node Tool', 'Connector', 'Eraser', 'Text Tool', 'Group Tool'].map(tool => (
              <Button key={tool} variant="outline" className="w-full justify-start text-sm">
                <Palette className="mr-2 h-4 w-4" /> 
                {tool}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function PromptLayerEditorContent(): ReactNode { // Prompt Layer
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-2 flex-grow flex flex-col">
        <Textarea placeholder="Enter prompt for selected node or global script..." className="h-full flex-grow font-code text-xs bg-background border-border focus:ring-primary resize-none" />
        <div className="mt-2 flex justify-end">
          <Button size="sm"><PlayCircle className="mr-2 h-4 w-4" /> Run Prompt/Script</Button>
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
          <div className="text-xs space-y-2 p-1">
            <p className="font-medium text-sm">Selected: <span className="text-primary">Agent_Start_01</span></p>
            <p>Type: <span className="text-muted-foreground">Trigger</span></p>
            <p>Status: <span className="text-green-500">Active</span></p>
            <p>Connections: <span className="text-muted-foreground">3</span></p>
            <p>Token Cost Est.: <span className="text-muted-foreground">150</span></p>
            <Button variant="outline" size="sm" className="w-full mt-2">Edit Properties</Button>
            <Image src="https://placehold.co/200x100.png" alt="Node properties" width={200} height={100} className="rounded-md mt-2" data-ai-hint="form fields parameters" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TimelineRecordingsContent(): ReactNode { // Timeline, Recordings as token + logic graphs
  return (
    <Card className="h-full">
      <CardContent className="p-2 text-center">
        <p className="text-xs text-muted-foreground mb-1">Recording: Session_Alpha_003</p>
        <Image src="https://placehold.co/400x200.png" alt="Timeline visualization with token/logic graphs" width={400} height={200} className="object-contain rounded" data-ai-hint="timeline event graph tokens" />
        <p className="text-xs text-muted-foreground mt-1">Token + Logic Graph</p>
      </CardContent>
    </Card>
  );
}

function AiFeedbackOverlayContent(): ReactNode {
  return (
    <Card className="h-full bg-accent/10 border-accent/30">
        <CardHeader className="p-2 pt-2 pb-1">
            <CardTitle className="text-sm flex items-center text-accent-foreground">
                <AiFeedbackIcon className="h-4 w-4 mr-1.5"/> AI Feedback
            </CardTitle>
        </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-full">
          <div className="space-y-1.5 text-xs">
            <p className="text-muted-foreground p-1.5 bg-background/50 rounded-sm">"Consider adding a conditional branch after 'Data Input Node' for error handling." <Button variant="link" size="sm" className="p-0 h-auto text-xs ml-1">Apply</Button></p>
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
      title: 'Loom Canvas', // Updated to be less generic than Visual Workflow Canvas
      icon: <Workflow className="w-5 h-5" />, // Changed Icon
      content: <CanvasContent />,
      defaultLayout: { 
        // Made static for a central, non-movable canvas
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
      title: 'Tools Palette', // "Floating Tools"
      icon: <Palette className="w-5 h-5" />,
      content: <ToolsPaletteContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 3, h: 8, minW: 2, minH: 5 },
        md: { x: 0, y: 0, w: 2, h: 8, minW: 2, minH: 5 },
        sm: { x: 0, y: 12, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'promptLayerEditor',
      title: 'Prompt Layer / Editor',
      icon: <Edit3 className="w-5 h-5" />,
      content: <PromptLayerEditorContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 9, h: 8, minW: 4, minH: 4 }, // Increased height
        md: { x: 0, y: 16, w: 7, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 17, w: 6, h: 6, minW: 3, minH: 3 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-5 h-5" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 0, y: 8, w: 3, h: 8, minW: 2, minH: 5 }, // Matched ToolsPalette
        md: { x: 0, y: 8, w: 2, h: 8, minW: 2, minH: 5 },
        sm: { x: 0, y: 23, w: 3, h: 6, minW: 2, minH: 3 },
      },
    },
    {
      id: 'timelineRecordings',
      title: 'Timeline & Recordings', // Updated
      icon: <GanttChartSquare className="w-5 h-5" />, // Changed Icon
      content: <TimelineRecordingsContent />,
      defaultLayout: {
        lg: { x: 9, y: 16, w: 3, h: 8, minW: 2, minH: 4 }, // Matched prompt editor
        md: { x: 7, y: 16, w: 3, h: 7, minW: 2, minH: 4 },
        sm: { x: 3, y: 23, w: 3, h: 6, minW: 2, minH: 3 },
      },
    },
     {
      id: 'aiFeedbackOverlay',
      title: 'AI Feedback',
      icon: <AiFeedbackIcon className="w-5 h-5" />,
      content: <AiFeedbackOverlayContent />,
      defaultLayout: {
        // Positioned it bottom right for now
        lg: { x: 9, y: 8, w: 3, h: 8, minW: 2, minH: 4 }, 
        md: { x: 7, y: 8, w: 3, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 29, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'aiPromptSandbox',
      title: 'AI Prompt Injection Sandbox',
      icon: <Sigma className="w-5 h-5" />, // Changed Icon
      content: <PromptSandbox />,
      defaultLayout: {
        // Occupies bottom area below main canvas
        lg: { x: 0, y: 24, w: 12, h: 8, minW: 6, minH: 5 },
        md: { x: 0, y: 23, w: 10, h: 8, minW: 5, minH: 5 },
        sm: { x: 0, y: 34, w: 6, h: 7, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // Ensure 12 columns for lg
    />
  );
}
