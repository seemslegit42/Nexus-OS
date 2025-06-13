
// src/app/page.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Activity, Cpu, LayoutGrid, Rocket, Package as PackageIconLucide, Lock, ShieldCheck, RadioTower, TerminalSquare } from 'lucide-react'; // Added ShieldCheck, RadioTower, TerminalSquare
import { useMicroAppRegistryStore } from '@/stores/micro-app-registry.store';
import type { MicroApp } from '@/types/micro-app';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"; // Added this import
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';


const iconMap: Record<string, ReactNode> = {
  Rocket: <Rocket className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  LayoutGrid: <LayoutGrid className="h-5 w-5" />,
  Package: <PackageIconLucide className="h-5 w-5" />,
  Workflow: <LayoutGrid className="h-5 w-5" />, // Assuming Workflow maps to LayoutGrid or similar
  ShieldCheck: <ShieldCheck className="h-5 w-5" />,
  RadioTower: <RadioTower className="h-5 w-5" />,
  TerminalSquare: <TerminalSquare className="h-5 w-5" />,
  // Add other icons as needed
};

interface MicroAppCardProps {
  app: MicroApp;
  userHasActiveSubscription: boolean; // Example, in a real app this would come from auth/user state
}

function MicroAppCard({ app, userHasActiveSubscription }: MicroAppCardProps) {
  const isGated = app.requiresSubscription && !userHasActiveSubscription;
  const effectiveHref = isGated ? "/plans" : (app.entryPoint || "#"); // Fallback to # if no entryPoint
  const iconNode = app.icon ? iconMap[app.icon] || <PackageIconLucide className="h-5 w-5 text-primary" /> : <PackageIconLucide className="h-5 w-5 text-primary" />;

  return (
    <Link href={effectiveHref} passHref className="block h-full">
      <Card className={cn(
        "bg-card hover:bg-muted/70 border-border/70 transition-all duration-150 ease-in-out hover:shadow-xl hover:border-primary/60 h-full flex flex-col cursor-pointer rounded-2xl shadow-[0_4px_30px_hsl(var(--primary)/0.12)]",
        isGated && "opacity-70 hover:opacity-80 border-yellow-500/60 bg-yellow-500/5 hover:bg-yellow-500/10"
      )}>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="flex items-center text-md font-headline text-foreground gap-2">
            {isGated ? <Lock className="h-5 w-5 text-yellow-500 flex-shrink-0" /> : <span className="text-primary flex-shrink-0">{iconNode}</span>}
            <span className="truncate">{app.displayName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow px-4 pb-3 flex flex-col">
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-grow">{app.description}</p>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
             <p className={cn("text-xs font-semibold", isGated ? "text-yellow-600 dark:text-yellow-400" : "text-primary")}>
                {isGated ? "Upgrade Plan" : "Launch App"}
            </p>
            <Badge variant={app.status === 'beta' ? 'default' : 'outline'} className={cn("text-[10px]", app.status === 'beta' && "bg-blue-500/80 text-white")}>{app.category}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function HomePage() {
  const deployableApps = useMicroAppRegistryStore(state => state.getDeployableApps());
  const userHasActiveSubscription = true; // Placeholder for actual subscription status

  return (
    <div className="flex flex-col h-full p-2 md:p-4 gap-4">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-headline text-foreground">NexOS Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Launch your micro-applications and manage your workspace.</p>
      </header>

      {deployableApps.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <LayoutGrid className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Micro-Apps Available</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            It looks like there are no micro-applications currently configured for your dashboard.
            An administrator can enable or register new micro-apps in the Admin Micro-App Registry.
          </p>
          <Link href="/admin/micro-apps" passHref>
            <Button variant="outline">Go to Admin Registry</Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="flex-grow min-h-0"> {/* Ensure ScrollArea is within a flex container that allows shrinking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 p-0.5">
            {deployableApps.map((app) => (
              <MicroAppCard key={app.id} app={app} userHasActiveSubscription={userHasActiveSubscription} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
    
