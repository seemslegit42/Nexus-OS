// src/components/core/zone-controls.tsx
'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  PushPin as Pin,
  ArrowsOut as Maximize2,
  ArrowsIn as Minimize2,
  Minus,
  X,
  PencilSimple as Edit,
  DotsThreeVertical as MoreVertical,
  PlayCircle,
  FileText,
  CircleNotch as Loader2,
  ArrowSquareOut as ExternalLink,
} from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const BASE_BUTTON_CLASS =
  'relative h-7 w-7 p-1 rounded-full border border-primary/15 bg-primary/5 backdrop-blur-sm shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-in-out overflow-hidden group';
const ICON_BASE_CLASS = 'h-4 w-4 transition-all duration-200 ease-in-out';

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
        console.error('Error running task:', error);
      }
      setIsRunningTask(false);
    }
  }, [onRunTask, zoneId, zoneTitle]);

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

  const hasMenuActions = useMemo(() => {
    return !!(
      onOpenApp ||
      onRunTask ||
      onViewLogs ||
      (canSettings && onSettingsToggle) ||
      (canClose && onClose)
    );
  }, [
    onOpenApp,
    onRunTask,
    onViewLogs,
    canSettings,
    onSettingsToggle,
    canClose,
    onClose,
  ]);

  if (
    !hasMenuActions &&
    !onPinToggle &&
    !onMinimizeToggle &&
    !onMaximizeToggle
  ) {
    return null;
  }

  return (
    <div className="flex flex-shrink-0 items-center gap-1.5">
      {hasMenuActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                BASE_BUTTON_CLASS,
                'text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-foreground hover:shadow-primary/20'
              )}
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
              <DropdownMenuItem
                onClick={handleRunTaskInternal}
                disabled={isRunningTask}
              >
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
            {(onOpenApp || onRunTask || onViewLogs) &&
              ((canSettings && onSettingsToggle) || (canClose && onClose)) && (
                <DropdownMenuSeparator />
              )}

            {canSettings && onSettingsToggle && (
              <DropdownMenuItem onClick={onSettingsToggle}>
                <Edit className="mr-2 h-4 w-4" /> Configure
              </DropdownMenuItem>
            )}
            {canClose && onClose && (
              <>
                {(onOpenApp ||
                  onRunTask ||
                  onViewLogs ||
                  (canSettings && onSettingsToggle)) && (
                  <DropdownMenuSeparator />
                )}
                <DropdownMenuItem
                  onClick={onClose}
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                >
                  <X className="mr-2 h-4 w-4" /> Close Zone
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {onPinToggle && (
        <Button
          key="pin-control"
          variant="ghost"
          size="icon"
          className={cn(
            BASE_BUTTON_CLASS,
            'text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-primary/20',
            isPinned &&
              'border-primary/40 bg-primary/15 text-primary shadow-primary/30'
          )}
          onClick={onPinToggle}
          title={isPinned ? 'Unpin Zone' : 'Pin Zone'}
          disabled={!canPin}
        >
          <Pin
            className={cn(
              ICON_BASE_CLASS,
              isPinned ? 'rotate-45 scale-110' : 'group-hover:rotate-[-15deg]'
            )}
          />
          <span className="sr-only">{isPinned ? 'Unpin' : 'Pin'}</span>
        </Button>
      )}

      {onMinimizeToggle && (
        <Button
          key="minimize-control"
          variant="ghost"
          size="icon"
          className={cn(
            BASE_BUTTON_CLASS,
            'text-yellow-500/80 hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-400 hover:shadow-yellow-500/20',
            isMinimized &&
              'border-yellow-500/40 bg-yellow-500/15 text-yellow-400 shadow-yellow-500/30'
          )}
          onClick={onMinimizeToggle}
          title={isMinimized ? 'Restore Content' : 'Minimize Content'}
          disabled={!canMinimize}
        >
          <Minus className={cn(ICON_BASE_CLASS, 'group-hover:scale-x-125')} />
          <span className="sr-only">
            {isMinimized ? 'Restore Content' : 'Minimize Content'}
          </span>
        </Button>
      )}

      {onMaximizeToggle && (
        <Button
          key="maximize-control"
          variant="ghost"
          size="icon"
          className={cn(
            BASE_BUTTON_CLASS,
            'text-green-500/80 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400 hover:shadow-green-500/20',
            isMaximized &&
              'border-green-500/40 bg-green-500/15 text-green-400 shadow-green-500/30'
          )}
          onClick={onMaximizeToggle}
          title={isMaximized ? 'Restore Zone' : 'Maximize Zone'}
          disabled={!canMaximize}
        >
          {isMaximized ? (
            <Minimize2
              className={cn(
                ICON_BASE_CLASS,
                'group-hover:rotate-[-45deg] group-hover:scale-90'
              )}
            />
          ) : (
            <Maximize2
              className={cn(
                ICON_BASE_CLASS,
                'group-hover:rotate-[45deg] group-hover:scale-110'
              )}
            />
          )}
          <span className="sr-only">
            {isMaximized ? 'Restore' : 'Maximize'}
          </span>
        </Button>
      )}
    </div>
  );
}
