
'use client';

import React, { useState, useEffect, useMemo, cloneElement } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Bell,
  Search,
  Settings as SettingsIcon,
  LogOut,
  UserCircle,
  Cpu,
  Home,
  LayoutGrid,
  Command as CommandIcon,
  Package,
  FileArchive,
  BarChart3,
  ListChecks,
  GitMerge,
  Users,
  ShieldCheck,
  Settings2,
  Rocket,
  MessageSquare,
  ChevronsUpDown,
  Zap as LightningIcon,
  RadioTower,
  Clock,
  Power,
} from 'lucide-react';
import { CommandLauncherDialog } from './command-launcher';
import { AgentWorkloadPreview } from './AgentWorkloadPreview';
import { RecentNotificationsPopoverContent } from './RecentNotificationsPopoverContent';
import { ModuleSwitcherDropdownContent } from './ModuleSwitcherDropdownContent';
import { cn } from '@/lib/utils';

const navModules = [
  { name: 'Home Dashboard', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { name: 'Pulse', href: '/pulse', icon: <RadioTower className="mr-2 h-4 w-4" /> },
  { name: 'Agent Console', href: '/agents', icon: <Cpu className="mr-2 h-4 w-4" /> },
  { name: 'Command & Cauldron', href: '/command', icon: <CommandIcon className="mr-2 h-4 w-4" /> },
  { name: 'Logs & Audit', href: '/logs', icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { name: 'Security Center', href: '/security', icon: <ShieldCheck className="mr-2 h-4 w-4" /> },
  { name: 'Permissions', href: '/permissions', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Settings', href: '/settings', icon: <Settings2 className="mr-2 h-4 w-4" /> },
  { name: 'Notifications', href: '/notifications', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  { name: 'Billing', href: '/billing', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  { name: 'File Vault', href: '/files', icon: <FileArchive className="mr-2 h-4 w-4" /> },
  { name: 'OS Updates', href: '/updates', icon: <GitMerge className="mr-2 h-4 w-4" /> },
];

export function TopBar() {
  const [isCommandLauncherOpen, setIsCommandLauncherOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null); // Initialize to null
  const [previousHour, setPreviousHour] = useState<number | null>(null); // Initialize to null
  const [pulseClock, setPulseClock] = useState(false);
  const [isPersistentSession, setIsPersistentSession] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // Set initial time and previousHour on mount (client-side)
    const now = new Date();
    setCurrentTime(now);
    setPreviousHour(now.getHours());

    const timerId = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      const currentHour = newTime.getHours();
      if (previousHour !== null && currentHour !== previousHour) {
        setPreviousHour(currentHour);
        setPulseClock(true);
        setTimeout(() => setPulseClock(false), 1000); // Pulse duration
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [previousHour]); // Rerun effect if previousHour changes (though it's set inside)
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandLauncherOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const currentModule = useMemo(() => {
    const sortedModules = [...navModules].sort((a, b) => {
      if (pathname === a.href) return -1;
      if (pathname === b.href) return 1;
      if (pathname.startsWith(a.href) && pathname.startsWith(b.href)) {
        return b.href.length - a.href.length;
      }
      if (pathname.startsWith(a.href)) return -1;
      if (pathname.startsWith(b.href)) return 1;
      return b.href.length - a.href.length; 
    });
    
    let foundModule = sortedModules.find(mod => pathname.startsWith(mod.href));
    
    if (pathname === '/' || pathname.startsWith('/home/items')) {
      foundModule = navModules.find(mod => mod.href === '/');
    }

    return foundModule || { name: 'NexOS Context', href: pathname, icon: <NexosLogo className="h-4 w-4 text-primary" /> };
  }, [pathname]);

  const handleMarkAllNotificationsRead = () => {
    // Placeholder: Implement actual logic
    console.log("Marking all notifications as read...");
  };

  const iconButtonClass = "relative h-9 w-9 md:h-10 md:w-10 text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors duration-150 ease-in-out focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background hover:shadow-[0_0_10px_1px_hsl(var(--primary)/0.3)] active:shadow-[0_0_15px_2px_hsl(var(--primary)/0.4)] rounded-full";

  // Mock data, replace with actual data from auth/session context
  const userRole = "Admin";
  const sessionTimeLeft = "28m left"; 

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/30 backdrop-blur-lg border-b border-primary/20 shadow-[0_2px_15px_hsl(var(--primary)/0.1)]">
        <div className="container mx-auto h-full flex items-center justify-between px-2 sm:px-4">
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2" aria-label="NexOS Home">
              <NexosLogo className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <span className="hidden sm:inline text-xl sm:text-2xl font-headline font-bold text-foreground">NexOS</span>
            </Link>
            
            {/* BEEP Heartbeat */}
            <div className="relative flex items-center justify-center h-6 w-6 ml-1 sm:ml-2" title="BEEP System Heartbeat: Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </div>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-1.5 sm:px-2 py-1 h-9 sm:h-10 truncate rounded-lg", 
                    "hover:shadow-[0_0_10px_1px_hsl(var(--primary)/0.2)] active:shadow-[0_0_15px_2px_hsl(var(--primary)/0.3)]",
                    "max-w-[40px] sm:max-w-[200px]" 
                  )}
                  title={`Current: ${currentModule.name}`}
                >
                  <span className="flex-shrink-0">
                     {currentModule.icon && cloneElement(currentModule.icon as React.ReactElement, { className: "h-4 w-4 sm:h-5 sm-w-5 text-primary" })}
                  </span>
                  <span className="hidden sm:inline truncate ml-1">{currentModule.name}</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-70 flex-shrink-0 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <ModuleSwitcherDropdownContent modules={navModules} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 px-2 sm:px-4 hidden md:flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-input border-primary/25 focus:ring-1 focus:ring-primary text-sm h-9 focus:border-primary/50 focus:shadow-[0_0_12px_-2px_hsl(var(--primary)/0.4)] transition-shadow backdrop-blur-sm" 
                onClick={() => setIsCommandLauncherOpen(true)}
                readOnly 
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconButtonClass, "md:hidden")} 
              onClick={() => setIsCommandLauncherOpen(true)}
              title="Search / Command (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search or Command</span>
            </Button>
             <Button
                variant="ghost"
                size="icon"
                className={cn(iconButtonClass, "hidden md:flex")} 
                onClick={() => setIsCommandLauncherOpen(true)}
                title="Command Launcher (Ctrl+K)"
              >
                <LightningIcon className="h-5 w-5" />
                <span className="sr-only">Open Command Launcher</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={iconButtonClass} title="Agent Workload">
                  <Cpu className="h-5 w-5" />
                  <span className="sr-only">Agent Workload</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <AgentWorkloadPreview /> 
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(iconButtonClass, "relative")} title="Notifications">
                  <Bell className="h-5 w-5" />
                  {true && ( // Placeholder for unread notifications indicator
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <RecentNotificationsPopoverContent
                  onMarkAllRead={handleMarkAllNotificationsRead}
                />
              </PopoverContent>
            </Popover>
            
            <div className={cn(
              "hidden lg:flex items-center gap-1.5 p-1.5 pr-2.5 rounded-lg bg-input/30 backdrop-blur-sm border border-primary/20 h-10 shadow-sm transition-all duration-300",
              pulseClock && "bg-primary/20 shadow-primary/20"
            )}>
                <Clock className="h-3.5 w-3.5 text-muted-foreground"/>
                <span className={cn("text-xs text-muted-foreground tabular-nums transition-colors duration-300", pulseClock && "text-primary font-medium")}>
                    {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }) : '--:--:--'} UTC
                </span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 p-1.5 pr-2.5 rounded-lg bg-input/30 backdrop-blur-sm border border-primary/20 h-10 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-primary" /> 
              <div className="text-xs">
                <span className="text-foreground font-medium">Role: {userRole}</span>
                <span className="text-muted-foreground"> | Session: {isPersistentSession ? 'Persistent' : sessionTimeLeft}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(iconButtonClass, "p-0")} title="User Menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>NX</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount> {/* Increased width for new item */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none font-headline text-foreground">Alex Ryder</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      alex.ryder@nexos.ai
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem className="lg:hidden"> {/* Shown only on smaller than LG screens */}
                    <div className="text-xs w-full">
                        <p><span className="font-medium text-foreground">Role:</span> {userRole}</p>
                        <p><span className="font-medium text-foreground">Session:</span> {isPersistentSession ? 'Persistent' : sessionTimeLeft}</p>
                    </div>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator className="lg:hidden"/>
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
                <DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center justify-between p-2 focus:bg-transparent">
                    <Label htmlFor="persistent-session-toggle" className="text-sm font-normal flex items-center gap-2 cursor-pointer">
                      <Power className="h-4 w-4 text-muted-foreground" /> Persistent Session
                    </Label>
                    <Switch
                      id="persistent-session-toggle"
                      checked={isPersistentSession}
                      onCheckedChange={setIsPersistentSession}
                      aria-label="Toggle persistent session"
                    />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log('Log out action')} className="text-destructive focus:text-destructive-foreground">
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
