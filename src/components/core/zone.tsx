
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ZoneControls } from "./zone-controls"; // Assuming ZoneControls is in the same directory

interface ZoneProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  
  // Controls related props
  onPinToggle?: () => void;
  isPinned?: boolean;
  onMaximizeToggle?: () => void;
  isMaximized?: boolean;
  onMinimizeToggle?: () => void;
  isMinimized?: boolean;
  onClose?: () => void;

  canPin?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canClose?: boolean;
}

export function Zone({ 
  title, 
  children, 
  className, 
  icon,
  onPinToggle,
  isPinned,
  onMaximizeToggle,
  isMaximized,
  onMinimizeToggle,
  isMinimized,
  onClose,
  canPin = true,
  canMaximize = true,
  canMinimize = true,
  canClose = true,
}: ZoneProps) {
  return (
    <Card className={cn("bg-card/80 backdrop-blur-md shadow-lg rounded-xl border-border flex flex-col overflow-hidden h-full", className)}>
      <CardHeader 
        className={cn(
          "draggable-zone-header", // Added class for react-grid-layout draggableHandle
          "flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/50 min-h-[48px] cursor-grab" // Ensure min-height and cursor
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon && <span className="text-primary flex-shrink-0">{icon}</span>}
          <CardTitle className="text-base font-headline text-foreground truncate">{title}</CardTitle>
        </div>
        <ZoneControls
          onPinToggle={onPinToggle}
          isPinned={isPinned}
          onMaximizeToggle={onMaximizeToggle}
          isMaximized={isMaximized}
          onMinimizeToggle={onMinimizeToggle}
          isMinimized={isMinimized}
          onClose={onClose}
          canPin={canPin}
          canMaximize={canMaximize}
          canMinimize={canMinimize}
          canClose={canClose}
        />
      </CardHeader>
      <CardContent 
        className={cn(
          "p-4 flex-grow overflow-auto transition-all duration-300 ease-in-out",
          isMinimized ? "max-h-0 p-0 opacity-0 invisible" : "opacity-100 visible"
        )}
        style={{
             paddingTop: isMinimized ? 0 : undefined,
             paddingBottom: isMinimized ? 0 : undefined,
        }}
      >
        {!isMinimized && children}
      </CardContent>
    </Card>
  );
}
