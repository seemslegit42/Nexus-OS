
// src/app/admin/micro-apps/page.tsx
'use client';

import { useState, type ReactNode, useMemo, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Search, Filter as FilterIcon, Edit, Copy, Rocket, EyeOff, Eye, MoreVertical, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import type { MicroApp } from '@/types/micro-app';
import { MicroAppDetailDrawer } from '@/components/admin/micro-apps/micro-app-detail-drawer';
import { cn } from '@/lib/utils';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import { Label } from '@/components/ui/label';

// Helper to get appropriate badge variant for status
const getStatusBadgeVariant = (status: MicroApp['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'enabled': return 'default';
    case 'disabled': return 'secondary';
    case 'dev-only': return 'outline';
    case 'archived': return 'destructive';
    case 'beta': return 'default';
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
  const allApps = useMicroAppRegistryStore(state => state.apps);
  const getMicroApp = useMicroAppRegistryStore(state => state.getMicroApp);
  const updateMicroApp = useMicroAppRegistryStore(state => state.updateMicroApp);
  const registerMicroApp = useMicroAppRegistryStore(state => state.registerMicroApp);
  const toggleAppStatus = useMicroAppRegistryStore(state => state.toggleAppStatus);
  const searchApps = useMicroAppRegistryStore(state => state.searchApps);
  // const getAppsByStatus = useMicroAppRegistryStore(state => state.getAppsByStatus); // Available if UI for status filter is added

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  // State for the new app registration form
  const [newAppName, setNewAppName] = useState('');
  const [newAppInternalName, setNewAppInternalName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');

  const selectedApp = useMemo(() => {
    if (!selectedAppId) return null;
    return getMicroApp(selectedAppId) || null;
  }, [selectedAppId, getMicroApp]);

  const displayedApps = useMemo(() => {
    return searchApps(searchTerm);
  }, [searchApps, searchTerm]);


  const handleEditApp = (appId: string) => {
    setSelectedAppId(appId);
    setIsDrawerOpen(true);
  };

  const handleSaveAppDetails = (updatedApp: MicroApp) => {
    updateMicroApp(updatedApp.id, updatedApp);
  };
  
  const handleRegisterNewAppSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newAppName.trim() || !newAppInternalName.trim()) {
        alert("Display Name and Internal Name are required."); // Simple validation
        return;
    }
    registerMicroApp({ 
      displayName: newAppName, 
      internalName: newAppInternalName,
      description: newAppDescription 
      // Other fields will use defaults defined in the store
    });
    setIsRegisterDialogOpen(false);
    setNewAppName('');
    setNewAppInternalName('');
    setNewAppDescription('');
  };

  // Dummy available agents for the drawer, in a real app this would come from an agent store/service
  const availableAgentsList = useMemo(() => {
    const allDeps = new Set<string>();
    allApps.forEach(app => app.agentDependencies?.forEach(dep => allDeps.add(dep)));
    return Array.from(allDeps).length > 0 ? Array.from(allDeps) : ['OptimizerPrime', 'Aegis', 'Orion', 'Proxy', 'LogSentinel', 'BillingProxy', 'None'];
  }, [allApps]);


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
                 <CardDescription>Fill in the details for your new micro-application.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleRegisterNewAppSubmit} className="py-4 space-y-3">
                <div>
                  <Label htmlFor="new-app-name">Display Name <span className="text-destructive">*</span></Label>
                  <Input id="new-app-name" value={newAppName} onChange={(e) => setNewAppName(e.target.value)} placeholder="e.g., Awesome Analytics" required className="mt-1 bg-input border-input focus:ring-primary"/>
                </div>
                <div>
                  <Label htmlFor="new-app-internal-name">Internal Name / Slug <span className="text-destructive">*</span></Label>
                  <Input id="new-app-internal-name" value={newAppInternalName} onChange={(e) => setNewAppInternalName(e.target.value)} placeholder="e.g., awesome-analytics" required className="mt-1 bg-input border-input focus:ring-primary"/>
                </div>
                <div>
                  <Label htmlFor="new-app-description">Description</Label>
                  <Input id="new-app-description" value={newAppDescription} onChange={(e) => setNewAppDescription(e.target.value)} placeholder="A brief description" className="mt-1 bg-input border-input focus:ring-primary"/>
                </div>
                 <DialogFooter className="pt-3">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Register App</Button>
                </DialogFooter>
              </form>
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
                {displayedApps.map((app) => (
                  <TableRow key={app.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell className="text-center">
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
                            {app.tags?.slice(0, 2).map(tag => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>)}
                            {(app.tags?.length || 0) > 2 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{ (app.tags?.length || 0) - 2}</Badge>}
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden xl:table-cell">
                      {(app.agentDependencies && app.agentDependencies.length > 0) ? app.agentDependencies.join(', ') : 'None'}
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
                          <DropdownMenuItem onClick={() => handleEditApp(app.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Duplicate action for ${app.displayName}`)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Deploy to Dashboard action for ${app.displayName}`)}>
                            <Rocket className="mr-2 h-4 w-4" /> Deploy to Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => toggleAppStatus(app.id)}>
                            {app.status === 'enabled' || app.status === 'beta' || app.status === 'dev-only' ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            Toggle Status
                          </DropdownMenuItem>
                          {app.status === 'dev-only' && (
                            <DropdownMenuItem className="text-yellow-600 focus:text-yellow-700" onClick={() => alert(`Promote to Beta action for ${app.displayName}`)}>
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
             {displayedApps.length === 0 && (
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
          availableAgents={availableAgentsList}
        />
      )}
    </div>
  );
}

