
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
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
  // Grid3x3, // Replaced by specific module icons in switcher trigger
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
} from 'lucide-react';
import { CommandLauncherDialog } from './command-launcher';
import { ActiveAgentsPopoverContent } from './ActiveAgentsPopoverContent';
import { RecentNotificationsPopoverContent } from './RecentNotificationsPopoverContent';
import { ModuleSwitcherDropdownContent } from './ModuleSwitcherDropdownContent';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const navModules = [
  { name: 'Dashboard', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { name: 'Pulse', href: '/pulse', icon: <RadioTower className="mr-2 h-4 w-4" /> },
  { name: 'Agent Console', href: '/agents', icon: <Cpu className="mr-2 h-4 w-4" /> },
  { name: 'Command & Cauldron', href: '/command', icon: <CommandIcon className="mr-2 h-4 w-4" /> },
  { name: 'Modules', href: '/modules', icon: <Package className="mr-2 h-4 w-4" /> },
  { name: 'Logs & Audit', href: '/logs', icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { name: 'Security Center', href: '/security', icon: <ShieldCheck className="mr-2 h-4 w-4" /> },
  { name: 'Permissions', href: '/permissions', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Settings', href: '/settings', icon: <Settings2 className="mr-2 h-4 w-4" /> },
  { name: 'Notifications', href: '/notifications', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  { name: 'Billing', href: '/billing', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  { name: 'File Vault', href: '/files', icon: <FileArchive className="mr-2 h-4 w-4" /> },
  { name: 'OS Updates', href: '/updates', icon: <GitMerge className="mr-2 h-4 w-4" /> },
  { name: 'Onboarding', href: '/onboarding', icon: <Rocket className="mr-2 h-4 w-4" /> },
];

export function TopBar() {
  const [isCommandLauncherOpen, setIsCommandLauncherOpen] = useState(false);
  const pathname = usePathname();

  const currentModule = useMemo(() => {
    const sortedModules = [...navModules].sort((a, b) => {
      // Prioritize exact matches or longer paths for more specific matching
      if (a.href === pathname) return -1;
      if (b.href === pathname) return 1;
      if (pathname.startsWith(a.href) && pathname.startsWith(b.href)) {
        return b.href.length - a.href.length;
      }
      if (pathname.startsWith(a.href)) return -1;
      if (pathname.startsWith(b.href)) return 1;
      return b.href.length - a.href.length;
    });

    let foundModule = sortedModules.find(mod => pathname.startsWith(mod.href));
    
    // Handle root path explicitly
    if (pathname === '/') {
      foundModule = navModules.find(mod => mod.href === '/');
    }
    
    return foundModule || { name: 'NexOS', href: pathname, icon: <NexosLogo className="h-4 w-4 text-primary" /> };
  }, [pathname]);


  useEffect(() => {
    console.log(`TopBar Context Update: Active Module - ${currentModule.name}, Path: ${pathname}`);
    // Add more TopBar state logging if needed (e.g., popover states, command launcher open/closed)
    // console.log(`TopBar State: CommandLauncherOpen=${isCommandLauncherOpen}`);
  }, [currentModule, pathname, isCommandLauncherOpen]);


  const handleMarkAllNotificationsRead = () => {
    console.log("Marking all notifications as read...");
  };

  const iconButtonClass = "h-9 w-9 md:h-10 md:w-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150 ease-in-out focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background hover:shadow-[0_0_10px_1px_hsl(var(--primary)/0.2)] active:shadow-[0_0_15px_2px_hsl(var(--primary)/0.3)]";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-lg border-b border-border/60 shadow-sm">
        <div className="container mx-auto h-full flex items-center justify-between px-2 sm:px-4">
          {/* Left Section: Logo and Context/Module Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2" aria-label="NexOS Home">
              <NexosLogo className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              <span className="hidden sm:inline text-xl sm:text-2xl font-headline font-bold text-foreground">NexOS</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 px-1.5 sm:px-2 py-1 h-9 sm:h-10 max-w-[120px] sm:max-w-[200px] truncate hover:shadow-[0_0_10px_1px_hsl(var(--primary)/0.2)] active:shadow-[0_0_15px_2px_hsl(var(--primary)/0.3)]"
                  title={`Current: ${currentModule.name}`}
                >
                  <span className="inline-block sm:hidden flex-shrink-0">
                    {currentModule.icon && React.cloneElement(currentModule.icon as React.ReactElement, { className: "h-4 w-4 sm:h-5 sm:w-5" })}
                  </span>
                  <span className="hidden sm:inline truncate">{currentModule.name}</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-70 flex-shrink-0 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <ModuleSwitcherDropdownContent modules={navModules} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center Section: Search (Desktop) */}
          <div className="flex-1 px-2 sm:px-4 hidden md:flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-input border-input/70 focus:ring-1 focus:ring-primary text-sm h-9 focus:border-primary/70 focus:shadow-[0_0_12px_-2px_hsl(var(--primary)/0.4)] transition-shadow"
                onClick={() => setIsCommandLauncherOpen(true)} // Use onClick for better mobile tap detection to open
                readOnly // Make it readOnly to ensure CommandLauncher opens
              />
            </div>
          </div>

          {/* Right Section: Actions & User Menu */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconButtonClass, "md:hidden")} // Search icon for mobile to open Command Launcher
              onClick={() => setIsCommandLauncherOpen(true)}
              title="Search / Command (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search or Command</span>
            </Button>
             <Button
                variant="ghost"
                size="icon"
                className={cn(iconButtonClass, "hidden md:flex")} // Lightning icon for desktop Command Launcher
                onClick={() => setIsCommandLauncherOpen(true)}
                title="Command Launcher (Ctrl+K)"
              >
                <LightningIcon className="h-5 w-5" />
                <span className="sr-only">Open Command Launcher</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={iconButtonClass}>
                  <Cpu className="h-5 w-5" />
                  <span className="sr-only">Agent Status</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <ActiveAgentsPopoverContent />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(iconButtonClass, "relative")}>
                  <Bell className="h-5 w-5" />
                  {true && ( // Simulate unread notifications badge
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

            <div className="hidden lg:flex items-center gap-1.5 p-1.5 pr-2.5 rounded-md bg-input/50 border border-transparent hover:border-border/50 transition-colors h-10">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <span className="text-foreground font-medium">Admin</span>
                <span className="text-muted-foreground"> | ax7...f3</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(iconButtonClass, "relative rounded-full p-0")}>
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


    