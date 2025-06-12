
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ZoneControls } from "./zone-controls"; 

interface ZoneProps {
  id: string; 
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
  id, 
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
                     onOpenApp || onRunTask || onViewLogs || (canSettings && onSettingsToggle) || (canClose && onClose); // Simplified check

  return (
    <Card className={cn(
        // Base Card styling (rounded-2xl, jade border, glass bg, custom jade glow) is now handled by Card component itself
        "flex flex-col overflow-hidden h-full", // Removed explicit styling already in Card
        hasActiveAutomation && "zone-shimmer-border", // Keep shimmer if active
        className
      )}
    >
      {showHeader && (
        <CardHeader 
          className={cn(
            "draggable-zone-header", 
            "flex flex-row items-center justify-between space-y-0 p-2.5 md:p-3 border-b border-primary/20 min-h-[44px] cursor-grab backdrop-blur-sm bg-card/30 rounded-t-2xl", // Ensure header also has some blur and jade border
            isMinimized && "rounded-b-2xl" // If minimized, header should also have bottom rounded corners
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {icon && <span className="text-primary flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
            {title && <CardTitle className="text-sm font-headline text-foreground truncate">{title}</CardTitle>}
          </div>
          <ZoneControls
            zoneId={id} 
            zoneTitle={title} 
            onPinToggle={onPinToggle}
            isPinned={isPinned}
            onMaximizeToggle={onMaximizeToggle}
            isMaximized={isMaximized}
            onMinimizeToggle={onMinimizeToggle}
            isMinimized={isMinimized}
            onClose={onClose} 
            onSettingsToggle={onSettingsToggle}
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
          showHeader ? "p-3" : "p-0", // Keep p-0 if no header to allow full bleed content
          isMinimized ? "max-h-0 !p-0 opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        {!isMinimized && children}
      </CardContent>
    </Card>
  );
}
