// src/app/loom-studio/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Rows, Edit3, ListChecks, PlayCircle, Aperture } from 'lucide-react';
import Image from 'next/image';

function CanvasContent(): ReactNode {
  return (
    <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
      <Image src="https://placehold.co/800x500.png" alt="Canvas Area" width={800} height={500} className="object-contain max-h-full max-w-full rounded" data-ai-hint="visual programming canvas" />
    </div>
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

function AIPromptInjectionSandboxContent(): ReactNode {
  return <PromptSandbox />;
}


export default function LoomStudioPage() {
  const loomStudioPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'canvas',
      title: 'Canvas',
      icon: <Aperture className="w-5 h-5" />,
      content: <CanvasContent />,
      defaultLayout: { // This zone will be static
        lg: { x: 0, y: 0, w: 8, h: 16, static: true }, // Static: true makes it non-draggable/non-resizable
        md: { x: 0, y: 0, w: 6, h: 16, static: true },
        sm: { x: 0, y: 0, w: 6, h: 12, static: true },
      },
      isDraggable: false, // Explicitly false
      isResizable: false, // Explicitly false
      canPin: false, // Disable pinning control for static zone
      canMaximize: false, // Disable maximize for static zone
      canMinimize: false, // Disable minimize for static zone
      canClose: false, // Disable close for static zone
    },
    {
      id: 'promptLayerEditor',
      title: 'Prompt Layer / Editor',
      icon: <Edit3 className="w-5 h-5" />,
      content: <PromptLayerEditorContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 8, h: 6, minW: 4, minH: 4 },
        md: { x: 0, y: 16, w: 6, h: 6, minW: 3, minH: 4 },
        sm: { x: 0, y: 12, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'inspector',
      title: 'Inspector',
      icon: <ListChecks className="w-5 h-5" />,
      content: <InspectorContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 7, minW: 3, minH: 4 },
        md: { x: 6, y: 0, w: 4, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 17, w: 3, h: 6, minW: 2, minH: 3 },
      },
    },
    {
      id: 'timelineRecordings',
      title: 'Timeline / Recordings',
      icon: <Rows className="w-5 h-5" />,
      content: <TimelineRecordingsContent />,
      defaultLayout: {
        lg: { x: 8, y: 7, w: 4, h: 7, minW: 3, minH: 4 },
        md: { x: 6, y: 7, w: 4, h: 7, minW: 3, minH: 4 },
        sm: { x: 3, y: 17, w: 3, h: 6, minW: 2, minH: 3 },
      },
    },
    {
      id: 'aiPromptSandbox',
      title: 'AI Prompt Injection Sandbox',
      icon: <Layers className="w-5 h-5" />,
      content: <AIPromptInjectionSandboxContent />,
      defaultLayout: {
        lg: { x: 8, y: 14, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 6, y: 14, w: 4, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 23, w: 6, h: 7, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={loomStudioPageZoneConfigs}
      className="flex-grow"
      // Note: The WorkspaceGrid internally handles responsive column counts.
      // rowHeight might need adjustment based on desired granularity.
    />
  );
}
