
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, Cpu, History, CheckCircle2, Settings2, Zap, MessageSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

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
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 p-1 border-b border-border/30">
        <h2 className="text-xl font-headline text-foreground">Recent Notifications</h2>
        <Button variant="outline">Mark all as read</Button>
      </div>
      <div className="space-y-3 flex-grow overflow-y-auto p-1">
        {notifications.map((notif) => {
          const styles = getUrgencyStyles(notif.urgency);
          return (
            <Card key={notif.id} className={`shadow-md ${styles.color}`}>
              <CardHeader className="pb-2 pt-3 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {styles.icon}
                    <CardTitle className={`text-md font-headline ${styles.titleColor}`}>{notif.title}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-3 px-3">
                <p className="text-sm text-foreground">{notif.message}</p>
                {notif.agent && <p className="text-xs text-muted-foreground mt-1">Related Agent: {notif.agent}</p>}
              </CardContent>
              <CardFooter className="flex gap-2 pb-3 px-3">
                <Button variant="outline" size="sm"><CheckCircle2 className="mr-1 h-4 w-4"/> Mark as Read</Button>
                {notif.urgency === 'high' && <Button variant="destructive" size="sm"><AlertTriangle className="mr-1 h-4 w-4"/> Escalate</Button>}
                {notif.agent && <Button variant="secondary" size="sm"><Cpu className="mr-1 h-4 w-4"/> View Agent</Button>}
              </CardFooter>
            </Card>
          );
        })}
        {notifications.length === 0 && (
            <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No new notifications</h3>
                <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
            </div>
        )}
      </div>
    </div>
  );
}

function AutoActionConfigContent(): ReactNode {
    return (
        <div className="p-1 space-y-4">
            <h3 className="text-md font-semibold font-headline text-foreground">Automated Actions</h3>
            <p className="text-xs text-muted-foreground">Configure rules for NexOS to automatically respond to certain notifications.</p>
            
            <Card className="bg-background/50">
                <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                        Rule: Agent Offline Critical
                        <Switch defaultChecked/>
                    </CardTitle>
                    <CardDescription className="text-xs">When an agent reports critical offline status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <Label htmlFor="action-type-offline" className="text-xs">Action Type</Label>
                        <Select defaultValue="restart_agent">
                            <SelectTrigger id="action-type-offline" className="h-8 text-xs bg-background border-input focus:ring-primary">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="restart_agent">Attempt to Restart Agent</SelectItem>
                                <SelectItem value="notify_admin">Notify Administrator Team</SelectItem>
                                <SelectItem value="create_ticket">Create Support Ticket</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="notify-channel-offline" className="text-xs">Notify Channel (if applicable)</Label>
                        <Input id="notify-channel-offline" placeholder="e.g., #ops-alerts (Slack)" className="h-8 text-xs bg-background border-input focus:ring-primary"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm">Save Rule</Button>
                </CardFooter>
            </Card>

            <Button variant="outline" className="w-full"><PlusCircle className="mr-2 h-4 w-4"/> Add New Auto-Action Rule</Button>
        </div>
    );
}


export default function NotificationsPage() {
  const notificationZoneConfigs: ZoneConfig[] = [
    {
      id: 'notificationsCenter',
      title: 'Notification Center',
      icon: <MessageSquare className="w-5 h-5" />,
      content: <NotificationsContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 7, h: 16, minW: 4, minH: 8 }, 
        md: { x: 0, y: 0, w: 6, h: 16, minW: 4, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 6 },
      },
    },
    {
      id: 'autoActionConfig',
      title: 'Auto-Action Configuration',
      icon: <Zap className="w-5 h-5" />,
      content: <AutoActionConfigContent />,
      defaultLayout: {
        lg: { x: 7, y: 0, w: 5, h: 16, minW: 3, minH: 8 }, 
        md: { x: 6, y: 0, w: 4, h: 16, minW: 3, minH: 8 },
        sm: { x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 6 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={notificationZoneConfigs}
      className="flex-grow"
    />
  );
}

    