// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import type { MicroApp } from '@/types/micro-app';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  Cpu,
  Activity,
  Rocket,
  Settings,
  ShieldCheck,
  RadioTower,
  TerminalSquare,
  Workflow as WorkflowIcon,
  PackageSearch,
  AlertTriangle,
  Eye // Added Eye for fallback icon
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Define an icon map
const iconMap: Record<string, ReactNode> = {
  LayoutGrid: <LayoutGrid className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  Rocket: <Rocket className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5" />,
  RadioTower: <RadioTower className="h-5 w-5" />,
  TerminalSquare: <TerminalSquare className="h-5 w-5" />,
  Workflow: <WorkflowIcon className="h-5 w-5" />,
  Package: <PackageSearch className="h-5 w-5" />,
  PackageSearch: <PackageSearch className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />, // Fallback icon
};

// Sub-component for rendering each MicroApp Card
function MicroAppCard({ app }: { app: MicroApp }) {
  const IconComponent = app.icon && iconMap[app.icon] ? iconMap[app.icon] : iconMap['Eye']; // Fallback to Eye
  const isGated = app.requiresSubscription && (!app.monetization || !app.monetization.enabled); 

  return (
    <Card className="flex flex-col overflow-hidden h-full hover:shadow-primary/25 transition-shadow duration-300 ease-in-out border-primary/20 backdrop-blur-sm bg-card/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-primary p-2 bg-primary/10 rounded-lg">{IconComponent}</span>
          <CardTitle className="font-headline text-lg text-foreground line-clamp-2 leading-tight">
            {app.displayName}
          </CardTitle>
        </div>
        <CardDescription className="text-xs line-clamp-2 h-8 text-muted-foreground">
          {app.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-1 pb-2 space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          {app.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">{tag}</Badge>
          ))}
          {(app.tags?.length || 0) > 3 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">+{ (app.tags?.length || 0) - 3}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3 mt-auto border-t border-primary/15">
        <div className="flex justify-between items-center w-full">
          <Badge 
            variant={isGated ? "outline" : "default"}
            className={cn(
              "text-xs", 
              isGated ? "text-yellow-500 dark:text-yellow-400 border-yellow-500/60" : "bg-primary/20 text-primary"
            )}
          >
            {app.category}
          </Badge>
          {isGated ? (
             <Button variant="link" size="sm" className="text-xs p-0 h-auto text-yellow-500 hover:text-yellow-400 font-semibold">
                Upgrade Plan <AlertTriangle className="ml-1 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Link href={app.entryPoint || `/app/${app.internalName}`} passHref legacyBehavior>
              <Button asChild variant="link" size="sm" className="text-xs p-0 h-auto text-primary hover:text-accent font-semibold">
                <a>Launch App</a>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function AppLauncherPage() {
  // Fetch all apps and then filter for deployable and visible ones
  // This ensures getDeployableApps logic from the store is used correctly.
  const allApps = useMicroAppRegistryStore(state => state.apps);
  const getDeployableApps = useMicroAppRegistryStore(state => state.getDeployableApps);
  
  // getDeployableApps already filters by status, visibility, and systemInternal flags for dashboard suitability.
  const visibleApps = getDeployableApps();

  return (
    <div className="flex flex-col h-full p-2 md:p-4">
      <header className="mb-4 md:mb-6">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
          NexOS App Launcher
        </h1>
        <p className="text-md text-muted-foreground mt-1">
          Discover and launch available micro-applications and tools.
        </p>
      </header>
      {visibleApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {visibleApps.map(app => (
            <MicroAppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-card/50 backdrop-blur-sm">
          <PackageSearch className="h-16 w-16 text-primary/70 mb-4" />
          <h2 className="text-xl font-headline text-foreground mb-2">No Micro-Apps Available</h2>
          <p className="text-muted-foreground max-w-md">
            It seems there are no micro-applications currently configured for display on the launcher.
            Administrators can manage micro-app visibility in the admin panel.
          </p>
           <Link href="/admin/micro-apps" className="mt-6" legacyBehavior>
            <Button asChild variant="outline">
              <a>Go to Micro-App Registry</a>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
