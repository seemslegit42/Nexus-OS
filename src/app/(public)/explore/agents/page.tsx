// src/app/(public)/explore/agents/page.tsx
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  MagnifyingGlass as Search,
  FunnelSimple as FilterIcon,
  Cpu,
  Sparkle as Sparkles,
  ShieldCheck,
  FlowArrow as Workflow,
  CheckCircle,
  Info,
  Warning as AlertTriangle,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store';
import { useUserAgentsStore } from '@/stores/user-agents.store'; // Added
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getPhosphorIcon = (
  iconName: string | undefined,
  props?: any
): React.ReactNode => {
  const iconProps = {
    className:
      'h-8 w-8 mb-2 text-primary opacity-90 group-hover:scale-110 transition-transform duration-200',
    ...props,
  };
  if (!iconName) return <Cpu {...iconProps} />; // Default icon
  switch (iconName.toLowerCase()) {
    case 'cpu':
      return <Cpu {...iconProps} />;
    case 'shieldcheck':
      return <ShieldCheck {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'workflow':
      return <Workflow {...iconProps} />;
    // Add more cases as new icons are used
    default:
      return <Cpu {...iconProps} />;
  }
};

const getStatusBadge = (status: MarketplaceAgent['status']) => {
  switch (status) {
    case 'available':
      return (
        <Badge className="border-green-500/30 bg-green-500/20 text-xs text-green-700 dark:text-green-300">
          Available
        </Badge>
      );
    case 'beta':
      return (
        <Badge className="border-blue-500/30 bg-blue-500/20 text-xs text-blue-700 dark:text-blue-400">
          Beta
        </Badge>
      );
    case 'preview':
      return (
        <Badge className="border-purple-500/30 bg-purple-500/20 text-xs text-purple-700 dark:text-purple-400">
          Preview
        </Badge>
      );
    case 'coming_soon':
      return (
        <Badge className="border-yellow-500/30 bg-yellow-500/20 text-xs text-yellow-700 dark:text-yellow-400">
          Coming Soon
        </Badge>
      );
    case 'deprecated':
      return (
        <Badge variant="destructive" className="text-xs">
          Deprecated
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      );
  }
};

const getPricingDisplay = (pricing: MarketplaceAgent['pricing']) => {
  if (!pricing) return <span className="text-xs text-green-500">Included</span>;
  switch (pricing.type) {
    case 'free':
      return <span className="text-xs text-green-500">Free</span>;
    case 'one-time':
      return (
        <span className="text-xs text-foreground">
          ${pricing.amount} (One-Time)
        </span>
      );
    case 'subscription':
      return (
        <span className="text-xs text-foreground">
          ${pricing.amount}/{pricing.billingCycle?.substring(0, 2)}
        </span>
      );
    case 'usage-based':
      return <span className="text-xs text-foreground">Usage-Based</span>;
    default:
      return <span className="text-xs text-muted-foreground">Contact Us</span>;
  }
};

export default function AgentMarketplacePage() {
  const agents = useAgentMarketplaceStore(state => state.agents);
  const searchAgents = useAgentMarketplaceStore(state => state.searchAgents);
  const { isAcquired } = useUserAgentsStore(); // Added
  const [searchTerm, setSearchTerm] = React.useState('');

  const displayedAgents = React.useMemo(() => {
    if (!searchTerm) return agents;
    return searchAgents(searchTerm);
  }, [agents, searchTerm, searchAgents]);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="font-headline text-3xl text-foreground">
            NexOS Agent Marketplace
          </h1>
          <p className="text-muted-foreground">
            Discover and deploy AI agents to enhance your NexOS capabilities.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative flex-grow sm:min-w-[300px] sm:flex-grow-0">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents (e.g., Security, Optimizer)..."
              className="w-full border-input bg-input pl-9 focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="w-full border-primary/40 text-foreground hover:border-primary/60 hover:bg-primary/10 sm:w-auto"
          >
            <FilterIcon className="mr-2 h-4 w-4 text-primary" /> Filter Agents
          </Button>
          {/* Placeholder for future "Submit Agent" button */}
        </div>
      </header>

      {displayedAgents.length === 0 ? (
        <Card className="col-span-full bg-card/70 py-10 text-center backdrop-blur-md">
          <CardContent>
            <Cpu className="mx-auto mb-4 h-16 w-16 text-primary/60" />
            <h2 className="mb-2 font-headline text-2xl text-foreground">
              No Agents Found
            </h2>
            <p className="mx-auto mb-4 max-w-md text-muted-foreground">
              {searchTerm
                ? `No agents match your search term "${searchTerm}". Try a different search or clear filters.`
                : 'The Agent Marketplace is currently empty or agents are being updated. Please check back soon!'}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedAgents.map(agent => {
            const acquired = isAcquired(agent.id);
            return (
              <Card
                key={agent.id}
                className={cn(
                  'group flex transform flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card/60 text-card-foreground shadow-[0_4px_30px_rgba(0,255,162,0.1)] backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(0,255,162,0.2)]',
                  acquired && 'border-primary/50 ring-1 ring-primary/30'
                )}
              >
                <CardHeader className="relative items-center p-4 text-center">
                  {' '}
                  {/* Added relative */}
                  {acquired && (
                    <Badge className="absolute right-2 top-2 bg-primary/80 px-2 py-0.5 text-xs text-primary-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" /> Added
                    </Badge>
                  )}
                  {getPhosphorIcon(agent.icon)}
                  <Link
                    href={agent.entryPoint || `/explore/agents/${agent.id}`}
                    className="rounded-sm hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <CardTitle
                      className="line-clamp-1 font-headline text-lg text-primary transition-colors group-hover:text-accent"
                      title={agent.name}
                    >
                      {agent.name}
                    </CardTitle>
                  </Link>
                  <CardDescription
                    className="line-clamp-2 h-8 text-xs text-muted-foreground"
                    title={agent.tagline}
                  >
                    {agent.tagline}
                  </CardDescription>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                    {getStatusBadge(agent.status)}
                    <Badge
                      variant="secondary"
                      className="bg-muted/70 text-xs text-muted-foreground"
                    >
                      {agent.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4 pt-0">
                  <p className="line-clamp-3 h-[60px] text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                  <div className="mt-3 border-t border-primary/15 pt-3">
                    <div className="text-xs text-muted-foreground">
                      Pricing: {getPricingDisplay(agent.pricing)}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Author:{' '}
                      <span className="text-foreground">{agent.author}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-primary/15 bg-primary/5 p-3">
                  <Link
                    href={agent.entryPoint || `/explore/agents/${agent.id}`}
                    className="w-full"
                    legacyBehavior
                  >
                    <Button
                      asChild
                      variant={acquired ? 'secondary' : 'outline'}
                      size="sm"
                      className={cn(
                        'w-full',
                        acquired
                          ? 'border-secondary/40 text-secondary-foreground hover:bg-secondary/80'
                          : 'border-primary/40 text-primary hover:border-primary/60 hover:bg-primary/15 hover:text-accent-foreground'
                      )}
                    >
                      <a>{acquired ? 'Manage Agent' : 'View Details & Add'}</a>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
