// src/components/dashboard/AgentPresenceGrid.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cpu, MagnifyingGlass as PackageSearch } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useUserAgentsStore } from '@/stores/user-agents.store';
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store';
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { Badge } from '@/components/ui/badge';

interface DisplayAgentInfo {
  id: string;
  name: string;
  personaName: string;
  marketplaceStatus: MarketplaceAgent['status'];
  category: string;
  description?: string;
}

const AgentCard: React.FC<{ agent: DisplayAgentInfo }> = React.memo(
  ({ agent }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getStatusGradient = () => {
      switch (agent.marketplaceStatus) {
        case 'available':
          return 'from-emerald-500/20 to-green-500/20 border-emerald-500/40';
        case 'in-development':
          return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40';
        case 'deprecated':
          return 'from-orange-500/20 to-red-500/20 border-orange-500/40';
        default:
          return 'from-gray-500/20 to-slate-500/20 border-gray-500/40';
      }
    };

    return (
      <Card
        className={cn(
          'group cursor-pointer backdrop-blur-md transition-all duration-500 hover:shadow-xl',
          'relative overflow-hidden border-2 bg-gradient-to-br',
          getStatusGradient(),
          isExpanded && 'scale-[1.02] shadow-xl shadow-primary/20',
          isHovered && 'shadow-lg shadow-primary/10'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating particles effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={cn(
              'duration-[3s] absolute h-2 w-2 rounded-full bg-white/20 transition-all',
              isHovered
                ? '-translate-y-8 translate-x-8 opacity-100'
                : 'translate-x-0 translate-y-0 opacity-0'
            )}
            style={{ top: '20%', left: '10%' }}
          />
          <div
            className={cn(
              'duration-[4s] absolute h-1 w-1 rounded-full bg-white/30 transition-all delay-500',
              isHovered
                ? '-translate-y-12 translate-x-12 opacity-100'
                : 'translate-x-0 translate-y-0 opacity-0'
            )}
            style={{ top: '60%', left: '70%' }}
          />
          <div
            className={cn(
              'duration-[3.5s] absolute h-1.5 w-1.5 rounded-full bg-white/15 transition-all delay-300',
              isHovered
                ? '-translate-x-6 -translate-y-10 opacity-100'
                : 'translate-x-0 translate-y-0 opacity-0'
            )}
            style={{ top: '40%', right: '20%' }}
          />
        </div>

        {/* Glow effect on hover */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300',
            isHovered && 'opacity-100'
          )}
        />

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle
                className={cn(
                  'truncate text-sm font-semibold transition-all duration-300',
                  'text-foreground group-hover:text-primary',
                  isExpanded && 'text-primary'
                )}
              >
                {agent.name}
              </CardTitle>
              <p className="mt-1 truncate text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                {agent.personaName}
              </p>
            </div>
            <div className="ml-2 flex items-center gap-2">
              <Badge
                variant={
                  agent.marketplaceStatus === 'available'
                    ? 'default'
                    : 'secondary'
                }
                className={cn(
                  'px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-all duration-300',
                  agent.marketplaceStatus === 'available'
                    ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 dark:text-emerald-400'
                    : 'border-blue-500/30 bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 dark:text-blue-400'
                )}
              >
                {agent.marketplaceStatus}
              </Badge>
              <div
                className={cn(
                  'relative h-2 w-2 rounded-full transition-all duration-300',
                  agent.marketplaceStatus === 'available'
                    ? 'bg-emerald-400'
                    : 'bg-blue-400'
                )}
              >
                {/* Pulsing ring effect */}
                <div
                  className={cn(
                    'absolute inset-0 animate-ping rounded-full opacity-75',
                    agent.marketplaceStatus === 'available'
                      ? 'bg-emerald-400'
                      : 'bg-blue-400'
                  )}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="relative z-10 pb-4 pt-0">
            <div className="-mx-1 space-y-3 rounded-lg border-t border-border/30 bg-white/5 p-3 pt-3 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="flex items-center font-medium text-muted-foreground">
                    <div className="mr-2 h-1 w-1 rounded-full bg-primary" />
                    Agent ID:
                  </span>
                  <p className="break-all rounded bg-black/10 px-2 py-1 font-mono text-[10px] text-foreground/90">
                    {agent.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center font-medium text-muted-foreground">
                    <div className="mr-2 h-1 w-1 rounded-full bg-secondary" />
                    Category:
                  </span>
                  <p className="rounded bg-black/10 px-2 py-1 capitalize text-foreground/90">
                    {agent.category}
                  </p>
                </div>
              </div>
              {agent.description && (
                <div className="space-y-1 text-xs">
                  <span className="flex items-center font-medium text-muted-foreground">
                    <div className="mr-2 h-1 w-1 rounded-full bg-accent" />
                    Description:
                  </span>
                  <p className="rounded bg-black/10 p-2 leading-relaxed text-foreground/80">
                    {agent.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  }
);
AgentCard.displayName = 'AgentCard';

const AgentPresenceGrid: React.FC = () => {
  const acquiredAgentIds = useUserAgentsStore(state => state.acquiredAgentIds);
  const getMarketplaceAgentById = useAgentMarketplaceStore(
    state => state.getAgentById
  );
  const [displayAgents, setDisplayAgents] = useState<DisplayAgentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const agentsData = acquiredAgentIds
      .map(id => {
        const marketplaceAgent = getMarketplaceAgentById(id);
        if (!marketplaceAgent) return null;

        return {
          id: marketplaceAgent.id,
          name: marketplaceAgent.name,
          personaName: marketplaceAgent.tagline || marketplaceAgent.name,
          marketplaceStatus: marketplaceAgent.status,
          category: marketplaceAgent.category,
          description: marketplaceAgent.description,
        };
      })
      .filter(agent => agent !== null) as DisplayAgentInfo[];

    setDisplayAgents(agentsData);
    setIsLoading(false);
  }, [acquiredAgentIds, getMarketplaceAgentById]);

  if (isLoading) {
    return (
      <Card className="h-auto border-none bg-transparent shadow-none">
        <CardHeader className="px-3 pb-2 pt-3">
          <CardTitle className="flex items-center text-base font-medium text-foreground">
            <Cpu className="mr-2 h-4 w-4 text-primary" /> Agent Fleet Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center px-3 pb-3">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading agents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="px-3 pb-2 pt-3">
        <CardTitle className="flex items-center text-base font-medium text-foreground">
          <Cpu className="mr-2 h-4 w-4 text-primary" /> Agent Fleet Overview (
          {displayAgents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-grow flex-col overflow-hidden px-3 pb-3">
        <ScrollArea className="flex-grow pr-1">
          <div className="grid gap-3">
            {displayAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            {displayAgents.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                <PackageSearch className="mx-auto mb-3 h-12 w-12 opacity-40" />
                <p className="font-medium">No agents deployed yet</p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  Deploy agents from the Marketplace to see them here.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default React.memo(AgentPresenceGrid);
