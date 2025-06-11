
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ZoneControls } from "./zone-controls"; 

interface ZoneProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  
  onPinToggle?: () => void;
  isPinned?: boolean;
  onMaximizeToggle?: () => void;
  isMaximized?: boolean;
  onMinimizeToggle?: () => void;
  isMinimized?: boolean;
  onClose?: () => void;
  onSettingsToggle?: () => void; // New prop for settings

  canPin?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canClose?: boolean;
  canSettings?: boolean; // New prop
  hasActiveAutomation?: boolean; // New prop for shimmer
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
  onSettingsToggle, // New prop
  canPin = true,
  canMaximize = true,
  canMinimize = true,
  canClose = true,
  canSettings = true, // New prop
  hasActiveAutomation = false, // New prop
}: ZoneProps) {

  const showHeader = title || 
                     icon || 
                     (canPin && onPinToggle) || 
                     (canMaximize && onMaximizeToggle) || 
                     (canMinimize && onMinimizeToggle) || 
                     (canSettings && onSettingsToggle) || // Include settings in showHeader check
                     (canClose && onClose);

  return (
    <Card className={cn(
        "bg-card backdrop-blur-md shadow-xl rounded-xl border-border/70 flex flex-col overflow-hidden h-full", 
        hasActiveAutomation && "zone-shimmer-border border-2 border-transparent", // Apply shimmer class
        className
      )}
    >
      {showHeader && (
        <CardHeader 
          className={cn(
            "draggable-zone-header", 
            "flex flex-row items-center justify-between space-y-0 p-2.5 border-b border-border/60 min-h-[44px] cursor-grab" 
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {icon && <span className="text-primary flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
            {title && <CardTitle className="text-sm font-headline text-foreground truncate">{title}</CardTitle>}
          </div>
          <ZoneControls
            onPinToggle={onPinToggle}
            isPinned={isPinned}
            onMaximizeToggle={onMaximizeToggle}
            isMaximized={isMaximized}
            onMinimizeToggle={onMinimizeToggle}
            isMinimized={isMinimized}
            onClose={onClose}
            onSettingsToggle={onSettingsToggle} // Pass to controls
            canPin={canPin}
            canMaximize={canMaximize}
            canMinimize={canMinimize}
            canClose={canClose}
            canSettings={canSettings} // Pass to controls
          />
        </CardHeader>
      )}
      <CardContent 
        className={cn(
          "flex-grow overflow-auto transition-all duration-300 ease-in-out",
          showHeader ? "p-3" : "p-0", 
          isMinimized ? "max-h-0 !p-0 opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        {!isMinimized && children}
      </CardContent>
    </Card>
  );
}
