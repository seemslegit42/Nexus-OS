
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

  // Determine if the header should be shown
  const showHeader = title || 
                     icon || 
                     (canPin && onPinToggle) || 
                     (canMaximize && onMaximizeToggle) || 
                     (canMinimize && onMinimizeToggle) || 
                     (canClose && onClose);

  return (
    <Card className={cn("bg-card/60 backdrop-blur-lg shadow-xl rounded-xl border-border/30 flex flex-col overflow-hidden h-full", className)}>
      {showHeader && (
        <CardHeader 
          className={cn(
            "draggable-zone-header", 
            "flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/30 min-h-[48px] cursor-grab"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {icon && <span className="text-primary flex-shrink-0">{icon}</span>}
            {/* Render CardTitle only if title is provided */}
            {title && <CardTitle className="text-base font-headline text-foreground truncate">{title}</CardTitle>}
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
      )}
      <CardContent 
        className={cn(
          "p-4 flex-grow overflow-auto transition-all duration-300 ease-in-out",
          // If no header, CardContent's default p-4 is fine.
          isMinimized ? "max-h-0 p-0 !pt-0 !pb-0 opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        {!isMinimized && children}
      </CardContent>
    </Card>
  );
}
