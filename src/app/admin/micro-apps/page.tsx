// src/app/admin/micro-apps/page.tsx
'use client';

import { useState, type ReactNode, useMemo, FormEvent, useEffect } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  PlusCircle,
  MagnifyingGlass as Search,
  FunnelSimple as Filter,
  PencilSimple as Edit,
  Copy,
  Rocket,
  EyeSlash as EyeOff,
  Eye,
  DotsThreeVertical as MoreVertical,
  Sliders as SlidersHorizontal,
  Warning as AlertTriangle,
  Gear as Settings,
  CaretUpDown as ChevronsUpDown,
  CaretDown as ChevronDown,
  MagnifyingGlass as PackageSearch,
  Package,
} from '@phosphor-icons/react';
import type { MicroApp } from '@/types/micro-app';
import { MicroAppDetailDrawer } from '@/components/admin/micro-apps/micro-app-detail-drawer';
import { cn } from '@/lib/utils';
import {
  useMicroAppRegistryStore,
  type MicroAppStatus,
} from '@/stores/micro-app-registry.store';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Helper to get appropriate badge variant for status
const getStatusBadgeVariant = (
  status: MicroApp['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'enabled':
      return 'default';
    case 'disabled':
      return 'secondary';
    case 'dev-only':
      return 'outline';
    case 'archived':
      return 'destructive';
    case 'beta':
      return 'default';
    default:
      return 'outline';
  }
};
const getStatusBadgeColorClass = (status: MicroApp['status']): string => {
  switch (status) {
    case 'enabled':
      return 'bg-green-500/80 text-white dark:bg-green-600/80';
    case 'disabled':
      return 'bg-gray-400/80 text-gray-800 dark:bg-gray-600/80 dark:text-gray-200';
    case 'dev-only':
      return 'border-yellow-500/80 text-yellow-600 dark:border-yellow-500/60 dark:text-yellow-400';
    case 'archived':
      return 'bg-red-700/80 text-white dark:bg-red-800/80';
    case 'beta':
      return 'bg-blue-500/80 text-white dark:bg-blue-600/80';
    default:
      return 'border-border';
  }
};

const ALL_STATUSES: MicroAppStatus[] = [
  'enabled',
  'disabled',
  'dev-only',
  'archived',
  'beta',
];
const ALL_FLAGS = [
  { id: 'isFeatured', label: 'Featured' },
  { id: 'requiresBetaFeature', label: 'Requires OS Beta' },
  { id: 'systemInternal', label: 'System Internal' },
  { id: 'isDevOnly', label: 'Dev Build Only' },
  { id: 'monetized', label: 'Monetized' },
];

