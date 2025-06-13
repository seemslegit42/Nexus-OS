
// src/components/core/zone-controls.tsx
'use client';

import React, { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Maximize2, Minimize2, Minus, X, SlidersHorizontal, MoreVertical, PlayCircle, FileText, Edit, Trash2, Loader2, Eye, ExternalLink } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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

const BASE_BUTTON_CLASS = "relative h-7 w-7 p-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-in-out overflow-hidden group";
const ICON_BASE_CLASS = "h-4 w-4 transition-all duration-200 ease-in-out";

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
  
  const [isRunningTask, setIsRunningTask] = useState(false);

  const handleRunTaskInternal = useCallback(async () => {
    if (onRunTask) {
      setIsRunningTask(true);
      try {
        await onRunTask(zoneId, zoneTitle);
      } catch (error) {
        console.error("Error running task:", error);
      }
      setIsRunningTask(false);
    }
  }, [onRunTask, zoneId, zoneTitle, setIsRunningTask]);

  const handleOpenAppInternal = useCallback(() => {
    if (onOpenApp) {
      onOpenApp(zoneId, zoneTitle);
    }
  }, [onOpenApp, zoneId, zoneTitle]);

  const handleViewLogsInternal = useCallback(() => {
    if (onViewLogs) {
      onViewLogs(zoneId, zoneTitle);
    }
  }, [onViewLogs, zoneId, zoneTitle]);

  const controlButtons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    const hasMenuActions = onOpenApp || onRunTask || onViewLogs || (canSettings && onSettingsToggle) || (canClose && onClose);

    if (hasMenuActions) {
      buttons.push(
        <DropdownMenu key="ellipsis-menu">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(BASE_BUTTON_CLASS, "text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:shadow-foreground/20")}
              title="More actions"
            >
              <MoreVertical className={ICON_BASE_CLASS} />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onOpenApp && (
              <DropdownMenuItem onClick={handleOpenAppInternal}>
                <ExternalLink className="mr-2 h-4 w-4" /> Open App
              </DropdownMenuItem>
            )}
            {onRunTask && (
              <DropdownMenuItem onClick={handleRunTaskInternal} disabled={isRunningTask}>
                {isRunningTask ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="mr-2 h-4 w-4" />
                )}
                Run Task Now
              </DropdownMenuItem>
            )}
            {onViewLogs && (
              <DropdownMenuItem onClick={handleViewLogsInternal}>
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
      buttons.push(
        <Button 
          key="pin-control"
          variant="ghost" 
          size="icon" 
          className={cn(
            BASE_BUTTON_CLASS,
            "text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-primary/20 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
            isPinned && "text-primary border-primary/50 shadow-primary/30 shadow-[0_0_8px_1px_var(--tw-shadow-color)]"
          )} 
          onClick={onPinToggle} 
          title={isPinned ? "Unpin Zone" : "Pin Zone"}
          disabled={!canPin}
        >
          <Pin className={cn(ICON_BASE_CLASS, isPinned ? "rotate-45 scale-110" : "group-hover:rotate-[-15deg]")} />
          <span className="sr-only">{isPinned ? "Unpin" : "Pin"}</span>
        </Button>
      );
    }
    
    if (onMinimizeToggle) {
      buttons.push(
        <Button 
          key="minimize-control"
          variant="ghost" 
          size="icon" 
          className={cn(
            BASE_BUTTON_CLASS,
            "text-yellow-400/70 hover:text-yellow-300 hover:border-yellow-400/40 hover:shadow-yellow-400/30 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
            isMinimized && "text-yellow-300 border-yellow-400/50 shadow-yellow-400/40 shadow-[0_0_8px_1px_var(--tw-shadow-color)]"
          )} 
          onClick={onMinimizeToggle} 
          title={isMinimized ? "Restore Content" : "Minimize Content"}
          disabled={!canMinimize}
        >
          <Minus className={cn(ICON_BASE_CLASS, "group-hover:scale-x-125")} />
          <span className="sr-only">{isMinimized ? "Restore Content" : "Minimize Content"}</span>
        </Button>
      );
    }

    if (onMaximizeToggle) {
      buttons.push(
        <Button 
          key="maximize-control"
          variant="ghost" 
          size="icon" 
          className={cn(
            BASE_BUTTON_CLASS,
            "text-green-400/70 hover:text-green-300 hover:border-green-400/40 hover:shadow-green-400/30 hover:shadow-[0_0_10px_2px_var(--tw-shadow-color)]",
            isMaximized && "text-green-300 border-green-400/50 shadow-green-400/40 shadow-[0_0_8px_1px_var(--tw-shadow-color)]"
          )} 
          onClick={onMaximizeToggle} 
          title={isMaximized ? "Restore Zone" : "Maximize Zone"}
          disabled={!canMaximize}
        >
          {isMaximized ? 
            <Minimize2 className={cn(ICON_BASE_CLASS, "group-hover:rotate-[-45deg] group-hover:scale-90")} /> : 
            <Maximize2 className={cn(ICON_BASE_CLASS, "group-hover:rotate-[45deg] group-hover:scale-110")} />}
          <span className="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
        </Button>
      );
    }
    return buttons;
  }, [
    zoneId, zoneTitle, onPinToggle, isPinned, onMaximizeToggle, isMaximized, 
    onMinimizeToggle, isMinimized, onClose, onSettingsToggle, canPin, 
    canMaximize, canMinimize, canClose, canSettings, 
    onOpenApp, handleOpenAppInternal, 
    onRunTask, handleRunTaskInternal, isRunningTask,
    onViewLogs, handleViewLogsInternal
  ]);

  if (controlButtons.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {controlButtons}
    </div>
  );
}
