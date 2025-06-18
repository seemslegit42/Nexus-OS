'use client';

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'; // Removed DialogTitle, DialogDescription as they are not directly used
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  House as Home,
  Lightning as Zap,
  GridFour as LayoutGrid,
  Cpu,
  Terminal as CommandIconCmdk,
  Briefcase,
  ListChecks,
  ShieldCheck,
  Users,
  GearSix as Settings2,
  ChatText as MessageSquare,
  ChartBarHorizontal as BarChart3,
  FileZip as FileArchive,
  GitMerge,
  Rocket,
  SignOut as LogOut,
  MagnifyingGlass as SearchIconLucide,
  FilePlus,
  Package,
  Palette,
  Info,
  Radio as RadioTower,
} from '@phosphor-icons/react'; // Removed Maximize, Minimize, Pin, Lightbulb as they were unused
import type { ReactNode } from 'react';

export interface CommandAction {
  id: string;
  group: string;
  name: string;
  keywords?: string[];
  icon?: ReactNode;
  perform: (
    closeDialog: () => void,
    router: ReturnType<typeof useRouter>
  ) => void;
}

interface CommandLauncherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allAvailableActions: CommandAction[] = [
  // Navigation
  {
    id: 'nav-dashboard',
    group: 'Navigation',
    name: 'Go to Home Dashboard',
    icon: <Home />,
    keywords: ['home', 'main'],
    perform: (close, r) => {
      r.push('/');
      close();
    },
  },
  {
    id: 'nav-loom-studio',
    group: 'Navigation',
    name: 'Go to Loom Studio',
    icon: <LayoutGrid />,
    keywords: ['workflow', 'visual', 'editor', 'autopilot'],
    perform: (close, r) => {
      r.push('/loom-studio');
      close();
    },
  },
  {
    id: 'nav-pulse',
    group: 'Navigation',
    name: 'Go to Pulse',
    icon: <RadioTower />,
    keywords: ['system status', 'live events', 'monitoring'],
    perform: (close, r) => {
      r.push('/pulse');
      close();
    },
  },
  {
    id: 'nav-agent-console',
    group: 'Navigation',
    name: 'Go to Agent Console',
    icon: <Cpu />,
    keywords: ['agents', 'manage', 'fleet'],
    perform: (close, r) => {
      r.push('/agents');
      close();
    },
  },
  {
    id: 'nav-command-cauldron',
    group: 'Navigation',
    name: 'Go to Command & Cauldron',
    icon: <CommandIconCmdk />,
    keywords: ['terminal', 'cli', 'prompt'],
    perform: (close, r) => {
      r.push('/command');
      close();
    },
  },
  {
    id: 'nav-logs',
    group: 'Navigation',
    name: 'Go to Logs & Audit',
    icon: <ListChecks />,
    keywords: ['activity', 'history', 'events'],
    perform: (close, r) => {
      r.push('/logs');
      close();
    },
  },
  {
    id: 'nav-security',
    group: 'Navigation',
    name: 'Go to Security Center',
    icon: <ShieldCheck />,
    keywords: ['threats', 'firewall', 'rbac'],
    perform: (close, r) => {
      r.push('/security');
      close();
    },
  },
  {
    id: 'nav-permissions',
    group: 'Navigation',
    name: 'Go to Permissions',
    icon: <Users />,
    keywords: ['access', 'roles', 'authz'],
    perform: (close, r) => {
      r.push('/permissions');
      close();
    },
  },
  {
    id: 'nav-settings',
    group: 'Navigation',
    name: 'Go to Settings',
    icon: <Settings2 />,
    keywords: ['config', 'preferences', 'profile'],
    perform: (close, r) => {
      r.push('/settings');
      close();
    },
  },
  {
    id: 'nav-notifications',
    group: 'Navigation',
    name: 'Go to Notifications',
    icon: <MessageSquare />,
    keywords: ['alerts', 'messages', 'updates'],
    perform: (close, r) => {
      r.push('/notifications');
      close();
    },
  },
  {
    id: 'nav-billing',
    group: 'Navigation',
    name: 'Go to Billing',
    icon: <BarChart3 />,
    keywords: ['subscription', 'payment', 'usage'],
    perform: (close, r) => {
      r.push('/billing');
      close();
    },
  },
  {
    id: 'nav-files',
    group: 'Navigation',
    name: 'Go to File Vault',
    icon: <FileArchive />,
    keywords: ['storage', 'documents', 'uploads'],
    perform: (close, r) => {
      r.push('/files');
      close();
    },
  },
  {
    id: 'nav-updates',
    group: 'Navigation',
    name: 'Go to OS Updates',
    icon: <GitMerge />,
    keywords: ['changelog', 'versions', 'release'],
    perform: (close, r) => {
      r.push('/updates');
      close();
    },
  },
  {
    id: 'nav-items',
    group: 'Navigation',
    name: 'Go to My Items',
    icon: <Briefcase />,
    keywords: ['projects', 'apps', 'services'],
    perform: (close, r) => {
      r.push('/home/items');
      close();
    },
  },
  {
    id: 'nav-explore',
    group: 'Navigation',
    name: 'Explore Marketplace',
    icon: <SearchIconLucide />,
    keywords: ['discover', 'templates', 'community'],
    perform: (close, r) => {
      r.push('/explore');
      close();
    },
  },
  {
    id: 'nav-submit-creation',
    group: 'Navigation',
    name: 'Submit Creation to Marketplace',
    icon: <FilePlus />,
    keywords: ['contribute', 'share'],
    perform: (close, r) => {
      r.push('/explore/submit');
      close();
    },
  },
  {
    id: 'nav-onboarding',
    group: 'Navigation',
    name: 'Run Onboarding Wizard',
    icon: <Rocket />,
    keywords: ['setup', 'guide', 'tutorial'],
    perform: (close, r) => {
      r.push('/onboarding');
      close();
    },
  },

  // Agent Actions
  {
    id: 'agent-spawn',
    group: 'Agent Actions',
    name: 'Spawn New Agent',
    icon: <Zap />,
    keywords: ['create agent', 'new bot'],
    perform: (close, r) => {
      r.push('/onboarding');
      close();
    },
  }, // Or a dedicated agent creation page
  {
    id: 'agent-manage',
    group: 'Agent Actions',
    name: 'Manage Agents',
    icon: <Cpu />,
    perform: (close, r) => {
      r.push('/agents');
      close();
    },
  },

  // Micro-App Actions (Admin)
  {
    id: 'microapp-manage',
    group: 'Admin Actions',
    name: 'Manage Micro-Apps',
    icon: <Package />,
    keywords: ['admin', 'registry', 'apps'],
    perform: (close, r) => {
      r.push('/admin/micro-apps');
      close();
    },
  },
  {
    id: 'microapp-register',
    group: 'Admin Actions',
    name: 'Register New Micro-App',
    icon: <FilePlus />,
    keywords: ['admin', 'add app'],
    perform: (close, r) => {
      r.push('/admin/micro-apps');
      close();
    },
  },

  // Item Actions
  {
    id: 'item-create',
    group: 'Item Actions',
    name: 'Create New Item',
    icon: <FilePlus />,
    keywords: ['new project', 'new app'],
    perform: (close, r) => {
      r.push('/home/items/new');
      close();
    },
  },

  // UI / System Actions
  {
    id: 'ui-theme-settings',
    group: 'System',
    name: 'Open Theme Settings',
    icon: <Palette />,
    perform: (close, r) => {
      r.push('/settings');
      close();
    },
  },
  {
    id: 'sys-logout',
    group: 'System',
    name: 'Log Out',
    icon: <LogOut />,
    keywords: ['sign out', 'exit'],
    perform: close => {
      console.log('Logging out...');
      close();
    },
  },
  {
    id: 'sys-docs',
    group: 'System',
    name: 'View Documentation',
    icon: <Info />,
    keywords: ['help', 'support', 'guide'],
    perform: (close, r) => {
      r.push('/docs');
      close();
    },
  },

  // Example of actions that don't navigate
  {
    id: 'action-console-log',
    group: 'Developer',
    name: 'Log "Hello NexOS" to console',
    icon: <Zap />,
    perform: close => {
      console.log('Hello NexOS from Command Launcher!');
      close();
    },
  },
];

