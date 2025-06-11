
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ZoneControls } from "./zone-controls"; 

interface ZoneProps {
  id: string; // Added id prop
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
  onSettingsToggle?: () => void;

  canPin?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canClose?: boolean;
  canSettings?: boolean;
  hasActiveAutomation?: boolean;

  onOpenApp?: (zoneId: string, zoneTitle: string) => void;
  onRunTask?: (zoneId: string, zoneTitle: string) => Promise<void>;
  onViewLogs?: (zoneId: string, zoneTitle: string) => void;
}

export function Zone({ 
  id, // Destructure id
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
  onSettingsToggle,
  canPin = true,
  canMaximize = true,
  canMinimize = true,
  canClose = true,
  canSettings = true,
  hasActiveAutomation = false,
  onOpenApp,
  onRunTask,
  onViewLogs,
}: ZoneProps) {

  const showHeader = title || 
                     icon || 
                     (canPin && onPinToggle) || 
                     (canMaximize && onMaximizeToggle) || 
                     (canMinimize && onMinimizeToggle) || 
                    //  (canSettings && onSettingsToggle) || // Settings is now part of ellipsis menu primarily
                    //  (canClose && onClose) || // Close is now part of ellipsis menu primarily
                     onOpenApp || onRunTask || onViewLogs; // Check if any menu actions are provided

  return (
    <Card className={cn(
        "bg-card backdrop-blur-md shadow-xl rounded-xl border-border/70 flex flex-col overflow-hidden h-full", 
        hasActiveAutomation && "zone-shimmer-border border-2 border-transparent",
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
            zoneId={id} // Pass id
            zoneTitle={title} // Pass title
            onPinToggle={onPinToggle}
            isPinned={isPinned}
            onMaximizeToggle={onMaximizeToggle}
            isMaximized={isMaximized}
            onMinimizeToggle={onMinimizeToggle}
            isMinimized={isMinimized}
            onClose={onClose} // Keep for direct close if needed, or menu will use it
            onSettingsToggle={onSettingsToggle} // Keep for direct settings or menu
            canPin={canPin}
            canMaximize={canMaximize}
            canMinimize={canMinimize}
            canClose={canClose}
            canSettings={canSettings}
            onOpenApp={onOpenApp}
            onRunTask={onRunTask}
            onViewLogs={onViewLogs}
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
