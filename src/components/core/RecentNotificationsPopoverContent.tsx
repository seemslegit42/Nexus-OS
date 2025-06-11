
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ReactNode } from 'react';

export interface NotificationItem {
  id: number;
  type: 'error' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  icon: ReactNode;
}

interface RecentNotificationsPopoverContentProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void; 
}

export function RecentNotificationsPopoverContent({ notifications, onMarkAllRead }: RecentNotificationsPopoverContentProps) {
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium leading-none font-headline text-foreground">Recent Notifications</h4>
        {onMarkAllRead && notifications.length > 0 && (
           <Button variant="link" size="sm" className="text-xs p-0 h-auto text-primary" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>
      <ScrollArea className="max-h-80">
        <div className="grid gap-2 pr-2">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3 p-2.5 rounded-md border border-border/60 hover:bg-muted/50 transition-colors">
              <div className="mt-0.5">{notif.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground">{notif.message}</p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</p>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
          )}
        </div>
      </ScrollArea>
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/notifications">View All Notifications</Link>
      </Button>
    </div>
  );
}
