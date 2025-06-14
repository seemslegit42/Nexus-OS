// src/components/dashboard/MicroAppCard.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Settings } from 'lucide-react'; // Added Rocket for compact default
import { cn } from '@/lib/utils';
import type { MicroAppStatus } from '@/stores/micro-app-registry.store';

interface MicroAppCardProps {
  id: string;
  name: string;
  description: string;
  onLaunch: (id: string) => void;
  onConfigure?: (id: string) => void;
  tags?: string[];
  metricPreview?: string;
  icon?: React.ReactNode;
  status?: MicroAppStatus;
  className?: string;
  displayMode?: 'full' | 'compact';
}

// Helper to get appropriate badge variant for status (used in 'full' mode)
const getStatusBadgeStyling = (status?: MicroAppStatus): { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string } => {
  switch (status) {
    case 'enabled': return { variant: 'default', className: 'bg-green-500/80 text-white dark:bg-green-600/80' };
    case 'disabled': return { variant: 'secondary', className: 'bg-gray-400/80 text-gray-800 dark:bg-gray-600/80 dark:text-gray-200' };
    case 'dev-only': return { variant: 'outline', className: 'border-yellow-500/80 text-yellow-600 dark:border-yellow-500/60 dark:text-yellow-400' };
    case 'archived': return { variant: 'destructive', className: 'bg-red-700/80 text-white dark:bg-red-800/80' };
    case 'beta': return { variant: 'default', className: 'bg-blue-500/80 text-white dark:bg-blue-600/80' };
    default: return { variant: 'outline', className: 'border-border text-muted-foreground' };
  }
};

export const MicroAppCard: React.FC<MicroAppCardProps> = ({
  id,
  name,
  description,
  onLaunch,
  onConfigure,
  tags,
  metricPreview,
  icon,
  status,
  className,
  displayMode = 'full',
}) => {

  if (displayMode === 'compact') {
    // Determine the icon to display: passed icon or default Rocket for compact mode
    const displayIconNode = icon ? 
                            React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary group-hover:text-accent transition-colors" }) : 
                            <Rocket className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />;
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center text-center p-2 gap-1",
          "bg-transparent", // Transparent background as per image
          "border-2 border-primary/40 hover:border-primary/70", // Glowy border effect
          "rounded-xl shadow-[0_0_15px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]", // Glowy shadow
          "transition-all duration-200 ease-in-out cursor-pointer group",
          "min-h-[80px]", // Minimum height to ensure cards are not too small
          className
        )}
        onClick={() => onLaunch(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLaunch(id); }}
        title={`Launch ${name}`} // Tooltip for accessibility
      >
        {displayIconNode}
        <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">
          Launch
        </span>
      </Card>
    );
  }

  // Full display mode logic
  const statusStyling = getStatusBadgeStyling(status);

  return (
    <Card
        className={cn(
            "flex flex-col h-full bg-[rgba(16,42,32,0.65)] border border-[rgba(142,255,215,0.25)] text-[rgba(220,255,240,0.9)] rounded-xl p-3.5 shadow-lg hover:shadow-primary/20 transition-all duration-200 ease-in-out hover:border-primary/50 group",
            className
        )}
    >
      <CardHeader className="p-0 mb-2 relative">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {icon ? (
                    React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary group-hover:text-accent transition-colors" })
                ) : (
                    <Rocket className="h-5 w-5 text-primary group-hover:text-accent transition-colors" /> // Default for full mode if no icon
                )}
                <CardTitle className="text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate" title={name}>
                    {name}
                </CardTitle>
            </div>
            {status && (
              <Badge variant={statusStyling.variant} className={cn("text-[9px] h-5 px-1.5 absolute top-0 right-0 transform translate-x-1 -translate-y-1", statusStyling.className)}>
                {status}
              </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <CardDescription className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed" title={description}>
          {description}
        </CardDescription>
        {metricPreview && (
          <p className="text-xs text-primary font-medium mb-2">{metricPreview}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] bg-primary/10 text-primary/90 border-primary/20">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
                <Badge variant="secondary" className="text-[10px] bg-muted/50 text-muted-foreground border-border/50">
                    +{tags.length - 3}
                </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-2 p-0 flex gap-2">
        <Button
          onClick={() => onLaunch(id)}
          className="flex-1 h-8 text-xs bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 hover:border-primary/50 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all"
          aria-label={`Launch ${name}`}
        >
          <Rocket className="mr-1.5 h-3.5 w-3.5" />
          Launch
        </Button>
        {onConfigure && (
          <Button
            onClick={() => onConfigure(id)}
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-card/50 border-border/50 hover:bg-muted/70 text-muted-foreground hover:text-foreground"
            aria-label={`Configure ${name}`}
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Configure
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MicroAppCard;