export default function MicroAppRegistryPage() {
  const allApps = useMicroAppRegistryStore(state => state.apps);
  const getMicroApp = useMicroAppRegistryStore(state => state.getMicroApp);
  const updateMicroApp = useMicroAppRegistryStore(
    state => state.updateMicroApp
  );
  const registerMicroApp = useMicroAppRegistryStore(
    state => state.registerMicroApp
  );
  const toggleAppStatus = useMicroAppRegistryStore(
    state => state.toggleAppStatus
  );
  const searchApps = useMicroAppRegistryStore(state => state.searchApps);
  const bulkUpdateStatus = useMicroAppRegistryStore(
    state => state.bulkUpdateStatus
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  const [newAppName, setNewAppName] = useState('');
  const [newAppInternalName, setNewAppInternalName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [newAppIsVisible, setNewAppIsVisible] = useState(true);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [tempStatusFilters, setTempStatusFilters] = useState<MicroAppStatus[]>(
    []
  );
  const [tempFlagFilters, setTempFlagFilters] = useState<string[]>([]);
  const [tempAgentFilter, setTempAgentFilter] = useState<string | null>(null);

  const [appliedStatusFilters, setAppliedStatusFilters] = useState<
    MicroAppStatus[]
  >([]);
  const [appliedFlagFilters, setAppliedFlagFilters] = useState<string[]>([]);
  const [appliedAgentFilter, setAppliedAgentFilter] = useState<string | null>(
    null
  );

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [appsToDeploySelectedIds, setAppsToDeploySelectedIds] = useState<
    string[]
  >([]);

  const selectedAppForDetailView = useMemo(() => {
    if (!selectedAppId) return null;
    return getMicroApp(selectedAppId) || null;
  }, [selectedAppId, getMicroApp]);

  const uniqueAgentNames = useMemo(() => {
    const agentSet = new Set<string>();
    allApps.forEach(app =>
      app.agentDependencies?.forEach(dep => agentSet.add(dep))
    );
    return Array.from(agentSet).sort();
  }, [allApps]);

  const displayedApps = useMemo(() => {
    let apps = searchApps(searchTerm);
    if (appliedStatusFilters.length > 0) {
      apps = apps.filter(app => appliedStatusFilters.includes(app.status));
    }
    if (appliedFlagFilters.length > 0) {
      apps = apps.filter(app =>
        appliedFlagFilters.every(flag => {
          if (flag === 'monetized') return app.monetization?.enabled === true;
          return app.flags?.[flag as keyof MicroApp['flags']] === true;
        })
      );
    }
    if (appliedAgentFilter && appliedAgentFilter !== 'all') {
      apps = apps.filter(app =>
        app.agentDependencies?.includes(appliedAgentFilter)
      );
    }
    return apps;
  }, [
    searchApps,
    searchTerm,
    appliedStatusFilters,
    appliedFlagFilters,
    appliedAgentFilter,
  ]);

  const appsEligibleForDeployment = useMemo(() => {
    return allApps.filter(
      app =>
        app.status === 'enabled' &&
        !app.isVisible &&
        app.deployableTo.includes('dashboard')
    );
  }, [allApps]);

  const handleEditApp = (appId: string) => {
    setSelectedAppId(appId);
    setIsDetailDrawerOpen(true);
  };

  const handleSaveAppDetails = (updatedApp: MicroApp) => {
    updateMicroApp(updatedApp.id, updatedApp);
  };

  const handleRegisterNewAppSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newAppName.trim() || !newAppInternalName.trim()) {
      alert('Display Name and Internal Name are required.');
      return;
    }
    registerMicroApp({
      displayName: newAppName,
      internalName: newAppInternalName,
      description: newAppDescription,
      isVisible: newAppIsVisible,
    });
    setIsRegisterDialogOpen(false);
    setNewAppName('');
    setNewAppInternalName('');
    setNewAppDescription('');
    setNewAppIsVisible(true);
  };

  const handleSelectApp = (
    appId: string,
    checked: boolean | 'indeterminate'
  ) => {
    if (checked === true) {
      setSelectedAppIds(prev => [...prev, appId]);
    } else {
      setSelectedAppIds(prev => prev.filter(id => id !== appId));
    }
  };

  const handleSelectAllApps = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedAppIds(displayedApps.map(app => app.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  const handleBulkStatusChange = (newStatus: MicroAppStatus) => {
    if (selectedAppIds.length > 0) {
      bulkUpdateStatus(selectedAppIds, newStatus);
      setSelectedAppIds([]);
    }
  };

  const handleApplyFilters = () => {
    setAppliedStatusFilters([...tempStatusFilters]);
    setAppliedFlagFilters([...tempFlagFilters]);
    setAppliedAgentFilter(tempAgentFilter);
    setIsFilterDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setTempStatusFilters([]);
    setTempFlagFilters([]);
    setTempAgentFilter(null);
    setAppliedStatusFilters([]);
    setAppliedFlagFilters([]);
    setAppliedAgentFilter(null);
    setIsFilterDrawerOpen(false);
  };

  const toggleStatusFilter = (status: MicroAppStatus) => {
    setTempStatusFilters(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleFlagFilter = (flagId: string) => {
    setTempFlagFilters(prev =>
      prev.includes(flagId) ? prev.filter(f => f !== flagId) : [...prev, flagId]
    );
  };

  const handleSelectAppForDeployment = (appId: string, checked: boolean) => {
    setAppsToDeploySelectedIds(prev =>
      checked ? [...prev, appId] : prev.filter(id => id !== appId)
    );
  };

  const handleDeploySelectedApps = () => {
    appsToDeploySelectedIds.forEach(appId => {
      updateMicroApp(appId, { isVisible: true });
    });
    setAppsToDeploySelectedIds([]);
    setIsDeployModalOpen(false);
  };

  const availableAgentsList = useMemo(() => {
    const allDeps = new Set<string>();
    allApps.forEach(app =>
      app.agentDependencies?.forEach(dep => allDeps.add(dep))
    );
    return Array.from(allDeps).length > 0
      ? Array.from(allDeps)
      : [
          'OptimizerPrime',
          'Aegis',
          'Orion',
          'Proxy',
          'LogSentinel',
          'BillingProxy',
          'None',
        ];
  }, [allApps]);

  return (
    <div className="flex h-full flex-col gap-4 p-2 md:p-4">
      <header className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center md:gap-4">
        <h1 className="font-headline text-2xl text-foreground md:text-3xl">
          Micro-App Registry
        </h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search micro-apps..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 w-full pl-9 sm:min-w-[250px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex h-9 items-center"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters (
              {appliedStatusFilters.length +
                appliedFlagFilters.length +
                (appliedAgentFilter ? 1 : 0)}
              )
            </Button>
            {selectedAppIds.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden h-9 md:inline-flex"
                  >
                    Bulk Actions ({selectedAppIds.length}){' '}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {ALL_STATUSES.map(status => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleBulkStatusChange(status)}
                      >
                        Set to{' '}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Dialog
              open={isDeployModalOpen}
              onOpenChange={setIsDeployModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 bg-accent text-accent-foreground hover:bg-accent/90"
                  size="sm"
                >
                  <Rocket className="mr-2 h-4 w-4" /> Deploy to Dashboard
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    Deploy Apps to Dashboard
                  </DialogTitle>
                  <DialogDescription>
                    Select enabled apps to make them visible on the dashboard.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mx-2 my-4 max-h-[60vh] px-2">
                  <div className="space-y-2 p-1">
                    {appsEligibleForDeployment.length > 0 ? (
                      appsEligibleForDeployment.map(app => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between rounded-xl border border-primary/25 bg-card p-3 shadow-[0_4px_30px_hsl(var(--primary)/0.08)] backdrop-blur-md transition-all hover:border-primary/40"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`deploy-${app.id}`}
                              checked={appsToDeploySelectedIds.includes(app.id)}
                              onCheckedChange={checked =>
                                handleSelectAppForDeployment(app.id, !!checked)
                              }
                            />
                            <div>
                              <Label
                                htmlFor={`deploy-${app.id}`}
                                className="cursor-pointer text-sm font-medium text-foreground"
                              >
                                {app.displayName}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {app.internalName}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-primary/30 text-xs text-primary/90"
                          >
                            {app.category}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        <Package className="mx-auto mb-2 h-10 w-10 opacity-50" />
                        No apps currently eligible for dashboard deployment.
                        <p className="text-xs">
                          (Ensure app status is 'enabled', it's not yet visible,
                          and is deployable to 'dashboard'.)
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <DialogFooter className="pt-3">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={handleDeploySelectedApps}
                    disabled={appsToDeploySelectedIds.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Deploy Selected ({appsToDeploySelectedIds.length})
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isRegisterDialogOpen}
              onOpenChange={setIsRegisterDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Register New App
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    Register New Micro-App
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new micro-application.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleRegisterNewAppSubmit}
                  className="space-y-3 py-4"
                >
                  <div>
                    <Label htmlFor="new-app-name">
                      Display Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="new-app-name"
                      value={newAppName}
                      onChange={e => setNewAppName(e.target.value)}
                      placeholder="e.g., Awesome Analytics"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-app-internal-name">
                      Internal Name / Slug{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="new-app-internal-name"
                      value={newAppInternalName}
                      onChange={e => setNewAppInternalName(e.target.value)}
                      placeholder="e.g., awesome-analytics"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-app-description">Description</Label>
                    <Input
                      id="new-app-description"
                      value={newAppDescription}
                      onChange={e => setNewAppDescription(e.target.value)}
                      placeholder="A brief description"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-app-is-visible" className="text-sm">
                      Visible on Dashboard/Launchpad
                    </Label>
                    <Switch
                      id="new-app-is-visible"
                      checked={newAppIsVisible}
                      onCheckedChange={setNewAppIsVisible}
                    />
                  </div>
                  <DialogFooter className="pt-3">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Register App
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <Card className="hidden flex-grow flex-col overflow-hidden md:flex">
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[60px] text-center">
                    <Checkbox
                      checked={
                        selectedAppIds.length === displayedApps.length &&
                        displayedApps.length > 0 &&
                        selectedAppIds.length > 0
                      }
                      onCheckedChange={handleSelectAllApps}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead className="w-[50px] text-center">Icon</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Internal Name
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Visible
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Tags</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Agent Deps
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedApps.map(app => (
                  <TableRow
                    key={app.id}
                    className="border-border/60 hover:bg-muted/30"
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedAppIds.includes(app.id)}
                        onCheckedChange={checked =>
                          handleSelectApp(app.id, checked)
                        }
                        aria-label={`Select row ${app.displayName}`}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Settings className="mx-auto h-5 w-5 text-primary/70" />
                    </TableCell>
                    <TableCell className="py-2.5 font-medium text-foreground">
                      {app.displayName}
                      <div className="text-xs text-muted-foreground md:hidden">
                        {app.internalName}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {app.internalName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(app.status)}
                        className={cn(
                          'h-5 px-2 py-0.5 text-xs leading-tight',
                          getStatusBadgeColorClass(app.status)
                        )}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {app.isVisible ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                      {app.category}
                    </TableCell>
                    <TableCell className="hidden text-xs lg:table-cell">
                      <div className="flex max-w-[200px] flex-wrap gap-1">
                        {app.tags?.slice(0, 2).map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(app.tags?.length || 0) > 2 && (
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            +{(app.tags?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground xl:table-cell">
                      {app.agentDependencies && app.agentDependencies.length > 0
                        ? app.agentDependencies.join(', ')
                        : 'None'}
                    </TableCell>
                    <TableCell className="py-1.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">App Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Actions for {app.displayName}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEditApp(app.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              alert(`Duplicate action for ${app.displayName}`)
                            }
                          >
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              alert(
                                `Deploy to Dashboard action for ${app.displayName}`
                              )
                            }
                            disabled={
                              !app.isVisible || app.status !== 'enabled'
                            }
                          >
                            <Rocket className="mr-2 h-4 w-4" /> Deploy to
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => toggleAppStatus(app.id)}
                          >
                            {app.status === 'enabled' ||
                            app.status === 'beta' ||
                            app.status === 'dev-only' ? (
                              <EyeOff className="mr-2 h-4 w-4" />
                            ) : (
                              <Eye className="mr-2 h-4 w-4" />
                            )}
                            Toggle Status Cycle
                          </DropdownMenuItem>
                          {app.status === 'dev-only' && (
                            <DropdownMenuItem
                              className="text-yellow-600 focus:text-yellow-700"
                              onClick={() =>
                                alert(
                                  `Promote to Beta action for ${app.displayName}`
                                )
                              }
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" /> Promote
                              to Beta
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
              <div className="p-8 text-center text-muted-foreground">
                <SlidersHorizontal className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No micro-apps found matching your criteria.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex-grow md:hidden">
        {displayedApps.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <PackageSearch className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No micro-apps found matching your criteria.</p>
            {(appliedStatusFilters.length > 0 ||
              appliedFlagFilters.length > 0 ||
              appliedAgentFilter) && (
              <Button
                variant="link"
                onClick={handleClearFilters}
                className="mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <Accordion type="multiple" className="w-full space-y-2">
              {displayedApps.map(app => (
                <AccordionItem
                  value={app.id}
                  key={app.id}
                  className="rounded-2xl border border-primary/25 bg-card shadow-[0_4px_30px_hsl(var(--primary)/0.12)]"
                >
                  <AccordionTrigger className="p-3 hover:no-underline">
                    <div className="flex w-full items-center gap-3">
                      <Settings className="h-5 w-5 flex-shrink-0 text-primary/70" />
                      <div className="flex-grow text-left">
                        <h3 className="text-sm font-medium text-foreground">
                          {app.displayName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {app.internalName}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusBadgeVariant(app.status)}
                        className={cn(
                          'h-5 flex-shrink-0 px-2 py-0.5 text-xs leading-tight',
                          getStatusBadgeColorClass(app.status)
                        )}
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-primary/20">
                    <div className="space-y-2 p-3">
                      <p className="text-xs text-muted-foreground">
                        {app.description}
                      </p>
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          Category:{' '}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          Tags:{' '}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.tags?.join(', ') || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          Visible:{' '}
                        </span>
                        {app.isVisible ? (
                          <Eye className="inline h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <EyeOff className="inline h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          Agent Deps:{' '}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.agentDependencies &&
                          app.agentDependencies.length > 0
                            ? app.agentDependencies.join(', ')
                            : 'None'}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditApp(app.id)}
                          className="text-xs"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAppStatus(app.id)}
                          className="text-xs"
                        >
                          {app.status === 'enabled' ||
                          app.status === 'beta' ||
                          app.status === 'dev-only' ? (
                            <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                          ) : (
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Toggle Status
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
      </div>

      <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <SheetContent side="bottom" className="flex h-[80vh] flex-col p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>Filter Micro-Apps</SheetTitle>
            <SheetDescription>
              Select criteria to refine the list of micro-apps.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-status-${status}`}
                        checked={tempStatusFilters.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                      />
                      <Label
                        htmlFor={`filter-status-${status}`}
                        className="text-xs capitalize"
                      >
                        {status.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Flags</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_FLAGS.map(flag => (
                    <div key={flag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-flag-${flag.id}`}
                        checked={tempFlagFilters.includes(flag.id)}
                        onCheckedChange={() => toggleFlagFilter(flag.id)}
                      />
                      <Label
                        htmlFor={`filter-flag-${flag.id}`}
                        className="text-xs"
                      >
                        {flag.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Agent Dependency</h4>
                <Select
                  value={tempAgentFilter || 'all'}
                  onValueChange={value =>
                    setTempAgentFilter(value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Any Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Agent</SelectItem>
                    {uniqueAgentNames.map(agentName => (
                      <SelectItem
                        key={agentName}
                        value={agentName}
                        className="text-xs"
                      >
                        {agentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <SheetFooter className="flex-col gap-2 border-t p-4 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
            >
              Clear Filters
            </Button>
            <div className="flex w-full gap-2 sm:w-auto">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-auto"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 sm:flex-auto"
              >
                Apply Filters
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {selectedAppForDetailView && (
        <MicroAppDetailDrawer
          app={selectedAppForDetailView}
          isOpen={isDetailDrawerOpen}
          onOpenChange={setIsDetailDrawerOpen}
          onSave={handleSaveAppDetails}
          availableAgents={availableAgentsList}
        />
      )}
    </div>
  );
}
