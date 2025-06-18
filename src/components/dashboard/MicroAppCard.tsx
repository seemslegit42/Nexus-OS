// src/components/dashboard/MicroAppCard.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Gear as Settings } from '@phosphor-icons/react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const statusStyling = getStatusBadgeStyling(status);

  const getStatusGradient = () => {
    switch (status) {
      case 'enabled':
        return 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 hover:from-emerald-500/25 hover:to-green-500/15';
      case 'beta':
        return 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 hover:from-blue-500/25 hover:to-cyan-500/15';
      case 'dev-only':
        return 'from-yellow-500/20 to-orange-500/10 border-yellow-500/30 hover:from-yellow-500/25 hover:to-orange-500/15';
      case 'disabled':
        return 'from-gray-500/20 to-slate-500/10 border-gray-500/30 hover:from-gray-500/25 hover:to-slate-500/15';
      case 'archived':
        return 'from-red-500/20 to-pink-500/10 border-red-500/30 hover:from-red-500/25 hover:to-pink-500/15';
      default:
        return 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 hover:from-purple-500/25 hover:to-indigo-500/15';
    }
  };

  if (displayMode === 'compact') {
    return (
      <Card 
        className={cn(
          "group cursor-pointer transition-all duration-500 relative overflow-hidden border-2",
          "bg-gradient-to-br backdrop-blur-md hover:shadow-xl",
          getStatusGradient(),
          isHovered && "scale-105 shadow-2xl",
          isPressed && "scale-95",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={() => onLaunch(id)}
      >
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute w-1 h-1 bg-white/30 rounded-full transition-all duration-[2s]",
            isHovered ? "translate-x-6 -translate-y-6 opacity-100" : "translate-x-0 translate-y-0 opacity-0"
          )} style={{ top: '20%', left: '20%' }} />
          <div className={cn(
            "absolute w-0.5 h-0.5 bg-white/40 rounded-full transition-all duration-[3s] delay-300",
            isHovered ? "translate-x-8 -translate-y-8 opacity-100" : "translate-x-0 translate-y-0 opacity-0"
          )} style={{ top: '70%', right: '30%' }} />
        </div>

        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )} />

        <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full relative z-10">
          <div className={cn(
            "mb-2 transition-all duration-300 group-hover:scale-110",
            "p-2 rounded-lg bg-white/10 backdrop-blur-sm"
          )}>
            {icon}
          </div>
          <CardTitle className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {name}
          </CardTitle>
          {status && (
            <Badge 
              variant={statusStyling.variant} 
              className={cn(
                "mt-1.5 text-[9px] px-1.5 py-0.5", 
                statusStyling.className,
                "backdrop-blur-sm border-0"
              )}
            >
              {status}
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "group transition-all duration-500 relative overflow-hidden border-2",
        "bg-gradient-to-br backdrop-blur-md hover:shadow-xl",
        getStatusGradient(),
        isHovered && "scale-[1.02] shadow-2xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100"
      )} />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </CardTitle>
              {metricPreview && (
                <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                  {metricPreview}
                </p>
              )}
            </div>
          </div>
          {status && (
            <Badge 
              variant={statusStyling.variant} 
              className={cn("text-xs", statusStyling.className, "backdrop-blur-sm")}
            >
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4 relative z-10">
        <CardDescription className="text-xs text-muted-foreground mb-3 leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
          {description}
        </CardDescription>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-[9px] px-1.5 py-0.5 bg-white/10 border-white/20 text-white/80 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between relative z-10">
        <Button 
          size="sm" 
          onClick={() => onLaunch(id)}
          className={cn(
            "flex-1 mr-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80",
            "text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
            "backdrop-blur-sm"
          )}
        >
          <Rocket className="h-3 w-3 mr-1" />
          Launch
        </Button>
        {onConfigure && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onConfigure(id)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
          >
            <Settings className="h-3 w-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

  if (displayMode === 'compact') {
    const displayIconNode = icon ? 
                            React.cloneElement(icon as React.ReactElement, { className: "h-7 w-7 text-primary group-hover:text-accent transition-colors duration-150" }) : 
                            <Rocket className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-150" />;
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center text-center p-2 gap-1.5", 
          "bg-transparent", 
          "border-2 border-primary/40 hover:border-primary/70", 
          "rounded-2xl shadow-[0_0_15px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]", 
          "transition-all duration-200 ease-in-out cursor-pointer group",
          "min-h-[90px] sm:min-h-[100px]", 
          className
        )}
        onClick={() => onLaunch(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLaunch(id); }}
        title={`Launch ${name}`}
      >
        {displayIconNode}
        <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors duration-150 line-clamp-2 leading-tight">
          {name}
        </span>
      </Card>
    );
  }

  // Full display mode
  const statusStyling = getStatusBadgeStyling(status);

  return (
    <Card
        className={cn(
            // Base Card component now provides the glassy style:
            // rounded-2xl, border-[var(--glass-border)], bg-[var(--glass-bg)], 
            // backdrop-blur-[var(--blur)], text-card-foreground, shadow-[var(--shadow-soft)]
            "flex flex-col h-full p-3.5 group transition-all duration-200 ease-in-out hover:shadow-primary/20 hover:border-primary/50",
            className
        )}
    >
      <CardHeader className="p-0 mb-2 relative">
        <div className="flex items-start justify-between"> 
            <div className="flex items-center gap-2 flex-grow min-w-0 pr-8"> 
                {icon ? (
                    React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary group-hover:text-accent transition-colors flex-shrink-0" })
                ) : (
                    <Rocket className="h-5 w-5 text-primary group-hover:text-accent transition-colors flex-shrink-0" />
                )}
                <CardTitle className="text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate" title={name}>
                    {name}
                </CardTitle>
            </div>
            {status && (
              <Badge variant={statusStyling.variant} className={cn("text-[9px] h-5 px-1.5 absolute top-0 right-0", statusStyling.className)}>
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
