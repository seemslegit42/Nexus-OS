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
import { Badge } from '@/components/ui/badge'; // Import Badge component

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

const AgentStatusIcon: React.FC<{ status: DisplayAgentInfo['status'] }> = ({ status }) => {
  switch (status) {
    case 'Executing': return <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin" />;
    case 'Idle': return <CheckCircle className="h-3.5 w-3.5 text-green-400" />;
    case 'Offline': return <XCircle className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'Error': return <AlertTriangle className="h-3.5 w-3.5 text-red-400" />;
    default: return null;
  }
};

const AgentDetailPanel: React.FC<{ agent: DisplayAgentInfo }> = React.memo(({ agent }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--blur)] text-card-foreground shadow-[var(--shadow-soft)] p-3 mt-2 text-xs space-y-1.5"
      )}
    >
      <h4 className="text-sm font-semibold text-primary mb-1">{agent.personaName}</h4>
      <p><strong>Agent ID:</strong> {agent.id}</p>
      <p>
        <strong>Operational Status:</strong> <span className={cn(
            agent.status === 'Executing' && "text-blue-400",
            agent.status === 'Idle' && "text-green-400",
            agent.status === 'Error' && "text-red-400",
            agent.status === 'Offline' && "text-muted-foreground"
        )}>{agent.status}</span> (Sim. Workload: {agent.workload}%)
      </p>
       <p><strong>Marketplace Status:</strong> <Badge variant={agent.marketplaceStatus === 'available' ? 'default' : 'secondary'} className={cn("text-[9px] h-auto px-1 py-0", agent.marketplaceStatus === 'available' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600')}>{agent.marketplaceStatus}</Badge></p>
       <p><strong>Category:</strong> {agent.category}</p>
      <p><strong>Current Task:</strong> {agent.currentTask || 'N/A (Simulated)'}</p>
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
          isExecuting && "shadow-[0_0_15px_1px_hsl(var(--primary)/0.3)] animate-pulse-jade",
          isExpanded && "ring-1 ring-primary/70 border-primary/60 bg-primary/5"
        )}
        title={`Click to view details for ${agent.name}`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-foreground truncate">{agent.name}</p>
          <AgentStatusIcon status={agent.status} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
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
    setIsLoading(false);
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
