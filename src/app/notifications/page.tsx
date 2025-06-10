
'use client';

import { Zone } from '@/components/core/zone';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, Cpu, History, CheckCircle2 } from 'lucide-react';

const notifications = [
  { id: 1, type: 'alert', title: 'Critical System Alert: Agent SecureGuard Offline', message: 'Agent SecureGuard has unexpectedly stopped. Immediate attention required.', time: '2m ago', urgency: 'high', agent: 'SecureGuard' },
  { id: 2, type: 'info', title: 'OS Update v1.1.0 Available', message: 'A new version of NexOS is ready for installation. Includes performance improvements and new features.', time: '1h ago', urgency: 'medium', agent: null },
  { id: 3, type: 'agent', title: 'Task Completed: Data Analysis by DataMinerX', message: 'Agent DataMinerX has finished analyzing Q3 sales data. Report is available in File Vault.', time: '3h ago', urgency: 'low', agent: 'DataMinerX' },
  { id: 4, type: 'warning', title: 'Low Disk Space on Module Storage', message: 'Module storage is currently at 92% capacity. Please review and clear unnecessary files.', time: '5h ago', urgency: 'medium', agent: null },
];

const getUrgencyStyles = (urgency: string) => {
  switch (urgency) {
    case 'high': return { icon: <AlertTriangle className="h-5 w-5 text-destructive" />, color: 'border-destructive/50 bg-destructive/10', titleColor: 'text-destructive' };
    case 'medium': return { icon: <Info className="h-5 w-5 text-yellow-500" />, color: 'border-yellow-500/50 bg-yellow-500/10', titleColor: 'text-yellow-600' };
    default: return { icon: <Bell className="h-5 w-5 text-primary" />, color: 'border-primary/30 bg-primary/5', titleColor: 'text-primary' };
  }
};

function NotificationsContent() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-headline text-foreground">Recent Notifications</h2>
        <Button variant="outline">Mark all as read</Button>
      </div>
      <div className="space-y-3">
        {notifications.map((notif) => {
          const styles = getUrgencyStyles(notif.urgency);
          return (
            <Card key={notif.id} className={`shadow-md ${styles.color}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {styles.icon}
                    <CardTitle className={`text-md font-headline ${styles.titleColor}`}>{notif.title}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-foreground">{notif.message}</p>
                {notif.agent && <p className="text-xs text-muted-foreground mt-1">Related Agent: {notif.agent}</p>}
              </CardContent>
              <CardFooter className="flex gap-2 pb-3">
                <Button variant="outline" size="sm"><CheckCircle2 className="mr-1 h-4 w-4"/> Mark as Read</Button>
                {notif.urgency === 'high' && <Button variant="destructive" size="sm"><AlertTriangle className="mr-1 h-4 w-4"/> Escalate</Button>}
                {notif.agent && <Button variant="secondary" size="sm"><Cpu className="mr-1 h-4 w-4"/> View Agent</Button>}
                <Button variant="ghost" size="sm"><History className="mr-1 h-4 w-4"/> Snooze</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {notifications.length === 0 && (
          <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No new notifications</h3>
              <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
          </div>
      )}
    </>
  );
}


export default function NotificationsPage() {
  const notificationZoneConfigs: ZoneConfig[] = [
    {
      id: 'notificationsCenter',
      title: 'Notification Center',
      icon: <Bell className="w-5 h-5" />,
      content: <NotificationsContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 16, minW: 6, minH: 8 }, // Span full width on large screens
        md: { x: 0, y: 0, w: 10, h: 16, minW: 5, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 16, minW: 4, minH: 8 },
        xs: { x: 0, y: 0, w: 4, h: 16, minW: 2, minH: 8 },
        xxs: { x: 0, y: 0, w: 2, h: 16, minW: 1, minH: 8 },
      },
      isDraggable: true,
      isResizable: true,
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={notificationZoneConfigs}
      className="flex-grow"
      rowHeight={30} // Adjust as needed
    />
  );
}
