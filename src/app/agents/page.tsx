// src/app/agents/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react'; // Added useMemo
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  MagnifyingGlass as Search,
  Eye,
  GearSix as Settings2,
  Trash,
  Robot as Bot,
  MagnifyingGlass as PackageSearch,
} from '@phosphor-icons/react'; // Added PackageSearch
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUserAgentsStore } from '@/stores/user-agents.store'; // Added
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store'; // Added
import type { MarketplaceAgent } from '@/types/marketplace-agent'; // Added

// Mock data removed as we'll use the store

function AgentListContent(): ReactNode {
  const acquiredAgentIds = useUserAgentsStore(state => state.acquiredAgentIds);
  const getAgentById = useAgentMarketplaceStore(state => state.getAgentById);

  const userAgents = useMemo(() => {
    return acquiredAgentIds
      .map(id => getAgentById(id))
      .filter(agent => agent !== undefined) as MarketplaceAgent[];
  }, [acquiredAgentIds, getAgentById]);

  const getStatusBadgeVariant = (status: MarketplaceAgent['status']) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'beta':
        return 'secondary'; // Consider a blueish variant for beta
      case 'preview':
        return 'outline'; // Consider a purpleish variant for preview
      case 'coming_soon':
        return 'outline';
      case 'deprecated':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeColorClass = (
    status: MarketplaceAgent['status']
  ): string => {
    switch (status) {
      case 'available':
        return 'bg-green-500/80 text-white dark:bg-green-600/80';
      case 'beta':
        return 'bg-blue-500/80 text-white dark:bg-blue-600/80'; // Example blue for beta
      case 'preview':
        return 'bg-purple-500/80 text-white dark:bg-purple-600/80'; // Example purple for preview
      case 'coming_soon':
        return 'bg-yellow-500/80 text-yellow-950 dark:text-yellow-50 dark:bg-yellow-600/70';
      case 'deprecated':
        return 'bg-red-700/80 text-white dark:bg-red-800/80';
      default:
        return 'border-border';
    }
  };

  if (userAgents.length === 0) {
    return (
      <Card className="flex h-full flex-col items-center justify-center border-none bg-transparent text-center shadow-none">
        <PackageSearch className="mb-4 h-16 w-16 text-muted-foreground/70" />
        <CardTitle className="font-headline text-xl text-foreground">
          No Agents Acquired Yet
        </CardTitle>
        <CardDescription className="mb-4 mt-1 max-w-xs text-muted-foreground">
          Start by exploring the Agent Marketplace and adding agents to your
          NexOS environment.
        </CardDescription>
        <Link href="/explore/agents" passHref legacyBehavior>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a>Explore Marketplace</a>
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="border-b border-border/60 p-2 md:p-3">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your agents (name, category...)"
              className="h-9 border-input bg-input pl-9 text-sm focus:ring-primary"
            />
          </div>
          <Link href="/onboarding" passHref legacyBehavior>
            <Button
              asChild
              className="h-9 w-full bg-primary text-sm text-primary-foreground hover:bg-primary/90 md:w-auto"
            >
              <a>
                <PlusCircle className="mr-2 h-4 w-4" /> Spawn New Agent (via
                Onboarding)
              </a>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[200px] text-xs">Name</TableHead>
                  <TableHead className="text-xs">
                    Status (Marketplace)
                  </TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Tags</TableHead>
                  <TableHead className="text-xs">Author</TableHead>
                  <TableHead className="w-[150px] text-right text-xs">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAgents.map(agent => (
                  <TableRow
                    key={agent.id}
                    className="border-border/60 hover:bg-muted/30"
                  >
                    <TableCell className="py-2 text-sm font-medium text-foreground">
                      {agent.name}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={getStatusBadgeVariant(agent.status)}
                        className={cn(
                          'h-5 px-2 py-0.5 text-xs leading-tight',
                          getStatusBadgeColorClass(agent.status)
                        )}
                      >
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {agent.category}
                    </TableCell>
                    <TableCell
                      className="max-w-[150px] truncate py-2 text-xs text-muted-foreground"
                      title={agent.tags.join(', ')}
                    >
                      {agent.tags.slice(0, 3).join(', ')}
                      {agent.tags.length > 3 ? '...' : ''}
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {agent.author}
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Link href={`/explore/agents/${agent.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details in Marketplace</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Configure Agent (Placeholder)</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove Agent (Placeholder)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AgentConfigurationContent(): ReactNode {
  // Placeholder for actual agent configuration UI
  const userAgentsStore = useUserAgentsStore();
  const getAgentById = useAgentMarketplaceStore(state => state.getAgentById);
  const firstAgent =
    userAgentsStore.acquiredAgentIds.length > 0
      ? getAgentById(userAgentsStore.acquiredAgentIds[0])
      : null;

  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Configure:{' '}
          <span className="text-primary">
            {firstAgent ? firstAgent.name : 'No Agent Selected'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-2 md:p-3">
        {firstAgent ? (
          <>
            <p className="text-xs text-muted-foreground">
              Adjust agent parameters, training data sources, and operational
              scope for "{firstAgent.name}".
            </p>
            <Image
              src="https://placehold.co/400x300.png"
              alt="Agent Config Form"
              width={400}
              height={300}
              className="rounded-md border border-border/60 opacity-70"
              data-ai-hint="settings form interface parameters"
            />
            <Button className="w-full" size="sm">
              Save Changes
            </Button>
          </>
        ) : (
          <p className="py-10 text-center text-xs text-muted-foreground">
            Select an agent from the fleet overview to configure it, or add one
            from the marketplace.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function LiveAgentActivityContent(): ReactNode {
  const userAgentsStore = useUserAgentsStore();
  const getAgentById = useAgentMarketplaceStore(state => state.getAgentById);
  const firstAgent =
    userAgentsStore.acquiredAgentIds.length > 0
      ? getAgentById(userAgentsStore.acquiredAgentIds[0])
      : null;
  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-headline font-semibold text-foreground">
          Shadow Mode:{' '}
          <span className="text-primary">
            {firstAgent ? firstAgent.name : 'No Agent Selected'}
          </span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Real-time visualization of actions and decision-making process.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow rounded-b-md bg-muted/20 p-2 md:p-3">
        {firstAgent ? (
          <Image
            src="https://placehold.co/600x300.png"
            alt="Agent Activity Stream / Visual Debugger"
            width={600}
            height={300}
            className="rounded-md border border-border/60 opacity-70"
            data-ai-hint="data stream activity graph logs"
          />
        ) : (
          <p className="py-10 text-center text-xs text-muted-foreground">
            Select an agent to view its live activity or add one from the
            marketplace.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AgentConsolePage() {
  const agentPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'agentList',
      title: 'My Acquired Agents',
      icon: <Bot className="h-4 w-4" />,
      content: <AgentListContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 10, minW: 6, minH: 6 },
        md: { x: 0, y: 0, w: 10, h: 10, minW: 5, minH: 6 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
      },
    },
    {
      id: 'agentConfiguration',
      title: 'Agent Configuration & Scope',
      icon: <Settings2 className="h-4 w-4" />,
      content: <AgentConfigurationContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 5, h: 10, minW: 3, minH: 6 },
        md: { x: 0, y: 10, w: 5, h: 9, minW: 3, minH: 6 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'liveAgentDebugger',
      title: 'Live Agent Activity / Debugger',
      icon: <Eye className="h-4 w-4" />,
      content: <LiveAgentActivityContent />,
      defaultLayout: {
        lg: { x: 5, y: 10, w: 7, h: 10, minW: 4, minH: 6 },
        md: { x: 5, y: 10, w: 5, h: 9, minW: 3, minH: 6 },
        sm: { x: 0, y: 17, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={agentPageZoneConfigs}
      className="flex-grow p-1 md:p-2"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
