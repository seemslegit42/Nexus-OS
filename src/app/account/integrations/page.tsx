
// src/app/account/integrations/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { KeyRound, Settings2, PlusCircle, Trash2, Edit2, LinkIcon, Webhook } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Placeholder data
const apiKeys = [
  { id: 'key_abc123', label: 'Main Production Key', created: '2023-01-15', lastUsed: '2023-10-25', tokenPreview: 'nexos_sk_live_...xyz' },
  { id: 'key_def456', label: 'Development Key', created: '2023-05-10', lastUsed: '2 hours ago', tokenPreview: 'nexos_sk_dev_...pqr' },
];

const webhooks = [
    { id: 'wh_1', url: 'https://api.example.com/nexos/item-updated', events: ['item.updated', 'item.created'], status: 'Active' },
    { id: 'wh_2', url: 'https://service.another.com/webhook', events: ['module.deployed'], status: 'Inactive' },
];

const availableIntegrations = [
    {id: 'slack', name: 'Slack', logo: 'https://placehold.co/32x32.png?text=S', dataAiHint: 'slack logo', description: 'Receive notifications and manage tasks via Slack.', connected: true},
    {id: 'github', name: 'GitHub', logo: 'https://placehold.co/32x32.png?text=G', dataAiHint: 'github logo', description: 'Sync repositories and trigger builds on code changes.', connected: false},
    {id: 'google_drive', name: 'Google Drive', logo: 'https://placehold.co/32x32.png?text=GD', dataAiHint: 'google drive logo', description: 'Connect your cloud storage for file management.', connected: false},
];

const innerCardClassName = "bg-card/70 backdrop-blur-sm border-primary/20 rounded-xl p-3 shadow-lg hover:border-primary/30 transition-all";


export default function AccountIntegrationsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-3xl font-headline text-foreground">Integrations & API</h1>
        <p className="text-muted-foreground">Manage API keys, webhooks, and connect third-party services.</p>
      </header>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-headline flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/> API Keys</CardTitle>
          <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Generate New Key</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.map(key => (
            <div key={key.id} className={cn(innerCardClassName)}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{key.label}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{key.tokenPreview}</p>
                  <p className="text-xs text-muted-foreground">Created: {key.created} | Last Used: {key.lastUsed}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" title="Edit Label"><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Revoke Key" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
          {apiKeys.length === 0 && <p className="text-sm text-muted-foreground">No API keys generated yet.</p>}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-headline flex items-center"><Webhook className="mr-2 h-5 w-5 text-primary"/> Webhooks</CardTitle>
          <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Webhook</Button>
        </CardHeader>
        <CardContent className="space-y-3">
            {webhooks.map(hook => (
                <div key={hook.id} className={cn(innerCardClassName)}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold break-all">{hook.url}</h4>
                            <p className="text-xs text-muted-foreground">Events: {hook.events.join(', ')}</p>
                            <p className="text-xs">Status: <span className={hook.status === 'Active' ? "text-green-400" : "text-muted-foreground"}>{hook.status}</span></p>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" title="Edit Webhook"><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="Delete Webhook" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            ))}
            {webhooks.length === 0 && <p className="text-sm text-muted-foreground">No webhooks configured.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary"/> Connected Applications</CardTitle>
          <CardDescription>Manage third-party application integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {availableIntegrations.map(integration => (
                <div key={integration.id} className={cn(innerCardClassName, "flex items-center justify-between")}>
                    <div className="flex items-center gap-3">
                        <Image src={integration.logo} alt={integration.name} width={32} height={32} data-ai-hint={integration.dataAiHint} className="rounded"/>
                        <div>
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-xs text-muted-foreground">{integration.description}</p>
                        </div>
                    </div>
                    {integration.connected ? (
                        <Button variant="destructive" size="sm">Disconnect</Button>
                    ) : (
                        <Button variant="outline" size="sm">Connect</Button>
                    )}
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
