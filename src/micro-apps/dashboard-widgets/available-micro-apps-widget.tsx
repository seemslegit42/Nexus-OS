
// src/micro-apps/dashboard-widgets/available-micro-apps-widget.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Package as PackageIcon, Lock } from 'lucide-react'; // Renamed to avoid conflict
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import { cn } from '@/lib/utils';

interface DashboardWidgetCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  valueOrStatus: string;
  valueColorClass?: string;
  href: string;
  isGated?: boolean;
}

function DashboardWidgetCard({ title, icon, description, valueOrStatus, valueColorClass, href, isGated }: DashboardWidgetCardProps) {
  const effectiveHref = isGated ? "/plans" : href;
  const effectiveTitle = isGated ? `${title} (Upgrade Required)` : title;
  const effectiveValueOrStatus = isGated ? "Upgrade Plan" : valueOrStatus;
  const effectiveIcon = isGated ? <Lock className="h-4 w-4 text-yellow-500" /> : icon;

  return (
    <Link href={effectiveHref} passHref className="block h-full">
      <Card className={cn("bg-card hover:bg-muted/70 border-border/70 transition-all duration-150 ease-in-out hover:shadow-lg hover:border-primary/50 h-full flex flex-col cursor-pointer", isGated && "opacity-70 hover:opacity-80 border-yellow-500/50")}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="flex items-center text-sm font-headline text-foreground gap-2">
            {effectiveIcon}
            {effectiveTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow px-3 pb-3">
          <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{description}</p>
          <p className={cn("text-sm font-semibold", isGated ? "text-yellow-600 dark:text-yellow-400" : valueColorClass)}>{effectiveValueOrStatus}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function AvailableMicroAppsWidget(): ReactNode {
  const deployableApps = useMicroAppRegistryStore(state => state.getDeployableApps().filter(app => app.category !== 'Dashboard Widget')); // Exclude dashboard widgets themselves
  const userHasActiveSubscription = true; 

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2 h-full"> {/* Ensure CardContent takes full height */}
        {deployableApps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="p-4">
              <Rocket className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No deployable micro-apps available yet.</p>
              <p className="text-xs text-muted-foreground">Enable some in the Admin Micro-App Registry.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 h-full"> {/* Ensure grid takes full height */}
            {deployableApps.map(app => {
              const isGated = app.requiresSubscription && !userHasActiveSubscription;
              return (
                <DashboardWidgetCard
                  key={app.id}
                  title={app.displayName}
                  icon={<PackageIcon className="h-4 w-4 text-primary" />} 
                  description={app.description}
                  valueOrStatus={app.category || "Launch App"}
                  valueColorClass={isGated ? undefined : "text-primary"}
                  href={app.entryPoint || `/`} 
                  isGated={isGated}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
    