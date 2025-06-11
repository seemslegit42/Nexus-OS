
// src/components/core/zone-controls.tsx
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Maximize2, Minimize2, Minus, X, SlidersHorizontal } from "lucide-react"; // Added SlidersHorizontal

interface ZoneControlsProps {
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
}

export function ZoneControls({
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
}: ZoneControlsProps) {
  
  const baseButtonClass = "relative h-6 w-6 p-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-in-out overflow-hidden group";
  
  const iconBaseClass = "h-3.5 w-3.5 transition-all duration-200 ease-in-out"; 

  const controlButtons: JSX.Element[] = [];

  if (onPinToggle) {
    controlButtons.push(
      <Button 
        key="pin-control"
        variant="ghost" 
        size="icon" 
        className={cn(
          baseButtonClass,
          "text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-primary/20 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
          isPinned && "text-primary border-primary/50 shadow-primary/30 shadow-[0_0_8px_1px_var(--tw-shadow-color)]"
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
  
  if (onSettingsToggle) { // Add Settings button
    controlButtons.push(
      <Button
        key="settings-control"
        variant="ghost"
        size="icon"
        className={cn(
          baseButtonClass,
          "text-muted-foreground hover:text-accent hover:border-accent/40 hover:shadow-accent/20 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]"
        )}
        onClick={onSettingsToggle}
        title="Zone Settings"
        disabled={!canSettings}
      >
        <SlidersHorizontal className={cn(iconBaseClass, "group-hover:rotate-[15deg]")}/>
        <span className="sr-only">Settings</span>
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
          "text-yellow-400/70 hover:text-yellow-300 hover:border-yellow-400/40 hover:shadow-yellow-400/30 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
          isMinimized && "text-yellow-300 border-yellow-400/50 shadow-yellow-400/40 shadow-[0_0_8px_1px_var(--tw-shadow-color)]"
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
          "text-green-400/70 hover:text-green-300 hover:border-green-400/40 hover:shadow-green-400/30 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
          isMaximized && "text-green-300 border-green-400/50 shadow-green-400/40 shadow-[0_0_8px_1px_var(--tw-shadow-color)]"
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
          "text-red-400/70 hover:text-red-300 hover:border-red-400/40 hover:shadow-red-400/30 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
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
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {controlButtons}
    </div>
  );
}
