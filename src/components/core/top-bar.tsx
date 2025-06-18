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
  MagnifyingGlass as Search,
  Gear as SettingsIcon,
  SignOut as LogOut,
  UserCircle,
  Cpu,
  House as Home,
  GridFour as LayoutGrid,
  Terminal as CommandIcon,
  Package,
  FileZip as FileArchive,
  ChartBarHorizontal as BarChart3,
  ListChecks,
  GitMerge,
  Users,
  ShieldCheck,
  GearSix as Settings2,
  Rocket,
  ChatText as MessageSquare,
  CaretUpDown as ChevronsUpDown,
  Lightning as LightningIcon,
  Radio as RadioTower,
  Clock,
  Power,
} from '@phosphor-icons/react';
import { CommandLauncherDialog } from './command-launcher';
import { AgentWorkloadPreview } from './AgentWorkloadPreview';
import { RecentNotificationsPopoverContent } from './RecentNotificationsPopoverContent';
import { ModuleSwitcherDropdownContent } from './ModuleSwitcherDropdownContent';
import { cn } from '@/lib/utils';

const navModules = [
  {
    name: 'Home Dashboard',
    href: '/home',
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Loom Studio',
    href: '/loom-studio',
    icon: <LayoutGrid className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Pulse',
    href: '/pulse',
    icon: <RadioTower className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Agent Console',
    href: '/agents',
    icon: <Cpu className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Command & Cauldron',
    href: '/command',
    icon: <CommandIcon className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Logs & Audit',
    href: '/logs',
    icon: <ListChecks className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Security Center',
    href: '/security',
    icon: <ShieldCheck className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Permissions',
    href: '/permissions',
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings2 className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: <MessageSquare className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
  },
  {
    name: 'File Vault',
    href: '/files',
    icon: <FileArchive className="mr-2 h-4 w-4" />,
  },
  {
    name: 'OS Updates',
    href: '/updates',
    icon: <GitMerge className="mr-2 h-4 w-4" />,
  },
];

