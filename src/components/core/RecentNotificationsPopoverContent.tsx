'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ReactNode } from 'react';
import {
  Warning as AlertTriangleIcon,
  Info,
  CheckCircle,
} from '@phosphor-icons/react'; // Import icons

export interface NotificationItem {
  id: number;
  type: 'error' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  icon: ReactNode;
}

interface RecentNotificationsPopoverContentProps {
  onMarkAllRead?: () => void;
}

// Moved mock data inside the component
const recentNotificationsData: NotificationItem[] = [
  {
    id: 1,
    type: 'error',
    title: 'Agent SecureGuard Offline',
    message: 'Agent has unexpectedly stopped.',
    time: '2m ago',
    icon: <AlertTriangleIcon className="h-4 w-4 text-destructive" />,
  },
  {
    id: 2,
    type: 'info',
    title: 'OS Update v1.1.0 Available',
    message: 'New version of NexOS ready for installation.',
    time: '1h ago',
    icon: <Info className="h-4 w-4 text-primary" />,
  },
  {
    id: 3,
    type: 'success',
    title: 'Task Completed by DataMinerX',
    message: 'Q3 sales data analysis finished.',
    time: '3h ago',
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
  },
  {
    id: 4,
    type: 'warning',
    title: 'Low Disk Space',
    message: 'Module storage is at 92% capacity.',
    time: '5h ago',
    icon: <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />,
  },
];

export function RecentNotificationsPopoverContent({
  onMarkAllRead,
}: RecentNotificationsPopoverContentProps) {
  const notifications = recentNotificationsData; // Use internal data

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-headline font-medium leading-none text-foreground">
          Recent Notifications
        </h4>
        {onMarkAllRead && notifications.length > 0 && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-primary"
            onClick={onMarkAllRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
      <ScrollArea className="max-h-80">
        <div className="grid gap-2 pr-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-3 rounded-md border border-border/60 p-2.5 transition-colors hover:bg-muted/50"
            >
              <div className="mt-0.5">{notif.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {notif.title}
                </p>
                <p className="text-xs text-muted-foreground">{notif.message}</p>
              </div>
              <p className="whitespace-nowrap text-xs text-muted-foreground">
                {notif.time}
              </p>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No new notifications.
            </p>
          )}
        </div>
      </ScrollArea>
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/notifications">View All Notifications</Link>
      </Button>
    </div>
  );
}
