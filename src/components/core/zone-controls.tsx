
// src/components/core/zone-controls.tsx
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Maximize2, Minimize2, Minus, X, SlidersHorizontal, MoreVertical, PlayCircle, FileText, Edit, Trash2, Loader2, Eye, ExternalLink } from "lucide-react"; // Added MoreVertical & others
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import React from "react"; // Import React for useState

interface ZoneControlsProps {
  zoneId: string;
  zoneTitle: string;
  
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

  onOpenApp?: (zoneId: string, zoneTitle: string) => void;
  onRunTask?: (zoneId: string, zoneTitle: string) => Promise<void>;
  onViewLogs?: (zoneId: string, zoneTitle: string) => void;
}

export function ZoneControls({
  zoneId,
  zoneTitle,
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
  onOpenApp,
  onRunTask,
  onViewLogs,
}: ZoneControlsProps) {
  
  const [isRunningTask, setIsRunningTask] = React.useState(false);

  const handleRunTask = async () => {
    if (onRunTask) {
      setIsRunningTask(true);
      try {
        await onRunTask(zoneId, zoneTitle);
      } catch (error) {
        console.error("Error running task:", error);
        // Optionally, show an error toast or log to the persistent console
      }
      setIsRunningTask(false);
    }
  };

  const baseButtonClass = "relative h-6 w-6 p-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-in-out overflow-hidden group";
  const iconBaseClass = "h-3.5 w-3.5 transition-all duration-200 ease-in-out"; 

  const controlButtons: JSX.Element[] = [];

  // Ellipsis Menu
  const hasMenuActions = onOpenApp || onRunTask || onViewLogs || (canSettings && onSettingsToggle) || (canClose && onClose);
  if (hasMenuActions) {
    controlButtons.push(
      <DropdownMenu key="ellipsis-menu">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(baseButtonClass, "text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:shadow-foreground/20")}
            title="More actions"
          >
            <MoreVertical className={iconBaseClass} />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onOpenApp && (
            <DropdownMenuItem onClick={() => onOpenApp(zoneId, zoneTitle)}>
              <ExternalLink className="mr-2 h-4 w-4" /> Open App
            </DropdownMenuItem>
          )}
          {onRunTask && (
            <DropdownMenuItem onClick={handleRunTask} disabled={isRunningTask}>
              {isRunningTask ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="mr-2 h-4 w-4" />
              )}
              Run Task Now
            </DropdownMenuItem>
          )}
          {onViewLogs && (
            <DropdownMenuItem onClick={() => onViewLogs(zoneId, zoneTitle)}>
              <FileText className="mr-2 h-4 w-4" /> View Logs
            </DropdownMenuItem>
          )}
          {(onOpenApp || onRunTask || onViewLogs) && (canSettings && onSettingsToggle || canClose && onClose) && <DropdownMenuSeparator />}
          
          {canSettings && onSettingsToggle && (
            <DropdownMenuItem onClick={onSettingsToggle}>
              <Edit className="mr-2 h-4 w-4" /> Configure
            </DropdownMenuItem>
          )}
          {canClose && onClose && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClose} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Remove App
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }


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
  
  // Removed individual settings button as it's now in the ellipsis menu if `onSettingsToggle` is provided
  // if (onSettingsToggle && !hasMenuActions) { ... } // Could add it back if no ellipsis menu is present but settings are.

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

  // Removed individual close button as it's now in the ellipsis menu if `onClose` is provided
  // if (onClose && !hasMenuActions) { ... }

  if (controlButtons.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {controlButtons}
    </div>
  );
}
