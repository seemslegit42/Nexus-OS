
// src/components/core/zone-controls.tsx
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Maximize2, Minimize2, Minus, X } from "lucide-react";

interface ZoneControlsProps {
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

export function ZoneControls({
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
}: ZoneControlsProps) {
  
  const baseButtonClass = "relative h-7 w-7 p-1 rounded-full border border-white/20 bg-card/40 backdrop-blur-sm shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-in-out overflow-hidden group";
  
  const iconBaseClass = "h-4 w-4 transition-all duration-200 ease-in-out";

  const controlButtons: JSX.Element[] = [];

  if (onPinToggle) {
    controlButtons.push(
      <Button 
        key="pin-control"
        variant="ghost" 
        size="icon" 
        className={cn(
          baseButtonClass,
          "text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-primary/30 hover:shadow-[0_0_12px_3px_var(--tw-shadow-color)]",
          isPinned && "text-primary border-primary/60 shadow-primary/40 shadow-[0_0_10px_2px_var(--tw-shadow-color)]"
        )} 
        onClick={onPinToggle} 
        title={isPinned ? "Unpin Zone" : "Pin Zone"}
        disabled={!canPin}
      >
        <Pin className={cn(iconBaseClass, isPinned ? "rotate-45 scale-110" : "group-hover:rotate-[-15deg]")} />
        <span className="sr-only">{isPinned ? "Unpin" : "Pin"}</span>
      </Button>
    );
  }

  if (onMinimizeToggle) {
    controlButtons.push(
      <Button 
        key="minimize-control"
        variant="ghost" 
        size="icon" 
        className={cn(
          baseButtonClass,
          "text-yellow-400/80 hover:text-yellow-300 hover:border-yellow-400/50 hover:shadow-yellow-400/40 hover:shadow-[0_0_12px_3px_var(--tw-shadow-color)]",
          isMinimized && "text-yellow-300 border-yellow-400/60 shadow-yellow-400/50 shadow-[0_0_10px_2px_var(--tw-shadow-color)]"
        )} 
        onClick={onMinimizeToggle} 
        title={isMinimized ? "Restore Content" : "Minimize Content"}
        disabled={!canMinimize}
      >
        <Minus className={cn(iconBaseClass, "group-hover:scale-x-125")} />
        <span className="sr-only">{isMinimized ? "Restore Content" : "Minimize Content"}</span>
      </Button>
    );
  }

  if (onMaximizeToggle) {
    controlButtons.push(
      <Button 
        key="maximize-control"
        variant="ghost" 
        size="icon" 
        className={cn(
          baseButtonClass,
          "text-green-400/80 hover:text-green-300 hover:border-green-400/50 hover:shadow-green-400/40 hover:shadow-[0_0_12px_3px_var(--tw-shadow-color)]",
          isMaximized && "text-green-300 border-green-400/60 shadow-green-400/50 shadow-[0_0_10px_2px_var(--tw-shadow-color)]"
        )} 
        onClick={onMaximizeToggle} 
        title={isMaximized ? "Restore Zone" : "Maximize Zone"}
        disabled={!canMaximize}
      >
        {isMaximized ? 
          <Minimize2 className={cn(iconBaseClass, "group-hover:rotate-[-45deg] group-hover:scale-90")} /> : 
          <Maximize2 className={cn(iconBaseClass, "group-hover:rotate-[45deg] group-hover:scale-110")} />}
        <span className="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
      </Button>
    );
  }

  if (onClose) {
    controlButtons.push(
      <Button 
        key="close-control"
        variant="ghost" 
        size="icon" 
        className={cn(
          baseButtonClass,
          "text-red-400/80 hover:text-red-300 hover:border-red-400/50 hover:shadow-red-400/40 hover:shadow-[0_0_12px_3px_var(--tw-shadow-color)]",
        )} 
        onClick={onClose} 
        title="Close Zone"
        disabled={!canClose}
      >
        <X className={cn(iconBaseClass, "group-hover:rotate-90 group-hover:scale-125")} />
        <span className="sr-only">Close</span>
      </Button>
    );
  }

  if (controlButtons.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {controlButtons}
    </div>
  );
}
