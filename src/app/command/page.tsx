// src/app/command/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalSquare, BookOpen, Send, Zap } from 'lucide-react';
import Image from 'next/image';

function UnifiedConsoleContent(): ReactNode {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-2 bg-background rounded-md border border-input mb-2 min-h-[200px]">
        <ScrollArea className="h-full">
          <pre className="text-xs text-muted-foreground p-2">
            {`NexOS Kernel v1.0.0
Last login: ${new Date().toLocaleString()}
[user@nexos ~]$ list active agents
> Agent OptimizerPrime: Active, 2 tasks
> Agent DataMinerX: Idle, 0 tasks
[user@nexos ~]$ `}
          </pre>
        </ScrollArea>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Enter natural language command, structured prompt, or script..."
          className="flex-grow bg-background border-border focus:ring-primary"
        />
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Send className="mr-2 h-4 w-4" /> Execute
        </Button>
      </div>
    </div>
  );
}

function SpellbookContent(): ReactNode {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-64 flex-grow">
        <ul className="space-y-2">
          {['Analyze sales data Q3', 'Optimize frontend performance', 'Draft blog post on AI ethics', 'Security scan all services'].map((spell, i) => (
            <li key={i} className="p-3 bg-muted/50 rounded-md hover:bg-accent/30 cursor-pointer">
              <p className="text-sm font-medium text-foreground">{spell}</p>
              <p className="text-xs text-muted-foreground">Type: {i % 2 === 0 ? 'Prompt Chain' : 'Script'}</p>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Button variant="outline" className="w-full mt-4">Add New Spell</Button>
    </div>
  );
}

function ExecutionChainVisualizerContent(): ReactNode {
  return (
    <>
      <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
        <Image src="https://placehold.co/800x300.png" alt="Execution Chain" width={800} height={300} className="rounded-md" data-ai-hint="flow chart diagram" />
      </div>
      <p className="text-xs text-muted-foreground mt-2">Visual feedback on what was triggered and the execution path of the last command.</p>
    </>
  );
}


export default function CommandCauldronPage() {
  const commandPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'unifiedConsole',
      title: 'Unified Console',
      icon: <TerminalSquare className="w-5 h-5" />,
      content: <UnifiedConsoleContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 8, h: 12, minW: 4, minH: 8 },
        md: { x: 0, y: 0, w: 6, h: 12, minW: 3, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 3, minH: 6 },
      },
    },
    {
      id: 'spellbook',
      title: 'Spellbook (Reusable Prompts & Scripts)',
      icon: <BookOpen className="w-5 h-5" />,
      content: <SpellbookContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 12, minW: 3, minH: 8 },
        md: { x: 6, y: 0, w: 4, h: 12, minW: 3, minH: 8 },
        sm: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 6 },
      },
    },
    {
      id: 'executionChainVisualizer',
      title: 'Execution Chain Visualizer',
      icon: <Zap className="w-5 h-5" />,
      content: <ExecutionChainVisualizerContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 12, h: 8, minW: 6, minH: 5 },
        md: { x: 0, y: 12, w: 10, h: 8, minW: 5, minH: 5 },
        sm: { x: 0, y: 18, w: 6, h: 7, minW: 4, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={commandPageZoneConfigs}
      className="flex-grow"
    />
  );
}
