// src/components/dashboard/MicroAppCard.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicroAppCardProps {
  id: string;
  name: string;
  description: string;
  onLaunch: (id: string) => void;
  tags?: string[];
  metricPreview?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MicroAppCard: React.FC<MicroAppCardProps> = ({
  id,
  name,
  description,
  onLaunch,
  tags,
  metricPreview,
  icon,
  className,
}) => {
  return (
    <Card
        className={cn(
            "flex flex-col h-full bg-[rgba(16,42,32,0.65)] border border-[rgba(142,255,215,0.25)] text-[rgba(220,255,240,0.9)] rounded-xl p-3.5 shadow-lg hover:shadow-primary/20 transition-all duration-200 ease-in-out hover:border-primary/50 group",
            className
        )}
    >
      <CardHeader className="p-0 mb-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {icon ? (
                    React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary group-hover:text-accent transition-colors" })
                ) : (
                    <Rocket className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                )}
                <CardTitle className="text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate" title={name}>
                    {name}
                </CardTitle>
            </div>
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
            {tags.slice(0, 3).map((tag) => ( // Show max 3 tags
              <Badge key={tag} variant="secondary" className="text-[10px] bg-primary/10 text-primary/90 border-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <div className="mt-auto pt-2">
        <Button
          onClick={() => onLaunch(id)}
          className="w-full h-8 text-xs bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 hover:border-primary/50 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all"
          aria-label={`Launch ${name}`}
        >
          <Rocket className="mr-1.5 h-3.5 w-3.5" />
          Launch
        </Button>
      </div>
    </Card>
  );
};

export default MicroAppCard;
