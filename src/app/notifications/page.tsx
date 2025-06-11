
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, Cpu, History, CheckCircle2, Settings2, Zap, MessageSquare, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const notifications = [
  { id: 1, type: 'alert', title: 'Critical System Alert: Agent SecureGuard Offline', message: 'Agent SecureGuard has unexpectedly stopped. Immediate attention required.', time: '2m ago', urgency: 'high', agent: 'SecureGuard' },
  { id: 2, type: 'info', title: 'OS Update v1.1.0 Available', message: 'A new version of NexOS is ready for installation. Includes performance improvements and new features.', time: '1h ago', urgency: 'medium', agent: null },
  { id: 3, type: 'agent', title: 'Task Completed: Data Analysis by DataMinerX', message: 'Agent DataMinerX has finished analyzing Q3 sales data. Report is available in File Vault.', time: '3h ago', urgency: 'low', agent: 'DataMinerX' },
  { id: 4, type: 'warning', title: 'Low Disk Space on Module Storage', message: 'Module storage is currently at 92% capacity. Please review and clear unnecessary files.', time: '5h ago', urgency: 'medium', agent: null },
  { id: 5, type: 'agent', title: 'Agent OptimizerPrime suggests code refactor for Module X.', message: 'Potential 15% performance gain identified.', time: '6h ago', urgency: 'low', agent: 'OptimizerPrime' },
];

const getUrgencyStyles = (urgency: string) => {
  switch (urgency) {
    case 'high': return { icon: <AlertTriangle className="h-4 w-4 text-destructive" />, color: 'border-destructive/60 bg-destructive/15', titleColor: 'text-destructive' };
    case 'medium': return { icon: <Info className="h-4 w-4 text-yellow-500" />, color: 'border-yellow-500/50 bg-yellow-500/10', titleColor: 'text-yellow-600 dark:text-yellow-400' };
    default: return { icon: <Bell className="h-4 w-4 text-primary" />, color: 'border-primary/40 bg-primary/5', titleColor: 'text-primary' };
  }
};

function NotificationsContent() { 
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3 border-b border-border/60">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-headline text-foreground">Recent Notifications</h2>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-card hover:bg-muted/60">Mark all as read</Button>
        </div>
      </CardHeader>
      <CardContent className="p-1 md:p-2 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <div className="space-y-2 p-0.5">
            {notifications.map((notif) => {
            const styles = getUrgencyStyles(notif.urgency);
            return (
                <Card key={notif.id} className={cn("shadow-sm hover:shadow-md transition-shadow", styles.color)}>
                <CardHeader className="pb-1.5 pt-2 px-2.5">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {styles.icon}
                        <CardTitle className={`text-sm font-semibold ${styles.titleColor}`}>{notif.title}</CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                    </div>
                </CardHeader>
                <CardContent className="pb-2 px-2.5">
                    <p className="text-xs text-foreground/90">{notif.message}</p>
                    {notif.agent && <p className="text-xs text-muted-foreground mt-0.5">Related Agent: <span className="font-medium text-foreground/80">{notif.agent}</span></p>}
                </CardContent>
                <CardFooter className="flex gap-1.5 pb-2 px-2.5 border-t border-border/40 pt-1.5">
                    <Button variant="outline" size="xs" className="bg-background/50 hover:bg-muted/50"><CheckCircle2 className="mr-1 h-3.5 w-3.5"/> Read</Button>
                    {notif.urgency === 'high' && <Button variant="destructive" size="xs"><AlertTriangle className="mr-1 h-3.5 w-3.5"/> Escalate</Button>}
                    {notif.agent && <Button variant="secondary" size="xs" className="bg-muted/50 hover:bg-muted/70"><Cpu className="mr-1 h-3.5 w-3.5"/> View Agent</Button>}
                    <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-foreground">Snooze</Button>
                </CardFooter>
                </Card>
            );
            })}
            {notifications.length === 0 && (
                <div className="text-center py-8">
                    <Bell className="mx-auto h-10 w-10 text-muted-foreground/70" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No new notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AutoActionConfigContent(): ReactNode {
    return (
        <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
            <CardHeader className="p-2 md:p-3">
                <CardTitle className="text-md font-semibold font-headline text-foreground flex items-center"><Zap className="w-4 h-4 mr-2 text-primary"/>Automated Action Rules</CardTitle>
            </CardHeader>
            <CardContent className="p-1 md:p-2 space-y-2 flex-grow overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-1">Configure rules for NexOS to automatically respond to notifications.</p>
                
                <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="p-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Rule: Agent Offline Critical</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground sr-only">When an agent reports critical offline status.</CardDescription>
                        <div className="flex items-center gap-1.5">
                            <Switch defaultChecked id={`rule-offline-active`}/>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4 text-muted-foreground hover:text-primary"/></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1.5 text-xs">
                        <p className="text-xs text-muted-foreground mb-1">Trigger: When an agent reports critical offline status.</p>
                        <div>
                            <Label htmlFor="action-type-offline" className="text-xs mb-0.5 block text-muted-foreground">Action Type</Label>
                            <Select defaultValue="restart_agent">
                                <SelectTrigger id="action-type-offline" className="h-8 text-xs bg-input border-input focus:ring-primary">
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
                            <Label htmlFor="notify-channel-offline" className="text-xs mb-0.5 block text-muted-foreground">Notify Channel (if applicable)</Label>
                            <Input id="notify-channel-offline" placeholder="e.g., #ops-alerts (Slack)" className="h-8 text-xs bg-input border-input focus:ring-primary"/>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="p-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Rule: Low Disk Space</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground sr-only">When module storage exceeds 90% capacity.</CardDescription>
                        <div className="flex items-center gap-1.5">
                            <Switch id={`rule-disk-active`}/>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4 text-muted-foreground hover:text-primary"/></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </CardHeader>
                     <CardContent className="p-2 space-y-1.5 text-xs">
                        <p className="text-xs text-muted-foreground mb-1">Trigger: When module storage exceeds 90% capacity.</p>
                        <div>
                            <Label htmlFor="action-type-disk" className="text-xs mb-0.5 block text-muted-foreground">Action Type</Label>
                            <Select defaultValue="notify_user">
                                <SelectTrigger id="action-type-disk" className="h-8 text-xs bg-input border-input focus:ring-primary">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="notify_user">Notify User</SelectItem>
                                    <SelectItem value="archive_old">Archive Old Files</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <Image src="https://placehold.co/300x150.png" alt="Auto-action rule setup" width={300} height={150} className="rounded-md my-2 opacity-50 border border-border/60" data-ai-hint="rules engine interface logic" />
            </CardContent>
             <CardFooter className="p-2 md:p-3 border-t border-border/60">
                <Button variant="outline" className="w-full bg-card hover:bg-muted/60" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add New Auto-Action Rule</Button>
            </CardFooter>
        </Card>
    );
}


export default function NotificationsPage() {
  const notificationZoneConfigs: ZoneConfig[] = [
    {
      id: 'notificationsCenter',
      title: 'Notification Center',
      icon: <Bell className="w-4 h-4" />,
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
      icon: <Zap className="w-4 h-4" />,
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
      className="flex-grow p-1 md:p-2"
       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    />
  );
}

