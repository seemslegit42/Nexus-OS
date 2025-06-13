
// src/app/(public)/explore/agents/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAgentMarketplaceStore } from '@/stores/agent-marketplace.store';
import { useUserAgentsStore } from '@/stores/user-agents.store';
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, CheckCircle, Cpu, DollarSign, DownloadCloud, FileText, GitBranch, MessageSquare, ShieldCheck, Sparkles, Tag, UserCircle, Users, Workflow, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const getLucideIcon = (iconName: string | undefined, props?: any): React.ReactNode => {
  const iconProps = { className: "h-5 w-5", ...props };
  if (!iconName) return <Cpu {...iconProps} />;
  switch (iconName.toLowerCase()) {
    case 'cpu': return <Cpu {...iconProps} />;
    case 'shieldcheck': return <ShieldCheck {...iconProps} />;
    case 'sparkles': return <Sparkles {...iconProps} />;
    case 'workflow': return <Workflow {...iconProps} />;
    case 'brain': return <Brain {...iconProps} />;
    default: return <Cpu {...iconProps} />;
  }
};

const getStatusBadge = (status?: MarketplaceAgent['status']) => {
  if (!status) return null;
  switch (status) {
    case 'available':
      return <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">Available</Badge>;
    case 'beta':
      return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30">Beta</Badge>;
    case 'preview':
      return <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30">Preview</Badge>;
    case 'coming_soon':
      return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">Coming Soon</Badge>;
    case 'deprecated':
      return <Badge variant="destructive">Deprecated</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPricingDisplay = (pricing: MarketplaceAgent['pricing']) => {
  if (!pricing) return <span className="font-semibold text-green-500">Included</span>;
  switch (pricing.type) {
    case 'free':
      return <span className="font-semibold text-green-500">Free</span>;
    case 'one-time':
      return <span className="font-semibold">${pricing.amount} (One-Time)</span>;
    case 'subscription':
      return <span className="font-semibold">${pricing.amount}<span className="text-xs text-muted-foreground">/{pricing.billingCycle?.substring(0,2)}</span></span>;
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

  const handleAddAgent = () => {
    if (!agent) return;
    addAgentId(agent.id);
    toast({
      title: "Agent Added",
      description: `${agent.name} has been added to your NexOS environment. You can manage it from the 'Agents' page.`,
      variant: "default",
    });
  };

  const handleManageAgent = () => {
    if (!agent) return;
    router.push('/agents');
  };

  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Cpu className="mx-auto h-16 w-16 text-primary/60 mb-4" />
        <h1 className="text-3xl font-headline text-foreground mb-4">Agent Not Found</h1>
        <p className="text-muted-foreground mb-6">The agent you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/explore/agents')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/explore/agents">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agent Marketplace
          </Link>
        </Button>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="md:col-span-8 space-y-8">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getLucideIcon(agent.icon, {className: "h-10 w-10 text-primary"})}
                      <h1 className="text-3xl lg:text-4xl font-headline text-foreground">{agent.name}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">{agent.tagline}</p>
                  </div>
                  {getStatusBadge(agent.status)}
                </div>
                 <div className="text-xs text-muted-foreground pt-2 space-x-3">
                    <span>By: <span className="text-primary font-medium">{agent.author}</span></span>
                    <span>Version: <span className="text-foreground font-medium">{agent.version}</span></span>
                    <span>Category: <span className="text-foreground font-medium">{agent.category}</span></span>
                 </div>
              </CardHeader>
              
              {agent.heroImage && (
                <CardContent className="p-0">
                   <Image
                    src={agent.heroImage}
                    alt={`${agent.name} hero image`}
                    width={800}
                    height={450}
                    className="w-full object-cover aspect-[16/8] rounded-t-none rounded-b-2xl shadow-inner shadow-black/20"
                    data-ai-hint={agent.dataAiHints?.[0] || 'agent hero image'}
                  />
                </CardContent>
              )}
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">About this Agent</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-headline prose-p:text-muted-foreground prose-a:text-primary">
                    <p>{agent.description}</p>
                    {agent.longDescription && <div dangerouslySetInnerHTML={{__html: agent.longDescription.replace(/\n/g, '<br/>') }} />}
                </CardContent>
            </Card>

            {agent.capabilities && agent.capabilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Key Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agent.capabilities.map((cap, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-card/50">
                      {getLucideIcon(cap.icon || 'CheckCircle', { className: "h-6 w-6 text-primary mt-1 flex-shrink-0"})}
                      <div>
                        <h3 className="font-semibold text-foreground">{cap.title}</h3>
                        <p className="text-sm text-muted-foreground">{cap.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {agent.previewImages && agent.previewImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Screenshots & Previews</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agent.previewImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${agent.name} preview ${index + 1}`}
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full shadow-lg border border-primary/20"
                      data-ai-hint={agent.dataAiHints?.[index + 1] || `agent preview screenshot ${index + 1}`}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
             {/* Placeholder for Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User reviews will be displayed here.</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-primary"/> Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl">{getPricingDisplay(agent.pricing)}</div>
                {agent.pricing?.tier && <p className="text-sm text-muted-foreground">Tier: <span className="text-foreground">{agent.pricing.tier}</span></p>}
                {agent.pricing?.trialDays && <p className="text-sm text-green-400">{agent.pricing.trialDays}-day free trial available.</p>}
                {agent.pricing?.detailsUrl && <Button variant="link" asChild className="p-0 h-auto text-primary"><Link href={agent.pricing.detailsUrl}>View full pricing details</Link></Button>}
              </CardContent>
              <CardFooter>
                {agentIsAcquired ? (
                    <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={handleManageAgent}>
                        <CheckCircle className="mr-2 h-5 w-5" /> Manage Agent
                    </Button>
                ) : (
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddAgent}>
                        <PlusCircle className="mr-2 h-5 w-5" /> Add to My Agents
                    </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-muted-foreground"/> Author: <span className="text-foreground">{agent.author}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground"/> Version: <span className="text-foreground">{agent.version}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground"/> Category: <span className="text-foreground">{agent.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4"/> Tags:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {agent.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs bg-muted/70 text-muted-foreground">{tag}</Badge>)}
                  </div>
                </div>
                 {agent.requiredOsVersion && (
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground"/> Requires NexOS: <span className="text-foreground">v{agent.requiredOsVersion}</span>
                    </div>
                )}
                {agent.dependencies && agent.dependencies.length > 0 && (
                     <div>
                        <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4"/> Dependencies:</span>
                        <ul className="list-disc list-inside pl-4 text-xs text-foreground">
                            {agent.dependencies.map(dep => <li key={dep}>{dep}</li>)}
                        </ul>
                    </div>
                )}
                 {agent.permissionsRequired && agent.permissionsRequired.length > 0 && (
                     <div>
                        <span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Permissions:</span>
                        <ul className="list-disc list-inside pl-4 text-xs text-foreground">
                            {agent.permissionsRequired.map(perm => <li key={perm}>{perm}</li>)}
                        </ul>
                    </div>
                )}
              </CardContent>
            </Card>
            
            {(agent.documentationUrl || agent.supportUrl) && (
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Support & Docs</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {agent.documentationUrl && <Button variant="outline" asChild className="w-full"><Link href={agent.documentationUrl} target="_blank"><FileText className="mr-2 h-4 w-4"/>Documentation</Link></Button>}
                        {agent.supportUrl && <Button variant="outline" asChild className="w-full"><Link href={agent.supportUrl} target="_blank"><MessageSquare className="mr-2 h-4 w-4"/>Contact Support</Link></Button>}
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
