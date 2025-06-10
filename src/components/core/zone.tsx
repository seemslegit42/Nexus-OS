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
}

export function Zone({ title, children, className, actions, icon }: ZoneProps) {
  // For glassmorphism: bg-card/70 backdrop-blur-md. Use bg-card for solid.
  // Minimal shadow: shadow-lg
  return (
    <Card className={cn("bg-card/80 backdrop-blur-md shadow-lg rounded-xl border-border flex flex-col overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle className="text-lg font-headline text-foreground">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <Pin className="h-4 w-4" />
            <span className="sr-only">Pin</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <Expand className="h-4 w-4" />
            <span className="sr-only">Expand</span>
          </Button>
           <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}
