// src/app/(public)/explore/agents/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store';
import { useUserAgentsStore } from '@/stores/user-agents.store';
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  Cpu,
  CurrencyDollar as DollarSign,
  FileText,
  GitBranch,
  ChatText as MessageSquare,
  ShieldCheck,
  Sparkle as Sparkles,
  Tag,
  UserCircle,
  Users,
  FlowArrow as Workflow,
  PlusCircle,
  GearSix as Settings2,
  PencilSimple as Edit,
  CircleNotch as Loader2,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  deployAgentInstance,
  type DeployAgentInput,
} from '@/lib/db/actions/agent-actions';

const getPhosphorIcon = (
  iconName: string | undefined,
  props?: any
): React.ReactNode => {
  const iconProps = { className: 'h-5 w-5', ...props };
  if (!iconName) return <Cpu {...iconProps} />;
  switch (iconName.toLowerCase()) {
    case 'cpu':
      return <Cpu {...iconProps} />;
    case 'shieldcheck':
      return <ShieldCheck {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'workflow':
      return <Workflow {...iconProps} />;
    case 'brain':
      return <Brain {...iconProps} />;
    default:
      return <Cpu {...iconProps} />;
  }
};

const getStatusBadge = (status?: MarketplaceAgent['status']) => {
  if (!status) return null;
  switch (status) {
    case 'available':
      return (
        <Badge className="border-green-500/30 bg-green-500/20 text-green-700 dark:text-green-300">
          Available
        </Badge>
      );
    case 'beta':
      return (
        <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-700 dark:text-blue-400">
          Beta
        </Badge>
      );
    case 'preview':
      return (
        <Badge className="border-purple-500/30 bg-purple-500/20 text-purple-700 dark:text-purple-400">
          Preview
        </Badge>
      );
    case 'coming_soon':
      return (
        <Badge className="border-yellow-500/30 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
          Coming Soon
        </Badge>
      );
    case 'deprecated':
      return <Badge variant="destructive">Deprecated</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPricingDisplay = (pricing: MarketplaceAgent['pricing']) => {
  if (!pricing)
    return <span className="font-semibold text-green-500">Included</span>;
  switch (pricing.type) {
    case 'free':
      return <span className="font-semibold text-green-500">Free</span>;
    case 'one-time':
      return (
        <span className="font-semibold">${pricing.amount} (One-Time)</span>
      );
    case 'subscription':
      return (
        <span className="font-semibold">
          ${pricing.amount}
          <span className="text-xs text-muted-foreground">
            /{pricing.billingCycle?.substring(0, 2)}
          </span>
        </span>
      );
    case 'usage-based':
      return <span className="font-semibold">Usage-Based</span>;
    default:
      return <span className="text-muted-foreground">Contact Us</span>;
  }
};

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = typeof params.id === 'string' ? params.id : '';
  const { toast } = useToast();

  const agent = useAgentMarketplaceStore(state => state.getAgentById(agentId));
  const { addAgentId, isAcquired } = useUserAgentsStore();
  const agentIsAcquired = isAcquired(agentId);

  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [instanceName, setInstanceName] = useState('');
  const [instanceDescription, setInstanceDescription] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (agent) {
      setInstanceName(agent.name);
    }
  }, [agent, isDeployDialogOpen]); // Reset instance name when dialog opens based on agent

  const handleInitiateDeploymentDialog = () => {
    if (!agent) return;
    setInstanceName(agent.name);
    setInstanceDescription('');
    setIsDeployDialogOpen(true);
  };

  const handleConfirmDeployment = async () => {
    if (!agent) return;
    setIsDeploying(true);

    const deployInput: DeployAgentInput = {
      marketplaceAgentId: agent.id,
      instanceName,
      instanceDescription,
      userId: 1, // Placeholder - replace with actual authenticated user ID
      config: {}, // Placeholder for future config
    };

    const result = await deployAgentInstance(deployInput);

    if (result.success) {
      addAgentId(agent.id);
      toast({
        title: 'Deployment Successful!',
        description: `Agent instance "${instanceName}" has been created.`,
        variant: 'default',
      });
      setIsDeployDialogOpen(false);
      router.push('/agents'); // Navigate to the agent console
    } else {
      toast({
        title: 'Deployment Failed',
        description:
          result.message ||
          'Could not deploy the agent instance. Please try again.',
        variant: 'destructive',
      });
    }
    setIsDeploying(false);
  };

  const handleManageAgent = () => {
    if (!agent) return;
    router.push('/agents');
  };

  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Cpu className="mx-auto mb-4 h-16 w-16 text-primary/60" />
        <h1 className="mb-4 font-headline text-3xl text-foreground">
          Agent Not Found
        </h1>
        <p className="mb-6 text-muted-foreground">
          The agent you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push('/explore/agents')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Button>
      </div>
    );
  }

  const primaryButtonAction = agentIsAcquired
    ? handleManageAgent
    : handleInitiateDeploymentDialog;
  const primaryButtonText = agentIsAcquired ? 'Manage Agent' : 'Deploy Agent';
  const primaryButtonIcon = agentIsAcquired ? (
    <Settings2 className="mr-2 h-5 w-5" />
  ) : (
    <PlusCircle className="mr-2 h-5 w-5" />
  );

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/explore/agents">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agent Marketplace
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-8 md:col-span-8">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      {getPhosphorIcon(agent.icon, {
                        className: 'h-10 w-10 text-primary',
                      })}
                      <h1 className="font-headline text-3xl text-foreground lg:text-4xl">
                        {agent.name}
                      </h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {agent.tagline}
                    </p>
                  </div>
                  {getStatusBadge(agent.status)}
                </div>
                <div className="space-x-3 pt-2 text-xs text-muted-foreground">
                  <span>
                    By:{' '}
                    <span className="font-medium text-primary">
                      {agent.author}
                    </span>
                  </span>
                  <span>
                    Version:{' '}
                    <span className="font-medium text-foreground">
                      {agent.version}
                    </span>
                  </span>
                  <span>
                    Category:{' '}
                    <span className="font-medium text-foreground">
                      {agent.category}
                    </span>
                  </span>
                </div>
              </CardHeader>

              {agent.heroImage && (
                <CardContent className="p-0">
                  <Image
                    src={agent.heroImage}
                    alt={`${agent.name} hero image`}
                    width={800}
                    height={450}
                    className="aspect-[16/8] w-full rounded-b-2xl rounded-t-none object-cover shadow-inner shadow-black/20"
                    data-ai-hint={agent.dataAiHints?.[0] || 'agent hero image'}
                  />
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  About this Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm prose-invert max-w-none sm:prose-base prose-headings:font-headline prose-p:text-muted-foreground prose-a:text-primary">
                <p>{agent.description}</p>
                {agent.longDescription && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: agent.longDescription.replace(/\n/g, '<br/>'),
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {agent.capabilities && agent.capabilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    Key Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agent.capabilities.map((cap, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-primary/20 bg-card/50 p-3"
                    >
                      {getPhosphorIcon(cap.icon || 'CheckCircle', {
                        className: 'h-6 w-6 text-primary mt-1 flex-shrink-0',
                      })}
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {cap.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {agent.previewImages && agent.previewImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    Screenshots & Previews
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {agent.previewImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${agent.name} preview ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full rounded-lg border border-primary/20 object-cover shadow-lg"
                      data-ai-hint={
                        agent.dataAiHints?.[index + 1] ||
                        `agent preview screenshot ${index + 1}`
                      }
                    />
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Placeholder for Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User reviews will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center font-headline text-lg">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" /> Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl">
                  {getPricingDisplay(agent.pricing)}
                </div>
                {agent.pricing?.tier && (
                  <p className="text-sm text-muted-foreground">
                    Tier:{' '}
                    <span className="text-foreground">
                      {agent.pricing.tier}
                    </span>
                  </p>
                )}
                {agent.pricing?.trialDays && (
                  <p className="text-sm text-green-400">
                    {agent.pricing.trialDays}-day free trial available.
                  </p>
                )}
                {agent.pricing?.detailsUrl && (
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-primary"
                  >
                    <Link href={agent.pricing.detailsUrl}>
                      View full pricing details
                    </Link>
                  </Button>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className={cn(
                    'w-full',
                    agentIsAcquired
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  onClick={primaryButtonAction}
                  disabled={isDeploying}
                >
                  {isDeploying && agentIsAcquired ? (
                    primaryButtonIcon
                  ) : isDeploying ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    primaryButtonIcon
                  )}
                  {isDeploying && agentIsAcquired
                    ? primaryButtonText
                    : isDeploying
                      ? 'Deploying...'
                      : primaryButtonText}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />{' '}
                  Author:{' '}
                  <span className="text-foreground">{agent.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />{' '}
                  Version:{' '}
                  <span className="text-foreground">{agent.version}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Category:{' '}
                  <span className="text-foreground">{agent.category}</span>
                </div>
                <div>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" /> Tags:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {agent.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-muted/70 text-xs text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                {agent.requiredOsVersion && (
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" /> Requires
                    NexOS:{' '}
                    <span className="text-foreground">
                      v{agent.requiredOsVersion}
                    </span>
                  </div>
                )}
                {agent.dependencies && agent.dependencies.length > 0 && (
                  <div>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" /> Dependencies:
                    </span>
                    <ul className="list-inside list-disc pl-4 text-xs text-foreground">
                      {agent.dependencies.map(dep => (
                        <li key={dep}>{dep}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {agent.permissionsRequired &&
                  agent.permissionsRequired.length > 0 && (
                    <div>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" /> Permissions:
                      </span>
                      <ul className="list-inside list-disc pl-4 text-xs text-foreground">
                        {agent.permissionsRequired.map(perm => (
                          <li key={perm}>{perm}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>

            {(agent.documentationUrl || agent.supportUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">
                    Support & Docs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {agent.documentationUrl && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href={agent.documentationUrl} target="_blank">
                        <FileText className="mr-2 h-4 w-4" />
                        Documentation
                      </Link>
                    </Button>
                  )}
                  {agent.supportUrl && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href={agent.supportUrl} target="_blank">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Support
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center font-headline text-2xl">
              <Edit className="mr-3 h-6 w-6 text-primary" /> Configure & Deploy:{' '}
              <span className="ml-1 text-primary">{agent?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Set up your new agent instance. This will be added to your "My
              Agents" list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="instance-name">Instance Name</Label>
              <Input
                id="instance-name"
                value={instanceName}
                onChange={e => setInstanceName(e.target.value)}
                placeholder="e.g., My Marketing Optimizer"
                className="border-input bg-input focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                A unique name for this specific deployment of {agent?.name}.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instance-description">
                Instance Description (Optional)
              </Label>
              <Textarea
                id="instance-description"
                value={instanceDescription}
                onChange={e => setInstanceDescription(e.target.value)}
                placeholder="Describe the purpose or specific configuration of this instance..."
                className="min-h-[80px] border-input bg-input focus:ring-primary"
              />
            </div>
            <Card className="border-border/50 bg-muted/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-semibold">
                  Agent Configuration (Placeholder)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
                <p>Agent-specific configuration options will appear here.</p>
                <p>
                  For now, default settings for <strong>{agent?.name}</strong>{' '}
                  will be used.
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeploying}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmDeployment}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isDeploying}
            >
              {isDeploying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isDeploying ? 'Deploying...' : 'Confirm & Deploy Agent'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
