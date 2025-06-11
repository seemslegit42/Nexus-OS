
// src/app/command/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalSquare, BookOpen, Send, Zap, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function UnifiedConsoleContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2 flex-grow flex flex-col">
        <div className="flex-grow bg-background/70 rounded-md border border-input/70 mb-2 min-h-[200px] shadow-inner">
          <ScrollArea className="h-full">
            <pre className="text-xs text-muted-foreground p-2 font-code">
              {`NexOS Kernel v1.1.0 "Orion"
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
            className="flex-grow bg-input border-input focus:ring-primary h-9 text-sm font-code"
          />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">
            <Send className="mr-2 h-4 w-4" /> Execute
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SpellbookContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2 flex-grow flex flex-col">
        <ScrollArea className="flex-grow">
          <ul className="space-y-1.5">
            {['Analyze sales data Q3', 'Optimize frontend performance', 'Draft blog post on AI ethics', 'Security scan all services'].map((spell, i) => (
              <li key={i} className="p-2.5 bg-card rounded-md hover:bg-muted/60 cursor-pointer border border-border/60 shadow-sm transition-colors hover:border-primary/50">
                <p className="text-sm font-medium text-foreground">{spell}</p>
                <p className="text-xs text-muted-foreground">Type: {i % 2 === 0 ? 'Prompt Chain' : 'Script'}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <Button variant="outline" className="w-full mt-2 bg-card hover:bg-muted/60" size="sm">
          <PlusCircle className="mr-2 h-4 w-4"/> Add New Spell
        </Button>
      </CardContent>
    </Card>
  );
}

function ExecutionChainVisualizerContent(): ReactNode {
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2 h-full flex flex-col">
        <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center p-4 border border-dashed border-border/50">
          <Image src="https://placehold.co/800x300.png" alt="Execution Chain" width={800} height={300} className="rounded-md opacity-70" data-ai-hint="flow chart diagram" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Visual feedback on what was triggered and the execution path of the last command.</p>
      </CardContent>
    </Card>
  );
}


export default function CommandCauldronPage() {
  const commandPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'unifiedConsole',
      title: 'Unified Console',
      icon: <TerminalSquare className="w-4 h-4" />,
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
      icon: <BookOpen className="w-4 h-4" />,
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
      icon: <Zap className="w-4 h-4" />,
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
      className="flex-grow p-1 md:p-2"
    />
  );
}

