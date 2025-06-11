
// src/app/modules/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Blocks, Cpu, GitMerge, Lock, Filter, Briefcase, PlusCircle, Edit, PlugZap, Share2, Package, Settings, Workflow, KeyRound, Construction } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const modules = [
  { name: 'Data Ingestion Pipeline', version: '1.2.0', category: 'Data Tools', agentsAttached: 2, status: 'Active', permissions: 'Admin, DataEngineers' },
  { name: 'Real-time Analytics Engine', version: '2.0.1', category: 'Analytics', agentsAttached: 1, status: 'Active', permissions: 'Analysts, Managers' },
  { name: 'Automated Reporting Service', version: '0.9.5', category: 'Reporting', agentsAttached: 0, status: 'Idle', permissions: 'All Users' },
  { name: 'Security Threat Detector', version: '3.1.0', category: 'Security', agentsAttached: 3, status: 'Critical', permissions: 'SecurityTeam' },
  { name: 'Customer Sentiment Analyzer', version: '1.0.0', category: 'AI/ML', agentsAttached: 1, status: 'Active', permissions: 'Support, Marketing' },
  { name: 'Inventory Management API Bridge', version: '1.5.2', category: 'API Bridge', agentsAttached: 0, status: 'Development', permissions: 'Developers' },
];

function ModuleMarketplaceContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3 border-b border-border/60">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <Input placeholder="Search modules (functions, flows, API bridges)..." className="md:max-w-xs bg-background/70 border-input focus:ring-primary h-9 text-sm" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-sm bg-card/60 hover:bg-muted/60"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-1 md:p-2">
            {modules.map((mod, i) => (
              <Card key={i} className="bg-card/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow flex flex-col border-border/60">
                <CardHeader className="p-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-base text-primary leading-tight">{mod.name}</CardTitle>
                    <Badge 
                      variant={
                        mod.status === 'Active' ? 'default' :
                        mod.status === 'Critical' ? 'destructive' :
                        mod.status === 'Development' ? 'outline' : 
                        'secondary' 
                      }
                      className={cn(
                        "text-xs py-0.5 px-2 h-5 leading-tight",
                        mod.status === 'Active' && 'bg-green-500/80 text-white dark:bg-green-600/80',
                        mod.status === 'Development' && 'text-yellow-600 border-yellow-500/80 dark:text-yellow-400 dark:border-yellow-500/60'
                      )}
                    >
                      {mod.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">v{mod.version} - {mod.category}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-1.5 p-3 flex-grow">
                  <div className="flex items-center text-muted-foreground">
                    <Cpu className="h-3.5 w-3.5 mr-1.5" /> Agents Attached: <span className="text-foreground ml-1">{mod.agentsAttached}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 mr-1.5" /> Permissions: <span className="text-foreground ml-1">{mod.permissions}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 italic">Execution Graph & Permission Tree</p>
                  <Image src={`https://placehold.co/200x100.png`} alt={`${mod.name} Diagram`} width={200} height={100} className="mt-1 rounded border border-border/50 opacity-60" data-ai-hint="workflow diagram permissions tree" />
                </CardContent>
                <CardFooter className="flex justify-between p-2.5 border-t border-border/60">
                  <Button variant="outline" size="sm" className="text-xs bg-card/60 hover:bg-muted/60">Details / Edit</Button>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs">
                    <Cpu className="mr-1.5 h-3.5 w-3.5"/>
                    {mod.agentsAttached > 0 ? 'Manage Agents' : 'Attach Agent'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ModuleEditorContent(): ReactNode { 
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground flex items-center">
            <Edit className="w-4 h-4 mr-2 text-primary"/>Module Editor: <span className="text-primary ml-1">Data Ingestion</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-3 space-y-3 flex-grow">
        <div>
          <Label htmlFor="module-name" className="text-xs">Module Name</Label>
          <Input id="module-name" defaultValue="Data Ingestion Pipeline" className="bg-background/70 border-input focus:ring-primary h-8 text-sm mt-0.5" />
        </div>
        <div>
          <Label htmlFor="module-description" className="text-xs">Description</Label>
          <Textarea id="module-description" defaultValue="Handles ETL processes for various data sources." className="bg-background/70 border-input focus:ring-primary min-h-[50px] text-sm mt-0.5" />
        </div>
        <div className="flex-grow bg-muted/20 rounded-md p-2 flex items-center justify-center border border-border/50">
          <Image src="https://placehold.co/400x250.png" alt="Workflow Visual Editor" width={400} height={250} className="w-full h-full object-contain rounded opacity-70" data-ai-hint="visual editor graph permissions" />
        </div>
      </CardContent>
      <CardFooter className="p-2 md:p-3 border-t border-border/60">
         <Button className="w-full" size="sm">Save Module</Button>
      </CardFooter>
    </Card>
  );
}

function ApiExtensionManagerContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
        <CardHeader className="p-2 md:p-3">
            <CardTitle className="text-md font-semibold font-headline text-foreground flex items-center"><PlugZap className="w-4 h-4 mr-2 text-primary"/>API Extension Manager</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-3 space-y-2 flex-grow overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-2">Manage external API integrations and keys.</p>
            <Card className="bg-card/50 border-border/50">
            <CardHeader className="p-2"><CardTitle className="text-sm">OpenAI API <Badge variant="secondary" className="ml-2 text-xs bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">Active</Badge></CardTitle></CardHeader>
            <CardContent className="p-2 text-xs text-muted-foreground">Status: Connected | Usage: Moderate</CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
            <CardHeader className="p-2"><CardTitle className="text-sm">Google Maps API <Badge variant="outline" className="ml-2 text-xs border-yellow-500/50 text-yellow-600 dark:text-yellow-400">Needs Config</Badge></CardTitle></CardHeader>
            <CardContent className="p-2 text-xs text-muted-foreground">Status: Needs Configuration</CardContent>
            </Card>
            <Image src="https://placehold.co/300x150.png" alt="API Key Management" width={300} height={150} className="rounded-md my-2 opacity-50 border border-border/50" data-ai-hint="api keys list form" />
        </CardContent>
        <CardFooter className="p-2 md:p-3 border-t border-border/60">
            <Button variant="outline" className="w-full bg-card/60 hover:bg-muted/60" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add New API Extension</Button>
        </CardFooter>
    </Card>
  );
}

function IntegrationManagerContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground flex items-center"><Share2 className="w-4 h-4 mr-2 text-primary"/>System Integrations</CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-3 space-y-2 flex-grow overflow-y-auto">
        <p className="text-xs text-muted-foreground mb-2">Connect NexOS with other platforms and services.</p>
        <div className="grid grid-cols-2 gap-2">
            {[ { name: "Slack", hint: "slack logo"}, { name: "Zapier", hint: "zapier logo"}, { name: "GitHub", hint: "github logo"}, { name: "Jira", hint: "jira logo"}].map(item => (
                 <Button key={item.name} variant="outline" className="h-auto p-2 flex-col items-center justify-center bg-card/60 hover:bg-muted/60">
                    <Image src="https://placehold.co/48x48.png" alt={item.name} width={24} height={24} data-ai-hint={item.hint} className="opacity-80"/>
                    <span className="text-xs mt-1 text-muted-foreground">{item.name}</span>
                </Button>
            ))}
        </div>
        <Image src="https://placehold.co/300x100.png" alt="Integration Setup" width={300} height={100} className="rounded-md my-2 opacity-50 border border-border/50" data-ai-hint="integration connection form" />
      </CardContent>
       <CardFooter className="p-2 md:p-3 border-t border-border/60">
        <Button variant="outline" className="w-full bg-card/60 hover:bg-muted/60" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add New Integration</Button>
       </CardFooter>
    </Card>
  );
}


