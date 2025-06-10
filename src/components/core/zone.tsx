import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Lock, Info, Expand, Minimize, X } from "lucide-react";
import type { ReactNode } from "react";

interface ZoneProps {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  icon?: ReactNode;
  onLockToggle?: () => void;
  isLocked?: boolean;
  onPinToggle?: () => void;
  isPinned?: boolean;
  onExpandToggle?: () => void;
  isExpanded?: boolean;
  onClose?: () => void;
}

export function Zone({ 
  title, 
  children, 
  className, 
  actions, 
  icon,
  onLockToggle,
  isLocked,
  onPinToggle,
  isPinned,
  onExpandToggle,
  isExpanded,
  onClose
}: ZoneProps) {
  return (
    <Card className={cn("bg-card/80 backdrop-blur-md shadow-lg rounded-xl border-border flex flex-col overflow-hidden h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle className="text-lg font-headline text-foreground">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          {onLockToggle && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onLockToggle}>
              <Lock className={cn("h-4 w-4", isLocked && "text-primary")} />
              <span className="sr-only">{isLocked ? "Unlock" : "Lock"}</span>
            </Button>
          )}
          {onPinToggle && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onPinToggle}>
              <Pin className={cn("h-4 w-4", isPinned && "text-primary")} />
              <span className="sr-only">{isPinned ? "Unpin" : "Pin"}</span>
            </Button>
          )}
          {onExpandToggle && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onExpandToggle}>
              {isExpanded ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              <span className="sr-only">{isExpanded ? "Minimize" : "Expand"}</span>
            </Button>
          )}
          {onClose && (
           <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}