export function CommandLauncherDialog({
  open,
  onOpenChange,
}: CommandLauncherDialogProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActions, setFilteredActions] = useState<CommandAction[]>([]);
  const [groupedActions, setGroupedActions] = useState<
    Record<string, CommandAction[]>
  >({});

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredActions([]);
      const grouped = allAvailableActions.reduce(
        (acc, action) => {
          const group = acc[action.group] || [];
          group.push(action);
          acc[action.group] = group;
          return acc;
        },
        {} as Record<string, CommandAction[]>
      );
      setGroupedActions(grouped);
      return;
    }

    const filtered = allAvailableActions.filter(
      action =>
        action.name.toLowerCase().includes(term) ||
        action.group.toLowerCase().includes(term) ||
        (action.keywords &&
          action.keywords.some(kw => kw.toLowerCase().includes(term)))
    );
    setFilteredActions(filtered);
    setGroupedActions({});
  }, [searchTerm]);

  const handleActionClick = (action: CommandAction) => {
    action.perform(() => onOpenChange(false), router);
  };

  const inputRef = useCallback(
    (inputElement: HTMLInputElement | null) => {
      if (inputElement && open) {
        inputElement.focus();
      }
    },
    [open]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[80vh] flex-col p-0 sm:max-w-2xl' // Keep existing layout and size constraints
          // The base DialogContent component in ui/dialog.tsx already provides:
          // rounded-2xl, border border-primary/25, bg-popover, backdrop-blur-md,
          // and shadow-[0_4px_30px_hsl(var(--primary)/0.12)]
          // So, no need to repeat or override those with '!' unless specifically different.
          // If a stronger blur or more opaque background is desired, it can be added here,
          // e.g., "bg-popover/80 backdrop-blur-lg", but for consistency, using base is preferred.
        )}
      >
        <DialogHeader className="border-b border-primary/20 px-4 pb-2 pt-4">
          <div className="flex items-center gap-2">
            <SearchIconLucide className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Type a command or search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-10 border-0 bg-transparent text-lg shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-0"
            />
          </div>
        </DialogHeader>
        <ScrollArea className="min-h-0 flex-grow">
          <div className="p-2 md:p-3">
            {searchTerm.trim() === '' &&
            Object.keys(groupedActions).length > 0 ? (
              Object.entries(groupedActions).map(([groupName, actions]) => (
                <Fragment key={groupName}>
                  <h3 className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {groupName}
                  </h3>
                  {actions.map(action => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      className="mb-0.5 h-auto w-full justify-start rounded-lg px-2 py-2.5 text-sm hover:bg-primary/15 focus:bg-primary/20"
                      onClick={() => handleActionClick(action)}
                    >
                      {action.icon && (
                        <span className="mr-2.5 flex h-5 w-5 items-center justify-center text-primary/90">
                          {React.cloneElement(
                            action.icon as React.ReactElement,
                            { className: 'h-4 w-4' }
                          )}
                        </span>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-foreground">{action.name}</span>
                        {action.keywords && searchTerm && (
                          <span className="max-w-full truncate text-xs text-muted-foreground/70">
                            {action.keywords.join(', ')}
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
                </Fragment>
              ))
            ) : filteredActions.length > 0 ? (
              filteredActions.map(action => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="mb-0.5 h-auto w-full justify-start rounded-lg px-2 py-2.5 text-sm hover:bg-primary/15 focus:bg-primary/20"
                  onClick={() => handleActionClick(action)}
                >
                  {action.icon && (
                    <span className="mr-2.5 flex h-5 w-5 items-center justify-center text-primary/90">
                      {React.cloneElement(action.icon as React.ReactElement, {
                        className: 'h-4 w-4',
                      })}
                    </span>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-foreground">{action.name}</span>
                    <span className="text-xs text-muted-foreground/70">
                      {action.group}
                    </span>
                  </div>
                </Button>
              ))
            ) : searchTerm.trim() !== '' ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results found for "{searchTerm}".
              </p>
            ) : null}
          </div>
        </ScrollArea>
        <div className="flex justify-end border-t border-primary/20 px-4 py-2 text-xs text-muted-foreground/70">
          ⚡ NexOS Command Launcher
        </div>
      </DialogContent>
    </Dialog>
  );
}
