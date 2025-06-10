
// src/app/loom-studio/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Rows, Edit3, ListChecks, PlayCircle, Aperture, Palette, Sparkles as AiFeedbackIcon } from 'lucide-react';
import Image from 'next/image';

function CanvasContent(): ReactNode {
  return (
    <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
      <Image src="https://placehold.co/800x500.png" alt="Canvas Area" width={800} height={500} className="object-contain max-h-full max-w-full rounded" data-ai-hint="visual programming canvas" />
    </div>
  );
}

function ToolsPaletteContent(): ReactNode {
  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-2">
        {['Recorder', 'Node Tool', 'Connector', 'Eraser', 'Text Tool'].map(tool => (
          <Button key={tool} variant="outline" className="w-full justify-start text-sm">
            {/* Placeholder for tool icons */}
            <Palette className="mr-2 h-4 w-4" /> 
            {tool}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}

function PromptLayerEditorContent(): ReactNode {
  return (
    <div className="flex flex-col h-full">
      <Textarea placeholder="Enter your prompt or script here..." className="h-full flex-grow font-code text-sm bg-background border-border focus:ring-primary resize-none" />
      <div className="mt-2 flex justify-end">
        <Button size="sm"><PlayCircle className="mr-2 h-4 w-4" /> Run Prompt</Button>
      </div>
    </div>
  );
}

function InspectorContent(): ReactNode {
  return (
    <ScrollArea className="h-full">
      <div className="text-sm space-y-2 p-1">
        <p className="font-medium">Selected Node: <span className="text-primary">Agent_Start_01</span></p>
        <p>Type: <span className="text-muted-foreground">Trigger</span></p>
        <p>Status: <span className="text-green-500">Active</span></p>
        <p>Connections: <span className="text-muted-foreground">3</span></p>
        <Button variant="outline" size="sm" className="w-full mt-2">Edit Properties</Button>
      </div>
    </ScrollArea>
  );
}

function TimelineRecordingsContent(): ReactNode {
  return (
    <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
      <Image src="https://placehold.co/400x200.png" alt="Timeline visualization" width={400} height={200} className="object-contain rounded" data-ai-hint="event timeline graph" />
    </div>
  );
}

function AiFeedbackOverlayContent(): ReactNode {
  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-2 text-sm">
        <p className="font-medium text-primary">AI Feedback:</p>
        <p className="text-muted-foreground">"Consider adding a conditional branch after 'Data Input Node' for error handling."</p>
        <p className="text-muted-foreground">"The 'Summarize Text' prompt could be more specific for better results."</p>
        <Button variant="outline" size="sm" className="w-full mt-2">Apply Suggestion</Button>
      </div>
    </ScrollArea>
  );
}


export default function LoomStudioPage() {
  const loomStudioPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'canvas',
      title: 'Visual Workflow Canvas',
      icon: <Aperture className="w-5 h-5" />,
      content: <CanvasContent />,
      defaultLayout: { 
        lg: { x: 0, y: 0, w: 9, h: 16, static: true }, 
        md: { x: 0, y: 0, w: 7, h: 16, static: true },
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
      title: 'Floating Tools',
      icon: <Palette className="w-5 h-5" />,
      content: <ToolsPaletteContent />,
      defaultLayout: {
        lg: { x: 9, y: 0, w: 3, h: 8, minW: 2, minH: 4 },
        md: { x: 7, y: 0, w: 3, h: 8, minW: 2, minH: 4 },
        sm: { x: 0, y: 12, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'promptLayerEditor',
      title: 'Prompt Layer / Editor',
      icon: <Edit3 className="w-5 h-5" />,
      content: <PromptLayerEditorContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 9, h: 6, minW: 4, minH: 4 },
        md: { x: 0, y: 16, w: 7, h: 6, minW: 3, minH: 4 },
        sm: { x: 0, y: 17, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-5 h-5" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 9, y: 8, w: 3, h: 7, minW: 2, minH: 4 },
        md: { x: 7, y: 8, w: 3, h: 7, minW: 2, minH: 4 },
        sm: { x: 0, y: 22, w: 3, h: 6, minW: 2, minH: 3 },
      },
    },
    {
      id: 'timelineRecordings',
      title: 'Timeline / Recordings',
      icon: <Rows className="w-5 h-5" />,
      content: <TimelineRecordingsContent />,
      defaultLayout: {
        lg: { x: 9, y: 15, w: 3, h: 7, minW: 2, minH: 4 },
        md: { x: 7, y: 15, w: 3, h: 7, minW: 2, minH: 4 },
        sm: { x: 3, y: 22, w: 3, h: 6, minW: 2, minH: 3 },
      },
    },
     {
      id: 'aiFeedbackOverlay', // Placeholder for AI Feedback as a zone
      title: 'AI Feedback',
      icon: <AiFeedbackIcon className="w-5 h-5" />,
      content: <AiFeedbackOverlayContent />,
      defaultLayout: {
        lg: { x: 9, y: 22, w: 3, h: 6, minW: 2, minH: 4 }, // Example position
        md: { x: 7, y: 22, w: 3, h: 6, minW: 2, minH: 4 },
        sm: { x: 0, y: 28, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    // AI Prompt Injection Sandbox from original code
    {
      id: 'aiPromptSandbox',
      title: 'AI Prompt Injection Sandbox',
      icon: <Layers className="w-5 h-5" />,
      content: <PromptSandbox />,
      defaultLayout: {
        lg: { x: 0, y: 22, w: 9, h: 8, minW: 4, minH: 5 },
        md: { x: 0, y: 22, w: 7, h: 8, minW: 4, minH: 5 },
        sm: { x: 0, y: 33, w: 6, h: 7, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow"
    />
  );
}

    