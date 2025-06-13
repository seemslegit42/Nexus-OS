// src/app/page.tsx (Dashboard / App Launcher)
'use client';

import React from 'react'; // Added missing React import
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import type { MicroApp } from '@/types/micro-app';
import {
  Settings,
  Info,
  Rocket,
  Activity,
  Cpu,
  LayoutGrid,
  PackageSearch,
  Workflow as WorkflowIcon,
  ShieldCheck as ShieldCheckIcon,
  RadioTower as RadioTowerIcon,
  TerminalSquare as TerminalSquareIcon,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // For typing the iconMap values more precisely
import { cn } from '@/lib/utils';

// Define the icon map
// Using React.ReactElement for iconMap values
const iconMap: Record<string, React.ReactElement> = {
  Workflow: <WorkflowIcon className="h-6 w-6" />,
  ShieldCheck: <ShieldCheckIcon className="h-6 w-6" />,
  RadioTower: <RadioTowerIcon className="h-6 w-6" />,
  TerminalSquare: <TerminalSquareIcon className="h-6 w-6" />,
  Settings: <Settings className="h-6 w-6" />,
  Info: <Info className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
  Activity: <Activity className="h-6 w-6" />,
  Cpu: <Cpu className="h-6 w-6" />,
  LayoutGrid: <LayoutGrid className="h-6 w-6" />,
  Package: <PackageSearch className="h-6 w-6" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6" />,
};

interface MicroAppCardProps {
  app: MicroApp;
}

function MicroAppCard({ app }: MicroAppCardProps) {
  const iconNode = iconMap[app.icon] || iconMap['Package']; // Default to Package icon
  const isGated = app.requiresSubscription && app.monetization?.enabled;

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-primary/25 transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {React.cloneElement(iconNode, { className: cn("h-7 w-7", isGated ? "text-yellow-500" : "text-primary") })}
            <div>
              <CardTitle className="text-lg font-headline leading-tight">{app.displayName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Version: {app.version}
              </CardDescription>
            </div>
          </div>
          {app.flags?.isFeatured && (
            <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground border-accent/50">Featured</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex-grow">
        <p className="line-clamp-3">{app.description}</p>
        {app.tags && app.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {app.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary/90">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 mt-auto border-t border-border/50">
        <div className="flex justify-between items-center w-full">
          <Badge variant={isGated ? "outline" : "default"} className={cn("text-xs capitalize", isGated ? "text-yellow-600 dark:text-yellow-400 border-yellow-500/60" : "bg-primary/15 text-primary border-primary/30")}>
             {app.category}
          </Badge>
          {isGated ? (
            <Link href={app.monetization?.billingCycle === 'usage-based' ? '/billing' : `/plans?tier=${app.monetization?.pricingTierId || 'pro'}`} passHref legacyBehavior>
              <Button asChild variant="secondary" size="sm" className="text-xs bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-700 dark:text-yellow-300 border border-yellow-500/50">
                <a className="text-yellow-700 dark:text-yellow-300 font-semibold">Upgrade Plan</a>
              </Button>
            </Link>
          ) : (
            <Link href={app.entryPoint || `/app/${app.internalName}`} passHref legacyBehavior>
              <Button asChild variant="outline" size="sm" className="text-xs border-primary/50 hover:bg-primary/15 text-primary">
                <a className="text-primary font-semibold">Launch App</a>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function AppLauncherPage() {
  const { getDeployableApps } = useMicroAppRegistryStore();
  const deployableApps = getDeployableApps();

  return (
    <div className="flex flex-col h-full p-3 md:p-4 gap-4">
      <header className="mb-2">
        <h1 className="text-2xl md:text-3xl font-headline text-foreground">
          NexOS App Launcher
        </h1>
        <p className="text-muted-foreground text-sm">
          Access your installed and available micro-applications.
        </p>
      </header>

      {deployableApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {deployableApps.map((app) => (
            <MicroAppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <Card className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-card/50">
          <CardHeader>
            <PackageSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl font-headline">No Deployable Apps Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              There are currently no micro-apps configured for dashboard deployment.
              <br />
              Please check the <Link href="/admin/micro-apps" className="text-primary hover:underline">Micro-App Registry</Link> to enable or configure apps.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
