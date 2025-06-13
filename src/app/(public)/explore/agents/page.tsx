
// src/app/(public)/explore/agents/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Filter as FilterIcon, Cpu, Sparkles, ShieldCheck, Workflow, CheckCircle, Info, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store';
import { useUserAgentsStore } from '@/stores/user-agents.store'; // Added
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getLucideIcon = (iconName: string | undefined, props?: any): React.ReactNode => {
  const iconProps = { className: "h-8 w-8 mb-2 text-primary opacity-90 group-hover:scale-110 transition-transform duration-200", ...props };
  if (!iconName) return <Cpu {...iconProps} />; // Default icon
  switch (iconName.toLowerCase()) {
    case 'cpu': return <Cpu {...iconProps} />;
    case 'shieldcheck': return <ShieldCheck {...iconProps} />;
    case 'sparkles': return <Sparkles {...iconProps} />;
    case 'workflow': return <Workflow {...iconProps} />;
    // Add more cases as new icons are used
    default: return <Cpu {...iconProps} />;
  }
};

const getStatusBadge = (status: MarketplaceAgent['status']) => {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 text-xs">Available</Badge>;
    case 'beta':
      return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30 text-xs">Beta</Badge>;
    case 'preview':
      return <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30 text-xs">Preview</Badge>;
    case 'coming_soon':
      return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 text-xs">Coming Soon</Badge>;
    case 'deprecated':
      return <Badge variant="destructive" className="text-xs">Deprecated</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

const getPricingDisplay = (pricing: MarketplaceAgent['pricing']) => {
  if (!pricing) return <span className="text-xs text-green-500">Included</span>;
  switch (pricing.type) {
    case 'free':
      return <span className="text-xs text-green-500">Free</span>;
    case 'one-time':
      return <span className="text-xs text-foreground">${pricing.amount} (One-Time)</span>;
    case 'subscription':
      return <span className="text-xs text-foreground">${pricing.amount}/{pricing.billingCycle?.substring(0,2)}</span>;
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
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div>
            <h1 className="text-3xl font-headline text-foreground">NexOS Agent Marketplace</h1>
            <p className="text-muted-foreground">Discover and deploy AI agents to enhance your NexOS capabilities.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search agents (e.g., Security, Optimizer)..." 
                className="pl-9 w-full bg-input border-input focus:ring-primary" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/60">
                <FilterIcon className="mr-2 h-4 w-4 text-primary" /> Filter Agents
            </Button>
            {/* Placeholder for future "Submit Agent" button */}
        </div>
      </header>

      {displayedAgents.length === 0 ? (
         <Card className="text-center py-10 col-span-full bg-card/70 backdrop-blur-md">
          <CardContent>
            <Cpu className="mx-auto h-16 w-16 text-primary/60 mb-4" />
            <h2 className="text-2xl font-headline mb-2 text-foreground">No Agents Found</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {searchTerm ? `No agents match your search term "${searchTerm}". Try a different search or clear filters.` : "The Agent Marketplace is currently empty or agents are being updated. Please check back soon!"}
            </p>
            {searchTerm && <Button onClick={() => setSearchTerm('')} variant="outline">Clear Search</Button>}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedAgents.map(agent => {
              const acquired = isAcquired(agent.id);
              return (
                <Card 
                    key={agent.id} 
                    className={cn(
                    "group flex flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card/60 backdrop-blur-sm text-card-foreground shadow-[0_4px_30px_rgba(0,255,162,0.1)] hover:shadow-[0_8px_40px_rgba(0,255,162,0.2)] hover:border-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1",
                    acquired && "border-primary/50 ring-1 ring-primary/30"
                    )}
                >
                    <CardHeader className="p-4 text-center items-center relative"> {/* Added relative */}
                        {acquired && (
                            <Badge className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs py-0.5 px-2">
                                <CheckCircle className="mr-1 h-3 w-3" /> Added
                            </Badge>
                        )}
                        {getLucideIcon(agent.icon)}
                        <Link href={agent.entryPoint || `/explore/agents/${agent.id}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm">
                            <CardTitle className="font-headline text-lg text-primary line-clamp-1 group-hover:text-accent transition-colors" title={agent.name}>{agent.name}</CardTitle>
                        </Link>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 h-8" title={agent.tagline}>{agent.tagline}</CardDescription>
                        <div className="mt-2 flex flex-wrap justify-center gap-1.5 items-center">
                            {getStatusBadge(agent.status)}
                            <Badge variant="secondary" className="text-xs bg-muted/70 text-muted-foreground">{agent.category}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">{agent.description}</p>
                        <div className="mt-3 pt-3 border-t border-primary/15">
                            <div className="text-xs text-muted-foreground">Pricing: {getPricingDisplay(agent.pricing)}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Author: <span className="text-foreground">{agent.author}</span></div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-3 bg-primary/5 border-t border-primary/15">
                        <Link href={agent.entryPoint || `/explore/agents/${agent.id}`} className="w-full" legacyBehavior>
                        <Button asChild variant={acquired ? "secondary" : "outline"} size="sm" className={cn(
                            "w-full", 
                            acquired ? "border-secondary/40 text-secondary-foreground hover:bg-secondary/80" : "border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/60 hover:text-accent-foreground"
                        )}>
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
