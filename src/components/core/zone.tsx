import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { ZoneControls } from './zone-controls';

interface ZoneProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;

  onPinToggle?: (id: string) => void;
  isPinned?: boolean;
  onMaximizeToggle?: (id: string) => void;
  isMaximized?: boolean;
  onMinimizeToggle?: (id: string) => void;
  isMinimized?: boolean;
  onClose?: (id: string) => void;
  onSettingsToggle?: (id: string) => void;

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
  const showHeader =
    title ||
    icon ||
    (canPin && onPinToggle) ||
    (canMaximize && onMaximizeToggle) ||
    (canMinimize && onMinimizeToggle) ||
    onOpenApp ||
    onRunTask ||
    onViewLogs ||
    (canSettings && onSettingsToggle) ||
    (canClose && onClose); // Simplified check

  return (
    <Card
      className={cn(
        // Base Card styling (rounded-2xl, jade border, glass bg, custom jade glow) is now handled by Card component itself
        'flex h-full flex-col overflow-hidden',
        hasActiveAutomation && 'zone-shimmer-border',
        className
      )}
    >
      {showHeader && (
        <CardHeader
          className={cn(
            'draggable-zone-header',
            'flex min-h-[44px] cursor-grab flex-row items-center justify-between space-y-0 rounded-t-2xl border-b border-primary/20 bg-card/30 p-2.5 backdrop-blur-sm md:p-3', // Ensure header also has some blur and consistent bg
            isMinimized && 'rounded-b-2xl'
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {icon && (
              <span className="flex-shrink-0 text-primary [&>svg]:h-4 [&>svg]:w-4">
                {icon}
              </span>
            )}
            {title && (
              <CardTitle className="truncate font-headline text-sm text-foreground">
                {title}
              </CardTitle>
            )}
          </div>
          <ZoneControls
            zoneId={id}
            zoneTitle={title}
            onPinToggle={() => onPinToggle?.(id)}
            isPinned={isPinned}
            onMaximizeToggle={() => onMaximizeToggle?.(id)}
            isMaximized={isMaximized}
            onMinimizeToggle={() => onMinimizeToggle?.(id)}
            isMinimized={isMinimized}
            onClose={() => onClose?.(id)}
            onSettingsToggle={() => onSettingsToggle?.(id)}
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
          'flex-grow overflow-auto transition-all duration-300 ease-in-out',
          showHeader ? 'p-3' : 'p-0',
          isMinimized
            ? 'invisible max-h-0 !p-0 opacity-0'
            : 'visible opacity-100'
        )}
      >
        {!isMinimized && children}
      </CardContent>
    </Card>
  );
}
