
// src/components/core/zone-controls.tsx
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Lock, Maximize2, Minimize2, Minus, X } from "lucide-react"; // Minus for content collapse, Minimize2 for restore from Maximize

interface ZoneControlsProps {
  onPinToggle?: () => void;
  isPinned?: boolean;
  onMaximizeToggle?: () => void;
  isMaximized?: boolean;
  onMinimizeToggle?: () => void; // For content collapse
  isMinimized?: boolean; // For content collapse
  onClose?: () => void;
  
  canPin?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canClose?: boolean;
}

export function ZoneControls({
  onPinToggle,
  isPinned,
  onMaximizeToggle,
  isMaximized,
  onMinimizeToggle,
  isMinimized,
  onClose,
  canPin,
  canMaximize,
  canMinimize,
  canClose,
}: ZoneControlsProps) {
  const commonButtonClass = "h-6 w-6 p-0.5 text-muted-foreground bg-card/50 hover:bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {canPin && onPinToggle && (
        <Button variant="ghost" size="icon" className={cn(commonButtonClass, isPinned && "text-primary hover:text-primary")} onClick={onPinToggle} title={isPinned ? "Unpin Zone" : "Pin Zone"}>
          <Pin className="h-3.5 w-3.5" />
          <span className="sr-only">{isPinned ? "Unpin" : "Pin"}</span>
        </Button>
      )}
      {canMinimize && onMinimizeToggle && (
         <Button variant="ghost" size="icon" className={cn(commonButtonClass, "hover:text-yellow-500")} onClick={onMinimizeToggle} title={isMinimized ? "Restore Content" : "Minimize Content"}>
          <Minus className="h-3.5 w-3.5" />
          <span className="sr-only">{isMinimized ? "Restore Content" : "Minimize Content"}</span>
        </Button>
      )}
      {canMaximize && onMaximizeToggle && (
        <Button variant="ghost" size="icon" className={cn(commonButtonClass, "hover:text-green-500")} onClick={onMaximizeToggle} title={isMaximized ? "Restore Zone" : "Maximize Zone"}>
          {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          <span className="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
        </Button>
      )}
      {canClose && onClose && (
       <Button variant="ghost" size="icon" className={cn(commonButtonClass, "hover:text-destructive")} onClick={onClose} title="Close Zone">
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Close</span>
      </Button>
      )}
    </div>
  );
}
