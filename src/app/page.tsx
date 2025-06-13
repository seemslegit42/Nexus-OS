
// src/app/page.tsx (Dashboard / App Launcher)
'use client';
import Link from 'next/link';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import type { MicroApp } from '@/types/micro-app';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Crucial Fix: Import Badge
import { 
  LayoutGrid as LayoutGridIcon, 
  PackageSearch, 
  Settings as SettingsIcon, // Renamed to avoid conflict if Settings component exists
  ShieldCheck as ShieldCheckIcon, 
  Workflow as WorkflowIcon,
  Info as InfoIcon, // Renamed for clarity
  Rocket as RocketIcon,
  Activity as ActivityIcon,
  Cpu as CpuIcon,
  RadioTower as RadioTowerIcon,
  TerminalSquare as TerminalSquareIcon,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

// Define a type for Lucide icons to ensure consistency
type LucideIconType = React.ReactElement<React.SVGProps<SVGSVGElement>>;

// Map string icon names from MicroApp data to actual Lucide components
const iconMap: Record<string, LucideIconType> = {
  Package: <PackageSearch className="h-5 w-5" />, // Fallback/default
  Settings: <SettingsIcon className="h-5 w-5" />,
  ShieldCheck: <ShieldCheckIcon className="h-5 w-5" />,
  Workflow: <WorkflowIcon className="h-5 w-5" />,
  Info: <InfoIcon className="h-5 w-5" />,
  Rocket: <RocketIcon className="h-5 w-5" />,
  Activity: <ActivityIcon className="h-5 w-5" />,
  Cpu: <CpuIcon className="h-5 w-5" />,
  LayoutGrid: <LayoutGridIcon className="h-5 w-5" />,
  RadioTower: <RadioTowerIcon className="h-5 w-5" />,
  TerminalSquare: <TerminalSquareIcon className="h-5 w-5" />,
};

interface MicroAppCardProps {
  app: MicroApp;
}

function MicroAppCard({ app }: MicroAppCardProps) {
  const iconNode = app.icon && iconMap[app.icon] ? 
                   React.cloneElement(iconMap[app.icon], { className: "h-8 w-8 text-primary mb-2" }) :
                   React.cloneElement(iconMap['Package'], { className: "h-8 w-8 text-primary mb-2" }); // Default icon

  const isGated = app.requiresSubscription && !app.monetization?.enabled; // Example gating logic

  return (
    <Card className="flex flex-col hover:shadow-primary/25 transition-shadow duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {iconNode}
          {isGated && (
            <Badge variant="outline" className="text-xs border-yellow-500/60 text-yellow-600 dark:text-yellow-400">
              <CreditCard className="mr-1 h-3 w-3" /> Pro Feature
            </Badge>
          )}
        </div>
        <CardTitle className="font-headline text-lg line-clamp-1">{app.displayName}</CardTitle>
        <CardDescription className="text-xs line-clamp-2 h-8">{app.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs flex-grow">
        {app.tags && app.tags.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {app.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
              {app.tags.length > 3 && <Badge variant="secondary" className="text-[10px]">+{app.tags.length - 3} more</Badge>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-2 border-t border-border/50">
        <div className="flex justify-between items-center w-full">
          <Badge 
            variant={isGated ? "outline" : "default"} 
            className={cn(
              "text-xs capitalize",
              isGated && "text-yellow-600 border-yellow-500/60 dark:text-yellow-400"
            )}
          >
            {isGated ? 'Pro' : app.category || 'General'}
          </Badge>
          {isGated ? (
             <Link href="/plans" legacyBehavior>
                <Button asChild variant="link" size="sm" className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold hover:underline p-0 h-auto">
                    <a>Upgrade Plan <ExternalLink className="ml-1 h-3 w-3" /></a>
                </Button>
             </Link>
          ) : (
            <Link href={app.entryPoint || `/app/${app.internalName}`} legacyBehavior>
              <Button asChild variant="link" size="sm" className="text-xs text-primary font-semibold hover:underline p-0 h-auto">
                <a>Launch App <ExternalLink className="ml-1 h-3 w-3" /></a>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function AppLauncherPage() {
  const allApps = useMicroAppRegistryStore(state => state.apps);

  // Filter for apps that should be displayed on the dashboard
  const dashboardApps = allApps.filter(app => 
    app.status === 'enabled' &&
    app.isVisible === true &&
    !(app.flags?.systemInternal && (app.category === 'Security' || app.category === 'Core OS')) &&
    app.deployableTo.includes('dashboard')
  );
  
  return (
    <div className="flex flex-col h-full p-2 md:p-4 gap-4">
      <header>
        <h1 className="text-2xl md:text-3xl font-headline text-foreground">NexOS App Launcher</h1>
        <p className="text-muted-foreground text-sm">
          Access your installed and available micro-applications.
        </p>
      </header>

      {dashboardApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {dashboardApps.map(app => (
            <MicroAppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-card/50 backdrop-blur-sm">
            <PackageSearch className="h-16 w-16 text-primary/70 opacity-60 mb-4" />
            <h2 className="text-xl font-headline text-foreground mb-2">No Apps to Display</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              There are currently no micro-applications configured for the dashboard launcher.
              Ensure apps are enabled, set to visible, and deployable to 'dashboard'.
            </p>
            <Link href="/admin/micro-apps" legacyBehavior>
                <Button asChild variant="outline">
                    <a><SettingsIcon className="mr-2 h-4 w-4"/>Manage Micro-Apps</a>
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
}
