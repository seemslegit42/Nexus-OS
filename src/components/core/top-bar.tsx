
'use client'; 

import Link from 'next/link';
import { useState } from 'react'; 
import { NexosLogo } from '@/components/icons/nexos-logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  Search, 
  Settings as SettingsIcon, 
  LogOut, 
  UserCircle, 
  Cpu, 
  ShieldAlert, 
  Grid3x3,
  Home,
  LayoutGrid, 
  Command as CommandIcon, 
  Briefcase, 
  FileArchive, 
  BarChart3, 
  ListChecks, 
  GitMerge, 
  Info,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle2,
  Users, 
  ShieldCheck, 
  Settings2, 
  Rocket, 
  MessageSquare,
  ChevronsUpDown,
  Zap as LightningIcon,
  RadioTower // Added RadioTower
} from 'lucide-react';
import { CommandLauncherDialog } from './command-launcher'; 
import { ActiveAgentsPopoverContent } from './ActiveAgentsPopoverContent';
import { RecentNotificationsPopoverContent, type NotificationItem } from './RecentNotificationsPopoverContent';
import { ModuleSwitcherDropdownContent } from './ModuleSwitcherDropdownContent';

const modules = [
  { name: 'Dashboard', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { name: 'Pulse', href: '/pulse', icon: <RadioTower className="mr-2 h-4 w-4" /> }, // Added Pulse
  { name: 'Agent Console', href: '/agents', icon: <Cpu className="mr-2 h-4 w-4" /> },
  { name: 'Command & Cauldron', href: '/command', icon: <CommandIcon className="mr-2 h-4 w-4" /> },
  { name: 'Modules', href: '/modules', icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { name: 'Logs & Audit', href: '/logs', icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { name: 'Security Center', href: '/security', icon: <ShieldCheck className="mr-2 h-4 w-4" /> },
  { name: 'Permissions', href: '/permissions', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Settings', href: '/settings', icon: <Settings2 className="mr-2 h-4 w-4" /> },
  { name: 'Alerts & Notifications', href: '/notifications', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  { name: 'Billing & Usage', href: '/billing', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  { name: 'File Vault', href: '/files', icon: <FileArchive className="mr-2 h-4 w-4" /> },
  { name: 'OS Updates', href: '/updates', icon: <GitMerge className="mr-2 h-4 w-4" /> },
  { name: 'Onboarding Wizard', href: '/onboarding', icon: <Rocket className="mr-2 h-4 w-4" /> },
];

const activeAgentsInfo = [
  { name: "OptimizerPrime", status: "Active", tasks: 3, lastLog: "Optimized frontend performance module for Project Zeta." },
  { name: "DataMinerX", status: "Idle", tasks: 0, lastLog: "Quarterly sales data scan complete, no new anomalies." },
  { name: "SecureGuard", status: "Error", tasks: 1, lastLog: "Critical: Anomaly detected in auth service. Escalated." },
  { name: "ContentCreatorAI", status: "Processing", tasks: 1, lastLog: "Generating weekly social media engagement report." },
  { name: "SysMonitor", status: "Active", tasks: 5, lastLog: "Network latency check normal, CPU usage stable." },
];

const recentNotifications: NotificationItem[] = [
  { id: 1, type: 'error', title: 'Agent SecureGuard Offline', message: 'Agent has unexpectedly stopped.', time: '2m ago', icon: <AlertTriangleIcon className="h-4 w-4 text-destructive" /> },
  { id: 2, type: 'info', title: 'OS Update v1.1.0 Available', message: 'New version of NexOS ready for installation.', time: '1h ago', icon: <Info className="h-4 w-4 text-primary" /> },
  { id: 3, type: 'success', title: 'Task Completed by DataMinerX', message: 'Q3 sales data analysis finished.', time: '3h ago', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
  { id: 4, type: 'warning', title: 'Low Disk Space', message: 'Module storage is at 92% capacity.', time: '5h ago', icon: <AlertTriangleIcon className="h-4 w-4 text-yellow-500" /> },
];


export function TopBar() {
  const [isCommandLauncherOpen, setIsCommandLauncherOpen] = useState(false);

  // Placeholder for marking all notifications as read
  const handleMarkAllNotificationsRead = () => {
    console.log("Marking all notifications as read...");
    // Here you would typically update state or call an API
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <NexosLogo className="h-8 w-8 text-primary" />
              <span className="text-2xl font-headline font-bold text-foreground">NexOS</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 h-auto">
                  <span>/ CurrentContext</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Switch Context</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Project Alpha</DropdownMenuItem>
                <DropdownMenuItem>Personal Workspace</DropdownMenuItem>
                <DropdownMenuItem>Shared Dev Environment</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          <div className="flex-1 max-w-lg px-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-input border-input focus:ring-primary text-sm h-9"
                onFocus={() => setIsCommandLauncherOpen(true)} 
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1"> 
             <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-9 w-9"
                onClick={() => setIsCommandLauncherOpen(true)}
                title="Command Launcher (Ctrl+K)"
              >
                <LightningIcon className="h-5 w-5" />
                <span className="sr-only">Open Command Launcher</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                  <Grid3x3 className="h-5 w-5" />
                  <span className="sr-only">Quick Switch Modules</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <ModuleSwitcherDropdownContent modules={modules} />
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                  <Cpu className="h-5 w-5" />
                  <span className="sr-only">Agent Status</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <ActiveAgentsPopoverContent agents={activeAgentsInfo} />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative h-9 w-9">
                  <Bell className="h-5 w-5" />
                  {recentNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <RecentNotificationsPopoverContent 
                  notifications={recentNotifications} 
                  onMarkAllRead={handleMarkAllNotificationsRead} 
                />
              </PopoverContent>
            </Popover>

            <div className="hidden md:flex items-center gap-1.5 p-1.5 pr-2.5 rounded-md bg-input border border-transparent hover:border-border/50 transition-colors">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <div className="text-xs hidden lg:block">
                <span className="text-foreground font-medium">Admin</span>
                <span className="text-muted-foreground"> | ax7...f3</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>NX</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none font-headline">Alex Ryder</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      alex.ryder@nexos.ai
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/account/profile"> 
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <CommandLauncherDialog open={isCommandLauncherOpen} onOpenChange={setIsCommandLauncherOpen} />
    </>
  );
}
