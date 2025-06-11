
// src/micro-apps/dashboard-widgets/live-agent-presence-widget.tsx
'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveAgentPresenceWidget(): ReactNode {
  const agents = [
    { id: 'agent1', name: "OptimizerPrime", status: "Active", tasks: 2, load: 75 },
    { id: 'agent2', name: "DataMinerX", status: "Idle", tasks: 0, load: 10 },
    { id: 'agent3', name: "SecureGuard", status: "Monitoring", tasks: 5, load: 90 },
    { id: 'agent4', name: "ContentCreatorAI", status: "Processing", tasks: 1, load: 60 },
  ];
  return (
    <Card className="h-full bg-transparent border-none shadow-none flex flex-col">
      <CardContent className="p-1 md:p-2 flex-grow overflow-y-auto">
        <div className="space-y-1.5">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-card hover:bg-muted/70 border-border/70 transition-colors duration-150 ease-in-out hover:shadow-md">
              <CardContent className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.status} - {agent.tasks} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-1/3 max-w-[100px]">
                  <Progress
                    value={agent.load}
                    className={cn(
                      "h-1.5 w-full",
                      agent.load <= 50 && "[&>div]:bg-green-500",
                      agent.load > 50 && agent.load <= 80 && "[&>div]:bg-yellow-500",
                      agent.load > 80 && "[&>div]:bg-destructive"
                    )}
                    aria-label={`${agent.name} load ${agent.load}%`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
         <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto text-xs">View agent console</Button>
      </CardContent>
    </Card>
  );
}
    