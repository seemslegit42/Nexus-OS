
// src/micro-apps/dashboard-widgets/workspace-launchpad-widget.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Cpu, Zap, LayoutGrid, Lock } from 'lucide-react';
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


export function WorkspaceLaunchpadWidget(): ReactNode {
  const actions: DashboardWidgetCardProps[] = [
    { href: "/onboarding", icon: <Cpu className="h-5 w-5 text-primary" />, title: "Spawn New Agent", description: "Configure and deploy an AI agent.", valueOrStatus: "Launch", isGated: false },
    { href: "/command", icon: <Zap className="h-5 w-5 text-primary" />, title: "Initiate Prompt Chain", description: "Open Command & Cauldron.", valueOrStatus: "Open", isGated: false },
    { href: "/loom-studio", icon: <LayoutGrid className="h-5 w-5 text-primary" />, title: "Open Loom Studio", description: "Visual workflow editor.", valueOrStatus: "Open", isGated: false },
  ];

  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardContent className="p-1 md:p-2 h-full"> {/* Ensure CardContent takes full height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 h-full"> {/* Ensure grid takes full height */}
          {actions.map((action) => (
            <DashboardWidgetCard key={action.title} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
    