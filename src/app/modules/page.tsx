
// src/app/modules/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Blocks, Cpu, GitMerge, Lock, Filter, Briefcase, PlusCircle, Edit, PlugZap, Share2 } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const modules = [
  { name: 'Data Ingestion Pipeline', version: '1.2.0', category: 'Data Tools', agentsAttached: 2, status: 'Active', permissions: 'Admin, DataEngineers' },
  { name: 'Real-time Analytics Engine', version: '2.0.1', category: 'Analytics', agentsAttached: 1, status: 'Active', permissions: 'Analysts, Managers' },
  { name: 'Automated Reporting Service', version: '0.9.5', category: 'Reporting', agentsAttached: 0, status: 'Idle', permissions: 'All Users' },
  { name: 'Security Threat Detector', version: '3.1.0', category: 'Security', agentsAttached: 3, status: 'Critical', permissions: 'SecurityTeam' },
];

function ModuleMarketplaceContent(): ReactNode {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <Input placeholder="Search marketplace..." className="max-w-xs bg-background border-input focus:ring-primary" />
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter Modules</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><PlusCircle className="mr-2 h-4 w-4" /> Create New Module</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh_-_200px)] p-1">
        {modules.map((mod, i) => (
          <Card key={i} className="bg-background/70 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-primary">{mod.name}</CardTitle>
                <Badge variant={mod.status === 'Active' ? 'default' : mod.status === 'Critical' ? 'destructive' : 'secondary'}
                  className={mod.status === 'Active' ? 'bg-green-500/80 text-white' : ''}
                >
                  {mod.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">v{mod.version} - {mod.category}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2 flex-grow">
              <div className="flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-muted-foreground" /> Agents Attached: {mod.agentsAttached}
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" /> Permissions: {mod.permissions}
              </div>
              <Image src={`https://placehold.co/300x150.png`} alt={`${mod.name} Diagram`} width={300} height={150} className="mt-2 rounded-md border" data-ai-hint="workflow diagram" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                {mod.agentsAttached > 0 ? 'Manage Agents' : 'Attach Agent'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function ModuleEditorContent(): ReactNode {
  return (
    <div className="p-1 space-y-3 flex flex-col h-full">
      <h3 className="text-md font-semibold font-headline text-foreground">Editing: Data Ingestion Pipeline</h3>
      <div>
        <Label htmlFor="module-name">Module Name</Label>
        <Input id="module-name" defaultValue="Data Ingestion Pipeline" className="bg-background border-input focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="module-description">Description</Label>
        <Textarea id="module-description" defaultValue="Handles ETL processes for various data sources." className="bg-background border-input focus:ring-primary min-h-[60px]" />
      </div>
      <div className="flex-grow bg-muted/30 rounded-md p-2">
        <Image src="https://placehold.co/400x250.png" alt="Workflow Visual Editor" width={400} height={250} className="w-full h-full object-contain rounded" data-ai-hint="visual editor interface" />
      </div>
      <Button className="w-full">Save Module</Button>
    </div>
  );
}

function ApiExtensionManagerContent(): ReactNode {
  return (
    <div className="p-1 space-y-3">
      <h3 className="text-md font-semibold font-headline text-foreground">API Extensions</h3>
      <p className="text-xs text-muted-foreground">Manage external API integrations and keys.</p>
      <div className="space-y-2">
        <Card className="bg-background/50">
          <CardHeader className="p-3"><CardTitle className="text-sm">OpenAI API</CardTitle></CardHeader>
          <CardContent className="p-3 text-xs">Status: Connected | Usage: Moderate</CardContent>
        </Card>
         <Card className="bg-background/50">
          <CardHeader className="p-3"><CardTitle className="text-sm">Google Maps API</CardTitle></CardHeader>
          <CardContent className="p-3 text-xs">Status: Needs Configuration</CardContent>
        </Card>
      </div>
      <Button variant="outline" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add New API Extension</Button>
    </div>
  );
}

function IntegrationManagerContent(): ReactNode {
  return (
    <div className="p-1 space-y-3">
       <h3 className="text-md font-semibold font-headline text-foreground">System Integrations</h3>
      <p className="text-xs text-muted-foreground">Connect NexOS with other platforms and services.</p>
      <div className="grid grid-cols-2 gap-2">
         <Button variant="outline" className="h-auto p-3 flex-col items-center justify-center">
            <Image src="https://placehold.co/48x48.png" alt="Slack" width={32} height={32} data-ai-hint="slack logo" />
            <span className="text-xs mt-1">Slack</span>
        </Button>
        <Button variant="outline" className="h-auto p-3 flex-col items-center justify-center">
            <Image src="https://placehold.co/48x48.png" alt="Zapier" width={32} height={32} data-ai-hint="zapier logo" />
            <span className="text-xs mt-1">Zapier</span>
        </Button>
      </div>
       <Button variant="outline" className="w-full mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Add New Integration</Button>
    </div>
  );
}


export default function ModulesPage() {
  const modulesPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'moduleMarketplace',
      title: 'Module Marketplace',
      icon: <Briefcase className="w-5 h-5" />,
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
      icon: <Edit className="w-5 h-5" />,
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
      icon: <PlugZap className="w-5 h-5" />,
      content: <ApiExtensionManagerContent />,
      defaultLayout: {
        lg: { x: 0, y: 16, w: 6, h: 8, minW: 3, minH: 5 }, 
        md: { x: 0, y: 16, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 18, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'integrationManager',
      title: 'Integration Manager',
      icon: <Share2 className="w-5 h-5" />,
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
      className="flex-grow"
    />
  );
}

    