export function TopBar() {
  const [isCommandLauncherOpen, setIsCommandLauncherOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [previousHour, setPreviousHour] = useState<number | null>(null);
  const [pulseClock, setPulseClock] = useState(false);
  const [isPersistentSession, setIsPersistentSession] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
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
        setTimeout(() => setPulseClock(false), 1000);
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [previousHour]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandLauncherOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentModule = useMemo(() => {
    if (pathname === '/home' || pathname.startsWith('/home/')) {
      return (
        navModules.find(mod => mod.href === '/home') || {
          name: 'NexOS Context',
          href: pathname,
          icon: (
            <NexosLogo className="h-4 w-4 text-[var(--accent-primary-color)]" />
          ),
        }
      );
    }
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

    const foundModule = sortedModules.find(mod =>
      pathname.startsWith(mod.href)
    );
    return (
      foundModule || {
        name: 'NexOS Context',
        href: pathname,
        icon: (
          <NexosLogo className="h-4 w-4 text-[var(--accent-primary-color)]" />
        ),
      }
    );
  }, [pathname]);

  const handleMarkAllNotificationsRead = () => {
    console.log('Marking all notifications as read...');
  };

  const iconButtonClass =
    'relative h-9 w-9 md:h-10 md:w-10 text-[var(--text-secondary-color)] hover:text-[var(--accent-primary-color)] hover:bg-[var(--accent-primary-color)]/10 transition-colors duration-150 ease-in-out focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--panel-background-color)] hover:shadow-[0_0_10px_1px_hsl(var(--primary)/0.3)] active:shadow-[0_0_15px_2px_hsl(var(--primary)/0.4)] rounded-full';

  const userRole = 'Admin';
  const sessionTimeLeft = '28m left';

  return (
    <>
      <header className="glass-card fixed left-0 right-0 top-0 z-50 h-16 border-b-0 shadow-[0_8px_32px_0_rgba(28,25,52,0.18)]">
        <div className="container mx-auto flex h-full items-center justify-between px-2 sm:px-4">
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/home"
              className="flex items-center gap-1.5 sm:gap-2"
              aria-label="NexOS Home"
            >
              <NexosLogo className="h-7 w-7 flex-shrink-0 text-[var(--accent-primary-color)] sm:h-8 sm:w-8" />
              <span className="hidden font-headline text-xl font-weight-bold text-text-primary-custom sm:inline sm:text-2xl">
                NexOS
              </span>
            </Link>

            <div
              className="relative ml-1 flex h-6 w-6 items-center justify-center sm:ml-2"
              title="BEEP System Heartbeat: Active"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary-color)] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-primary-color)]"></span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'hover:bg-[var(--accent-primary-color)]/10 flex h-9 items-center gap-1 truncate rounded-[var(--border-radius-small)] px-1.5 py-1 text-xs text-text-secondary-custom hover:text-text-primary-custom sm:h-10 sm:px-2 sm:text-sm',
                    'hover:shadow-[0_0_10px_1px_hsl(var(--primary)/0.2)] active:shadow-[0_0_15px_2px_hsl(var(--primary)/0.3)]',
                    'max-w-[40px] sm:max-w-[200px]'
                  )}
                  title={`Current: ${currentModule.name}`}
                >
                  <span className="flex-shrink-0">
                    {currentModule.icon &&
                      cloneElement(currentModule.icon as React.ReactElement, {
                        className:
                          'h-4 w-4 sm:h-5 sm-w-5 text-[var(--accent-primary-color)]',
                      })}
                  </span>
                  <span className="ml-1 hidden truncate sm:inline">
                    {currentModule.name}
                  </span>
                  <ChevronsUpDown className="ml-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {' '}
                {/* Uses themed Popover style via component */}
                <ModuleSwitcherDropdownContent modules={navModules} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden flex-1 justify-center px-2 sm:px-4 md:flex">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary-custom" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="backdrop-filter-[var(--panel-backdrop-filter)] h-9 w-full rounded-[var(--border-radius-small)] border-[var(--border-color-main)] bg-[var(--panel-background-color)] py-2 pl-10 pr-4 text-sm transition-shadow focus:border-primary/50 focus:shadow-[0_0_12px_-2px_hsl(var(--primary)/0.4)] focus:ring-1 focus:ring-[var(--accent-primary-color)]"
                onClick={() => setIsCommandLauncherOpen(true)}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconButtonClass, 'md:hidden')}
              onClick={() => setIsCommandLauncherOpen(true)}
              title="Search / Command (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search or Command</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconButtonClass, 'hidden md:flex')}
              onClick={() => setIsCommandLauncherOpen(true)}
              title="Command Launcher (Ctrl+K)"
            >
              <LightningIcon className="h-5 w-5" />
              <span className="sr-only">Open Command Launcher</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={iconButtonClass}
                  title="Agent Workload"
                >
                  <Cpu className="h-5 w-5" />
                  <span className="sr-only">Agent Workload</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                {' '}
                {/* Uses themed Popover style */}
                <AgentWorkloadPreview />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(iconButtonClass, 'relative')}
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {true && (
                    <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 sm:right-2 sm:top-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary-color)] opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-primary-color)]"></span>
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                {' '}
                {/* Uses themed Popover style */}
                <RecentNotificationsPopoverContent
                  onMarkAllRead={handleMarkAllNotificationsRead}
                />
              </PopoverContent>
            </Popover>

            <div
              className={cn(
                'backdrop-filter-[var(--panel-backdrop-filter)] hidden h-10 items-center gap-1.5 rounded-[var(--border-radius-small)] border border-[var(--border-color-main)] bg-[var(--panel-background-color)] p-1.5 pr-2.5 shadow-[var(--panel-box-shadow)] transition-all duration-300 lg:flex',
                pulseClock &&
                  'bg-[var(--accent-primary-color)]/20 shadow-[var(--accent-primary-color)]/20'
              )}
            >
              <Clock className="h-3.5 w-3.5 text-text-secondary-custom" />
              <span
                className={cn(
                  'text-xs tabular-nums text-text-secondary-custom transition-colors duration-300',
                  pulseClock &&
                    'font-weight-bold text-[var(--accent-primary-color)]'
                )}
              >
                {currentTime
                  ? currentTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'UTC',
                    })
                  : '--:--:--'}{' '}
                UTC
              </span>
            </div>

            <div className="backdrop-filter-[var(--panel-backdrop-filter)] hidden h-10 items-center gap-1.5 rounded-[var(--border-radius-small)] border border-[var(--border-color-main)] bg-[var(--panel-background-color)] p-1.5 pr-2.5 shadow-[var(--panel-box-shadow)] lg:flex">
              <ShieldCheck className="h-4 w-4 text-[var(--accent-primary-color)]" />
              <div className="text-xs">
                <span className="font-weight-bold text-text-primary-custom">
                  Role: {userRole}
                </span>
                <span className="text-text-secondary-custom">
                  {' '}
                  | Session:{' '}
                  {isPersistentSession ? 'Persistent' : sessionTimeLeft}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(iconButtonClass, 'p-0')}
                  title="User Menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://placehold.co/100x100.png"
                      alt="User Avatar"
                      data-ai-hint="user avatar"
                    />
                    <AvatarFallback>NX</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                {' '}
                {/* Uses themed Popover style */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="font-headline text-sm font-weight-bold text-text-primary-custom">
                      Alex Ryder
                    </p>
                    <p className="text-xs leading-none text-text-secondary-custom">
                      alex.ryder@nexos.ai
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="lg:hidden">
                  <div className="w-full text-xs">
                    <p>
                      <span className="font-weight-bold text-text-primary-custom">
                        Role:
                      </span>{' '}
                      {userRole}
                    </p>
                    <p>
                      <span className="font-weight-bold text-text-primary-custom">
                        Session:
                      </span>{' '}
                      {isPersistentSession ? 'Persistent' : sessionTimeLeft}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="lg:hidden" />
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
                    <Label
                      htmlFor="persistent-session-toggle"
                      className="flex cursor-pointer items-center gap-2 text-sm font-normal text-text-primary-custom"
                    >
                      <Power className="h-4 w-4 text-text-secondary-custom" />{' '}
                      Persistent Session
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
                <DropdownMenuItem
                  onClick={() => console.log('Log out action')}
                  className="text-destructive focus:text-destructive-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <CommandLauncherDialog
        open={isCommandLauncherOpen}
        onOpenChange={setIsCommandLauncherOpen}
      />
    </>
  );
}
