
// src/app/admin/micro-apps/page.tsx
'use client';

import { useState, type ReactNode, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Search, Filter as FilterIcon, Edit, Copy, Rocket, EyeOff, Eye, MoreVertical, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import type { MicroApp } from '@/types/micro-app';
import { MicroAppDetailDrawer } from '@/components/admin/micro-apps/micro-app-detail-drawer';
import { cn } from '@/lib/utils';

const mockMicroApps: MicroApp[] = [
  {
    id: 'autopilot_v1',
    internalName: 'autopilot',
    displayName: 'Autopilot Workflow Builder',
    icon: 'Workflow', // Placeholder for Lucide icon name
    description: 'Visually create and manage multi-step AI-powered automations and task chains.',
    category: 'Automation',
    status: 'enabled',
    tags: ['workflow', 'ai', 'visual-editor', 'automation', 'low-code'],
    agentDependencies: ['Orion', 'Proxy'],
    authRequired: true,
    monetization: { enabled: true, price: 29, billingCycle: 'monthly', billingAgent: 'BillingProxy' },
    flags: { isFeatured: true, requiresBetaFeature: false },
    version: '1.1.0',
    entryPoint: '/loom-studio?app=autopilot',
    deployableTo: ['loom-studio', 'dashboard'],
    permissionsRequired: ['agent:execute', 'workflow:create'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'guardian_sec_v2.3',
    internalName: 'guardian-security-center',
    displayName: 'Guardian Security Center',
    icon: 'ShieldCheck',
    description: 'Monitor system threats, analyze security logs, and manage access controls.',
    category: 'Security',
    status: 'enabled',
    tags: ['security', 'monitoring', 'rbac', 'threat-detection'],
    agentDependencies: ['Aegis', 'LogSentinel'],
    authRequired: true,
    monetization: null,
    flags: { systemInternal: true },
    version: '2.3.1',
    entryPoint: '/security',
    deployableTo: ['dedicated-tab'],
    permissionsRequired: ['security:admin', 'logs:view_sensitive'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pulse_monitor_v0.9b',
    internalName: 'system-pulse',
    displayName: 'System Pulse Monitor',
    icon: 'RadioTower',
    description: 'Live overview of system health, agent activity, and key performance metrics.',
    category: 'Monitoring',
    status: 'beta',
    tags: ['monitoring', 'health', 'real-time', 'kpi'],
    agentDependencies: [],
    authRequired: true,
    monetization: null,
    flags: { requiresBetaFeature: true },
    version: '0.9.0-beta',
    entryPoint: '/pulse',
    deployableTo: ['dedicated-tab', 'dashboard'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dev_tools_alpha',
    internalName: 'developer-sandbox',
    displayName: 'Developer Sandbox',
    icon: 'TerminalSquare',
    description: 'Experimental tools and features for NexOS developers. Use with caution.',
    category: 'Development',
    status: 'dev-only',
    tags: ['experimental', 'debug', 'tools'],
    agentDependencies: [],
    authRequired: true,
    monetization: null,
    flags: { isDevOnly: true },
    version: '0.1.0-alpha',
    deployableTo: ['none'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to get appropriate badge variant for status
const getStatusBadgeVariant = (status: MicroApp['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'enabled': return 'default'; // Will be green due to custom styling if any, or primary
    case 'disabled': return 'secondary';
    case 'dev-only': return 'outline'; // often yellow/orange
    case 'archived': return 'destructive';
    case 'beta': return 'default'; // often blue or purple, use primary for now
    default: return 'outline';
  }
};
const getStatusBadgeColorClass = (status: MicroApp['status']): string => {
  switch (status) {
    case 'enabled': return 'bg-green-500/80 text-white dark:bg-green-600/80';
    case 'disabled': return 'bg-gray-400/80 text-gray-800 dark:bg-gray-600/80 dark:text-gray-200';
    case 'dev-only': return 'border-yellow-500/80 text-yellow-600 dark:border-yellow-500/60 dark:text-yellow-400';
    case 'archived': return 'bg-red-700/80 text-white dark:bg-red-800/80';
    case 'beta': return 'bg-blue-500/80 text-white dark:bg-blue-600/80';
    default: return 'border-border';
  }
};


export default function MicroAppRegistryPage() {
  const [apps, setApps] = useState<MicroApp[]>(mockMicroApps);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<MicroApp | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const filteredApps = useMemo(() => {
    if (!searchTerm) return apps;
    return apps.filter(app =>
      app.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.agentDependencies.some(agent => agent.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [apps, searchTerm]);

  const handleEditApp = (app: MicroApp) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  const handleSaveAppDetails = (updatedApp: MicroApp) => {
    setApps(prevApps => prevApps.map(app => app.id === updatedApp.id ? updatedApp : app));
    // In a real app, you'd also make an API call here
  };
  
  const handleRegisterNewApp = (newApp: Partial<MicroApp>) => {
    // Basic registration logic
    const fullNewApp: MicroApp = {
      id: `${newApp.internalName?.replace(/\s+/g, '-').toLowerCase() || 'new-app'}_${new Date().getTime()}`,
      internalName: newApp.internalName || 'new-micro-app',
      displayName: newApp.displayName || 'New Micro-App',
      icon: newApp.icon || 'Package',
      description: newApp.description || 'A new micro-application for NexOS.',
      category: newApp.category || 'General',
      status: newApp.status || 'dev-only',
      tags: newApp.tags || [],
      agentDependencies: newApp.agentDependencies || [],
      authRequired: newApp.authRequired !== undefined ? newApp.authRequired : true,
      monetization: newApp.monetization || null,
      flags: newApp.flags || {},
      version: newApp.version || '0.1.0',
      deployableTo: newApp.deployableTo || ['none'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newApp, // Override with any specifics passed
    };
    setApps(prevApps => [fullNewApp, ...prevApps]);
    setIsRegisterDialogOpen(false);
  };
  
  const toggleAppStatus = (appId: string) => {
    setApps(prevApps => prevApps.map(app => {
      if (app.id === appId) {
        if (app.status === 'enabled') return { ...app, status: 'disabled' as MicroApp['status'] };
        if (app.status === 'disabled') return { ...app, status: 'enabled' as MicroApp['status'] };
        if (app.status === 'dev-only') return { ...app, status: 'enabled' as MicroApp['status'] }; // Example: promote from dev-only
         // Add more transitions as needed
      }
      return app;
    }));
  };

  return (
    <div className="flex flex-col h-full p-2 md:p-4 gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4">
        <h1 className="text-2xl md:text-3xl font-headline text-foreground">Micro-App Registry</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search micro-apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:min-w-[250px] bg-input border-input focus:ring-primary h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 hidden md:inline-flex"><FilterIcon className="mr-2 h-4 w-4" />Filters</Button>
          <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Register New App
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">Register New Micro-App</DialogTitle>
              </DialogHeader>
              {/* Simplified Placeholder Registration Form */}
              <div className="py-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  This is a placeholder for the micro-app registration form. 
                  It would include fields for Name, Slug, Description, Agents Used, etc.
                </p>
                <Button onClick={() => handleRegisterNewApp({ displayName: 'Test App', internalName: 'test-app' })}>Quick Register Test App</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Card className="flex-grow flex flex-col overflow-hidden">
        <CardHeader className="hidden">
          <CardTitle>All Micro-Apps</CardTitle>
          <CardDescription>Browse and manage all available micro-applications within NexOS.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[50px] text-center">Icon</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead className="hidden md:table-cell">Internal Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Tags</TableHead>
                  <TableHead className="hidden xl:table-cell">Agent Deps</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell className="text-center">
                      {/* Basic icon placeholder */}
                      <SlidersHorizontal className="h-5 w-5 text-primary/70 mx-auto" />
                    </TableCell>
                    <TableCell className="font-medium text-foreground py-2.5">
                        {app.displayName}
                        <div className="text-xs text-muted-foreground md:hidden">{app.internalName}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden md:table-cell">{app.internalName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(app.status)} className={cn("text-xs py-0.5 px-2 h-5 leading-tight", getStatusBadgeColorClass(app.status))}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden lg:table-cell">{app.category}</TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {app.tags.slice(0, 2).map(tag => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>)}
                            {app.tags.length > 2 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{app.tags.length - 2}</Badge>}
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden xl:table-cell">
                      {app.agentDependencies.length > 0 ? app.agentDependencies.join(', ') : 'None'}
                    </TableCell>
                    <TableCell className="text-right py-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">App Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions for {app.displayName}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditApp(app)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Rocket className="mr-2 h-4 w-4" /> Deploy to Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => toggleAppStatus(app.id)}>
                            {app.status === 'enabled' || app.status === 'beta' || app.status === 'dev-only' ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {app.status === 'enabled' || app.status === 'beta' || app.status === 'dev-only' ? 'Disable' : 'Enable'}
                          </DropdownMenuItem>
                          {app.status === 'dev-only' && (
                            <DropdownMenuItem className="text-yellow-600 focus:text-yellow-700">
                                <AlertTriangle className="mr-2 h-4 w-4"/> Promote to Beta
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredApps.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    <SlidersHorizontal className="mx-auto h-12 w-12 opacity-50 mb-2" />
                    <p>No micro-apps found matching your criteria.</p>
                </div>
             )}
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedApp && (
        <MicroAppDetailDrawer
          app={selectedApp}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onSave={handleSaveAppDetails}
          availableAgents={['OptimizerPrime', 'Aegis', 'Orion', 'Proxy', 'LogSentinel', 'BillingProxy']}
        />
      )}
    </div>
  );
}
