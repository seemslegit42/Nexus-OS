
'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AgentInfo {
  name: string;
  status: string;
  tasks: number;
  lastLog: string;
}

interface ActiveAgentsPopoverContentProps {
  agents: AgentInfo[];
}

export function ActiveAgentsPopoverContent({ agents }: ActiveAgentsPopoverContentProps) {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none font-headline text-foreground">Active Agents</h4>
        <p className="text-sm text-muted-foreground">
          Quick overview of agent states.
        </p>
      </div>
      <ScrollArea className="max-h-72">
        <div className="grid gap-1.5 pr-1">
          {agents.map((agent) => (
            <div key={agent.name} className="p-2.5 rounded-md border border-transparent hover:border-border/60 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium leading-none text-foreground truncate">
                  {agent.name}
                </p>
                <Badge
                  variant={
                    agent.status === 'Active' || agent.status === 'Processing' ? 'default' :
                    agent.status === 'Error' ? 'destructive' : 'secondary'
                  }
                  className={cn(
                    "min-w-[70px] text-center justify-center text-xs py-0.5 px-2 h-5",
                    (agent.status === 'Active' || agent.status === 'Processing') && 'bg-green-500/80 text-white'
                  )}
                >
                  {agent.status}
                </Badge>
              </div>
               <p className="text-xs text-muted-foreground truncate mt-0.5" title={agent.lastLog}>
                {agent.tasks} tasks - {agent.lastLog}
              </p>
            </div>
          ))}
           {agents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No active agents found.</p>}
        </div>
      </ScrollArea>
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/agents">View All Agents</Link>
      </Button>
    </div>
  );
}