export default function ModulesPage() {
  const modulesPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'moduleMarketplace',
      title: 'Module Store (Internal)',
      icon: <Package className="w-4 h-4" />,
      content: <ModuleMarketplaceContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 7, h: 16, minW: 4, minH: 10 }, 
        md: { x: 0, y: 0, w: 6, h: 16, minW: 4, minH: 10 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 8 },
      },
    },
    {
      id: 'moduleEditor',
      title: 'Module Editor / Creator',
      icon: <Construction className="w-4 h-4" />,
      content: <ModuleEditorContent />,
      defaultLayout: {
        lg: { x: 7, y: 0, w: 5, h: 16, minW: 3, minH: 10 }, 
        md: { x: 6, y: 0, w: 4, h: 16, minW: 3, minH: 10 },
        sm: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 6 },
      },
    },
    {
      id: 'apiExtensionManager',
      title: 'API Extension Manager',
      icon: <KeyRound className="w-4 h-4" />,
      content: <ApiExtensionManagerContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 6, h: 8, minW: 3, minH: 5 }, 
        md: { x: 0, y: 16, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 18, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'integrationManager',
      title: 'System Integration Manager',
      icon: <Share2 className="w-4 h-4" />,
      content: <IntegrationManagerContent />,
      defaultLayout: {
        lg: { x: 6, y: 16, w: 6, h: 8, minW: 3, minH: 5 }, 
        md: { x: 5, y: 16, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 24, w: 6, h: 6, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={modulesPageZoneConfigs}
      className="flex-grow p-1 md:p-2"
       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}
