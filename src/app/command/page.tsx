// src/app/command/page.tsx
'use client';

import type { ReactNode } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/lib/icons';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function UnifiedConsoleContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardContent className="flex flex-grow flex-col p-1 md:p-2">
        <div className="mb-2 min-h-[200px] flex-grow rounded-md border border-input/70 bg-background/70 shadow-inner">
          <ScrollArea className="h-full">
            <pre className="p-2 font-code text-xs text-muted-foreground">
              {`ΛΞVOS Kernel v1.1.0 "Orion"
Last login: ${new Date().toLocaleString()}
[user@aevo ~]$ list active agents
> Agent OptimizerPrime: Active, 2 tasks
> Agent DataMinerX: Idle, 0 tasks
[user@aevo ~]$ `}
            </pre>
          </ScrollArea>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter natural language command, structured prompt, or script..."
            className="h-9 flex-grow border-input bg-input font-code text-sm focus:ring-primary"
          />
          <Button className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="mr-2 h-4 w-4" /> Execute
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SpellbookContent(): ReactNode {
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardContent className="flex flex-grow flex-col p-1 md:p-2">
        <ScrollArea className="flex-grow">
          <ul className="space-y-1.5">
            {[
              'Analyze sales data Q3',
              'Optimize frontend performance',
              'Draft blog post on AI ethics',
              'Security scan all services',
            ].map((spell, i) => (
              <li
                key={i}
                className="cursor-pointer rounded-md border border-border/60 bg-card p-2.5 shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/70"
              >
                <p className="text-sm font-medium text-foreground">{spell}</p>
                <p className="text-xs text-muted-foreground">
                  Type: {i % 2 === 0 ? 'Prompt Chain' : 'Script'}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <Button
          variant="outline"
          className="mt-2 w-full bg-card hover:bg-muted/60"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Spell
        </Button>
      </CardContent>
    </Card>
  );
}

function ExecutionChainVisualizerContent(): ReactNode {
  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardContent className="flex h-full flex-col p-1 md:p-2">
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border/50 bg-muted/20 p-4">
          <Image
            src="https://placehold.co/800x300.png"
            alt="Execution Chain"
            width={800}
            height={300}
            className="rounded-md border border-border/60 opacity-70"
            data-ai-hint="flow chart diagram"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Visual feedback on what was triggered and the execution path of the
          last command.
        </p>
      </CardContent>
    </Card>
  );
}

export default function CommandCauldronPage() {
  const commandPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'unifiedConsole',
      title: 'Unified Console',
      icon: <TerminalSquare className="h-4 w-4" />,
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
      icon: <BookOpen className="h-4 w-4" />,
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
      icon: <Zap className="h-4 w-4" />,
      content: <ExecutionChainVisualizerContent />,
      defaultLayout: {
        lg: { x: 0, y: 12, w: 12, h: 8, minW: 6, minH: 5 },
        md: { x: 0, y: 12, w: 10, h: 8, minW: 5, minH: 5 },
        sm: { x: 0, y: 18, w: 6, h: 7, minW: 4, minH: 4 },
      },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={commandPageZoneConfigs}
      className="flex-grow p-1 md:p-2"
    />
  );
}
