
'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Cpu, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentLoadInfo {
  name: string;
  workload: number; // Percentage
  status: 'Optimal' | 'High' | 'Critical';
}

const mockAgentWorkloadData = {
  totalAgents: 7,
  overallWorkload: 68, // Percentage
  topAgents: [
    { name: "OrionCore", workload: 85, status: 'High' },
    { name: "DataHarvesterX", workload: 72, status: 'Optimal' },
    { name: "NexusGuard", workload: 91, status: 'Critical' },
  ] as AgentLoadInfo[],
};

export function AgentWorkloadPreview() {
  const data = mockAgentWorkloadData;

  const getStatusColor = (status: AgentLoadInfo['status'], type: 'text' | 'bg' | 'border' = 'text') => {
    switch (status) {
      case 'Optimal':
        return type === 'bg' ? 'bg-green-500/20' : type === 'border' ? 'border-green-500/50' : 'text-green-500';
      case 'High':
        return type === 'bg' ? 'bg-yellow-500/20' : type === 'border' ? 'border-yellow-500/50' : 'text-yellow-500 dark:text-yellow-400';
      case 'Critical':
        return type === 'bg' ? 'bg-red-500/20' : type === 'border' ? 'border-red-500/50' : 'text-red-500 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid gap-4 w-80">
      <div className="space-y-2">
        <h4 className="font-medium leading-none font-headline text-foreground flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-primary" /> Agent Workload Overview
        </h4>
        <p className="text-xs text-muted-foreground">
          Real-time agent performance and load.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Agents:</span>
          <span className="font-semibold text-foreground">{data.totalAgents}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Overall Workload:</span>
            <span className={cn("font-semibold", 
                data.overallWorkload > 80 ? 'text-destructive' : 
                data.overallWorkload > 60 ? 'text-yellow-500 dark:text-yellow-400' : 'text-green-500'
            )}>
                {data.overallWorkload}%
            </span>
          </div>
          <Progress value={data.overallWorkload} className="h-2 [&>div]:bg-primary" 
            aria-label={`Overall agent workload ${data.overallWorkload}%`} 
          />
        </div>
      </div>
      
      <div>
        <h5 className="text-sm font-medium mb-1.5 text-foreground flex items-center">
            <TrendingUp className="h-4 w-4 mr-1.5 text-muted-foreground"/> Top Busiest Agents
        </h5>
        <ScrollArea className="max-h-40">
          <div className="grid gap-2 pr-1">
            {data.topAgents.map((agent) => (
              <div key={agent.name} className={cn("p-2 rounded-md border hover:bg-muted/30 transition-colors", getStatusColor(agent.status, 'border'))}>
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium leading-none text-foreground truncate">
                    {agent.name}
                  </p>
                  <Badge
                    variant={agent.status === 'Critical' ? 'destructive' : agent.status === 'High' ? 'secondary' : 'default'}
                    className={cn("min-w-[60px] text-center justify-center text-[10px] py-0 px-1.5 h-5",
                        agent.status === 'Optimal' && 'bg-green-500/80 text-white',
                        agent.status === 'High' && 'bg-yellow-500/80 text-yellow-950 dark:text-yellow-50',
                        agent.status === 'Critical' && 'bg-red-600 text-white'
                    )}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className={cn("text-[10px] mt-0.5", getStatusColor(agent.status))}>
                  Load: {agent.workload}%
                </p>
              </div>
            ))}
            {data.topAgents.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No specific agent load data.</p>}
          </div>
        </ScrollArea>
      </div>

      <Button variant="outline" size="sm" className="w-full mt-2 text-xs" asChild>
        <Link href="/agents">Manage All Agents</Link>
      </Button>
    </div>
  );
}
