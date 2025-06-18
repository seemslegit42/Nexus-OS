// src/app/account/integrations/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/lib/icons';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface ApiKey {
  id: string;
  label: string;
  created: string;
  lastUsed: string;
  tokenPreview: string;
}

interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive';
}

interface IntegrationApp {
  id: string;
  name: string;
  logo: string;
  dataAiHint?: string;
  description: string;
  connected: boolean;
}

export default function AccountIntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>([]);
  const [availableIntegrations, setAvailableIntegrations] = useState<
    IntegrationApp[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  const innerCardClassName =
    'bg-card/70 backdrop-blur-sm border-primary/20 rounded-xl p-3 shadow-lg hover:border-primary/30 transition-all';

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-4 md:p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="font-headline text-3xl text-foreground">
          Integrations & API
        </h1>
        <p className="text-muted-foreground">
          Manage API keys, webhooks, and connect third-party services.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center font-headline">
            <KeyRound className="mr-2 h-5 w-5 text-primary" /> API Keys
          </CardTitle>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Generate New Key
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.map(key => (
            <div key={key.id} className={cn(innerCardClassName)}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{key.label}</h4>
                  <p className="font-mono text-xs text-muted-foreground">
                    {key.tokenPreview}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created: {key.created} | Last Used: {key.lastUsed}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" title="Edit Label">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Revoke Key"
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {apiKeys.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No API keys generated yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center font-headline">
            <Webhook className="mr-2 h-5 w-5 text-primary" /> Webhooks
          </CardTitle>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Webhook
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {webhooks.map(hook => (
            <div key={hook.id} className={cn(innerCardClassName)}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="break-all font-semibold">{hook.url}</h4>
                  <p className="text-xs text-muted-foreground">
                    Events: {hook.events.join(', ')}
                  </p>
                  <p className="text-xs">
                    Status:{' '}
                    <span
                      className={
                        hook.status === 'Active'
                          ? 'text-green-400'
                          : 'text-muted-foreground'
                      }
                    >
                      {hook.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" title="Edit Webhook">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete Webhook"
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {webhooks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No webhooks configured.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-headline">
            <LinkIcon className="mr-2 h-5 w-5 text-primary" /> Connected
            Applications
          </CardTitle>
          <CardDescription>
            Manage third-party application integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableIntegrations.map(integration => (
            <div
              key={integration.id}
              className={cn(
                innerCardClassName,
                'flex items-center justify-between'
              )}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={integration.logo}
                  alt={integration.name}
                  width={32}
                  height={32}
                  data-ai-hint={integration.dataAiHint}
                  className="rounded"
                />
                <div>
                  <h4 className="font-semibold">{integration.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.connected ? (
                <Button variant="destructive" size="sm">
                  Disconnect
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
