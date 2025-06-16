// src/components/dashboard/AgentPresenceGrid.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cpu, CheckCircle, XCircle, AlertTriangle, Loader2, PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserAgentsStore } from '@/stores/user-agents.store';
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store';
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { Badge } from '@/components/ui/badge';

interface DisplayAgentInfo {
  id: string;
  name: string;
  personaName: string;
  status: 'Idle' | 'Executing' | 'Offline' | 'Error';
  workload: number;
  marketplaceStatus: MarketplaceAgent['status'];
  category: string;
  currentTask: string | null;
}

const AgentStatusIcon: React.FC<{ status: DisplayAgentInfo['status'] }> = React.memo(({ status }) => {
  switch (status) {
    case 'Executing': return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />; 
    case 'Idle': return <CheckCircle className="h-3.5 w-3.5 text-green-400" />;
    case 'Offline': return <XCircle className="h-3.5 w-3.5 text-muted-foreground/70" />; 
    case 'Error': return <AlertTriangle className="h-3.5 w-3.5 text-red-400" />;
    default: return null;
  }
});
AgentStatusIcon.displayName = 'AgentStatusIcon';


const AgentDetailPanel: React.FC<{ agent: DisplayAgentInfo }> = React.memo(({ agent }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm text-card-foreground shadow-lg p-3 mt-2 text-xs space-y-1.5" 
      )}
    >
      <h4 className="text-sm font-semibold text-primary mb-1">{agent.personaName}</h4>
      <p><strong className="text-muted-foreground">ID:</strong> <span className="text-foreground/90 font-mono text-[11px]">{agent.id}</span></p>
      <p>
        <strong className="text-muted-foreground">Operational Status:</strong> <span className={cn(
            "font-medium",
            agent.status === 'Executing' && "text-primary",
            agent.status === 'Idle' && "text-green-400",
            agent.status === 'Error' && "text-red-400",
            agent.status === 'Offline' && "text-muted-foreground/80"
        )}>{agent.status}</span> <span className="text-muted-foreground/80">(Workload: {agent.workload}%)</span>
      </p>
       <p><strong className="text-muted-foreground">Marketplace Status:</strong> <Badge variant={agent.marketplaceStatus === 'available' ? 'default' : 'secondary'} className={cn("text-[9px] h-auto px-1 py-0 ml-1", agent.marketplaceStatus === 'available' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400')}>{agent.marketplaceStatus}</Badge></p>
       <p><strong className="text-muted-foreground">Category:</strong> <span className="text-foreground/90">{agent.category}</span></p>
      <p><strong className="text-muted-foreground">Current Task:</strong> <span className="text-foreground/90">{agent.currentTask || 'N/A'}</span></p>
    </div>
  );
});
AgentDetailPanel.displayName = 'AgentDetailPanel';

const AgentEntry: React.FC<{ agent: DisplayAgentInfo }> = React.memo(({ agent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isExecuting = agent.status === 'Executing';

  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "p-2.5 rounded-lg bg-background/40 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all hover:shadow-md hover:border-primary/40 active:scale-[0.98]",
          isExecuting && "shadow-[0_0_15px_1px_hsl(var(--primary)/0.4)] border-primary/50 animate-pulse-jade", 
          isExpanded && "ring-1 ring-primary/70 border-primary/60 bg-primary/5"
        )}
        title={`Click to view details for ${agent.name}`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-foreground truncate flex-1 mr-2">{agent.name}</p>
          <AgentStatusIcon status={agent.status} />
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {agent.currentTask ? `Task: ${agent.currentTask.substring(0,30)}${agent.currentTask.length > 30 ? '...' : ''}` : `Workload: ${agent.workload}%`}
        </p>
      </div>
      {isExpanded && <AgentDetailPanel agent={agent} />}
    </div>
  );
});
AgentEntry.displayName = 'AgentEntry';

const AgentPresenceGrid: React.FC = () => {
  const acquiredAgentIds = useUserAgentsStore(state => state.acquiredAgentIds);
  const getMarketplaceAgentById = useAgentMarketplaceStore(state => state.getAgentById);
  const [displayAgents, setDisplayAgents] = useState<DisplayAgentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const agentsData = acquiredAgentIds
      .map(id => {
        const marketplaceAgent = getMarketplaceAgentById(id);
        if (!marketplaceAgent) return null;

        const operationalStatuses: DisplayAgentInfo['status'][] = ['Idle', 'Executing', 'Error', 'Offline'];
        const randomOpStatus = operationalStatuses[Math.floor(Math.random() * operationalStatuses.length)];
        
        return {
          id: marketplaceAgent.id,
          name: marketplaceAgent.name,
          personaName: marketplaceAgent.tagline || marketplaceAgent.name,
          status: randomOpStatus,
          workload: Math.floor(Math.random() * 100),
          marketplaceStatus: marketplaceAgent.status,
          category: marketplaceAgent.category,
          currentTask: randomOpStatus === 'Executing' ? `Simulated task for ${marketplaceAgent.name}` : null,
        };
      })
      .filter(agent => agent !== null) as DisplayAgentInfo[];
    
    setDisplayAgents(agentsData);
    
    setTimeout(() => setIsLoading(false), 200); 
  }, [acquiredAgentIds, getMarketplaceAgentById]);


  if (isLoading) {
    return (
      <Card className="h-auto bg-transparent border-none shadow-none">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-medium text-foreground flex items-center">
            <Cpu className="h-4 w-4 mr-2 text-primary" /> Agent Presence
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin"/>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-primary" /> Agent Presence ({displayAgents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 h-full flex-grow flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow pr-1">
          <div className="space-y-2">
            {displayAgents.map((agent) => (
              <AgentEntry key={agent.id} agent={agent} />
            ))}
            {displayAgents.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground h-full flex flex-col items-center justify-center">
                    <PackageSearch className="mx-auto h-10 w-10 opacity-50 mb-2" />
                    No agents acquired yet.
                    <p className="text-xs mt-1">Deploy agents from the Marketplace to see them here.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default React.memo(AgentPresenceGrid);
