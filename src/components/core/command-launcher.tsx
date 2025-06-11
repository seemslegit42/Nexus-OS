
'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home, Zap, LayoutGrid, Cpu, Command as CommandIconCmdk, Briefcase,
  ListChecks, ShieldCheck, Users, Settings2, MessageSquare, BarChart3,
  FileArchive, GitMerge, Rocket, LogOut, Search as SearchIconLucide, ExternalLink,
  FilePlus, Package, Maximize, Minimize, Pin, Lightbulb, Palette, Info
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface CommandAction {
  id: string;
  group: string;
  name: string;
  keywords?: string[];
  icon?: ReactNode;
  perform: (closeDialog: () => void, router: ReturnType<typeof useRouter>) => void;
}

interface CommandLauncherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandLauncherDialog({ open, onOpenChange }: CommandLauncherDialogProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActions, setFilteredActions] = useState<CommandAction[]>([]);
  const [groupedActions, setGroupedActions] = useState<Record<string, CommandAction[]>>({});

  const allAvailableActions: CommandAction[] = [
    // Navigation
    { id: 'nav-dashboard', group: 'Navigation', name: 'Go to Dashboard', icon: <Home />, keywords: ['home', 'main'], perform: (close, r) => { r.push('/'); close(); } },
    { id: 'nav-loom-studio', group: 'Navigation', name: 'Go to Loom Studio', icon: <LayoutGrid />, keywords: ['workflow', 'visual', 'editor'], perform: (close, r) => { r.push('/loom-studio'); close(); } },
    { id: 'nav-agent-console', group: 'Navigation', name: 'Go to Agent Console', icon: <Cpu />, keywords: ['agents', 'manage', 'fleet'], perform: (close, r) => { r.push('/agents'); close(); } },
    { id: 'nav-command-cauldron', group: 'Navigation', name: 'Go to Command & Cauldron', icon: <CommandIconCmdk />, keywords: ['terminal', 'cli', 'prompt'], perform: (close, r) => { r.push('/command'); close(); } },
    { id: 'nav-modules', group: 'Navigation', name: 'Go to Modules', icon: <Package />, keywords: ['extensions', 'plugins', 'features'], perform: (close, r) => { r.push('/modules'); close(); } },
    { id: 'nav-logs', group: 'Navigation', name: 'Go to Logs & Audit', icon: <ListChecks />, keywords: ['activity', 'history', 'events'], perform: (close, r) => { r.push('/logs'); close(); } },
    { id: 'nav-security', group: 'Navigation', name: 'Go to Security Center', icon: <ShieldCheck />, keywords: ['threats', 'firewall', 'rbac'], perform: (close, r) => { r.push('/security'); close(); } },
    { id: 'nav-permissions', group: 'Navigation', name: 'Go to Permissions', icon: <Users />, keywords: ['access', 'roles', 'authz'], perform: (close, r) => { r.push('/permissions'); close(); } },
    { id: 'nav-settings', group: 'Navigation', name: 'Go to Settings', icon: <Settings2 />, keywords: ['config', 'preferences', 'profile'], perform: (close, r) => { r.push('/settings'); close(); } },
    { id: 'nav-notifications', group: 'Navigation', name: 'Go to Notifications', icon: <MessageSquare />, keywords: ['alerts', 'messages', 'updates'], perform: (close, r) => { r.push('/notifications'); close(); } },
    { id: 'nav-billing', group: 'Navigation', name: 'Go to Billing', icon: <BarChart3 />, keywords: ['subscription', 'payment', 'usage'], perform: (close, r) => { r.push('/billing'); close(); } },
    { id: 'nav-files', group: 'Navigation', name: 'Go to File Vault', icon: <FileArchive />, keywords: ['storage', 'documents', 'uploads'], perform: (close, r) => { r.push('/files'); close(); } },
    { id: 'nav-updates', group: 'Navigation', name: 'Go to OS Updates', icon: <GitMerge />, keywords: ['changelog', 'versions', 'release'], perform: (close, r) => { r.push('/updates'); close(); } },
    { id: 'nav-explore', group: 'Navigation', name: 'Explore Marketplace', icon: <SearchIconLucide />, keywords: ['discover', 'templates', 'community'], perform: (close, r) => { r.push('/explore'); close(); } },
    { id: 'nav-submit-creation', group: 'Navigation', name: 'Submit Creation to Marketplace', icon: <FilePlus />, keywords: ['contribute', 'share'], perform: (close, r) => { r.push('/explore/submit'); close(); } },
    { id: 'nav-onboarding', group: 'Navigation', name: 'Run Onboarding Wizard', icon: <Rocket />, keywords: ['setup', 'guide', 'tutorial'], perform: (close, r) => { r.push('/onboarding'); close(); } },

    // Agent Actions
    { id: 'agent-spawn', group: 'Agent Actions', name: 'Spawn New Agent', icon: <Zap />, keywords: ['create agent', 'new bot'], perform: (close, r) => { r.push('/onboarding'); close(); } },
    { id: 'agent-manage', group: 'Agent Actions', name: 'Manage Agents', icon: <Cpu />, perform: (close, r) => { r.push('/agents'); close(); } },

    // Module Actions
    { id: 'module-manage', group: 'Module Actions', name: 'Manage Modules', icon: <Package />, perform: (close, r) => { r.push('/modules'); close(); } },
    { id: 'module-create', group: 'Module Actions', name: 'Create New Module', icon: <FilePlus />, perform: (close, r) => { router.push('/modules'); /* TODO: Scroll to editor or open create modal */ close(); } },
    
    // UI / System Actions
    { id: 'ui-theme-settings', group: 'System', name: 'Open Theme Settings', icon: <Palette />, perform: (close, r) => { r.push('/settings'); /* TODO: scroll to theme section */ close(); } },
    { id: 'sys-logout', group: 'System', name: 'Log Out', icon: <LogOut />, keywords: ['sign out', 'exit'], perform: (close) => { console.log('Logging out...'); /* Actual logout logic */ close(); } },
    { id: 'sys-docs', group: 'System', name: 'View Documentation', icon: <Info />, keywords: ['help', 'support', 'guide'], perform: (close, r) => { r.push('/docs'); close(); } },

    // Example of actions that don't navigate
    { id: 'action-console-log', group: 'Developer', name: 'Log "Hello NexOS" to console', icon: <Lightbulb />, perform: (close) => { console.log("Hello NexOS from Command Launcher!"); close(); } },
  ];

  useEffect(() => {
    if (!open) {
      setSearchTerm(''); // Reset search term when dialog closes
    }
  }, [open]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredActions([]);
      // Group all actions if search is empty
      const grouped = allAvailableActions.reduce((acc, action) => {
        const group = acc[action.group] || [];
        group.push(action);
        acc[action.group] = group;
        return acc;
      }, {} as Record<string, CommandAction[]>);
      setGroupedActions(grouped);
      return;
    }

    const filtered = allAvailableActions.filter(action =>
      action.name.toLowerCase().includes(term) ||
      action.group.toLowerCase().includes(term) ||
      (action.keywords && action.keywords.some(kw => kw.toLowerCase().includes(term)))
    );
    setFilteredActions(filtered);
    setGroupedActions({}); // Clear groups when searching
  }, [searchTerm, allAvailableActions]);

  const handleActionClick = (action: CommandAction) => {
    action.perform(() => onOpenChange(false), router);
  };

  const inputRef = useCallback((inputElement: HTMLInputElement | null) => {
    if (inputElement && open) {
      inputElement.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-2xl max-h-[80vh] flex flex-col border-border/70 shadow-2xl">
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-border/60">
           <div className="flex items-center gap-2">
             <SearchIconLucide className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Type a command or search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 text-lg border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/80"
            />
           </div>
        </DialogHeader>
        <ScrollArea className="flex-grow min-h-0">
          <div className="p-2 md:p-3">
            {searchTerm.trim() === '' && Object.keys(groupedActions).length > 0 ? (
              Object.entries(groupedActions).map(([groupName, actions]) => (
                <Fragment key={groupName}>
                  <h3 className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">{groupName}</h3>
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2.5 px-2 text-sm mb-0.5"
                      onClick={() => handleActionClick(action)}
                    >
                      {action.icon && <span className="mr-2.5 text-primary/90 w-5 h-5 flex items-center justify-center">{action.icon}</span>}
                      <div className="flex flex-col items-start">
                        <span className="text-foreground">{action.name}</span>
                        {action.keywords && searchTerm && (
                             <span className="text-xs text-muted-foreground/70 truncate max-w-full">
                                {action.keywords.join(', ')}
                            </span>
                        )}
                      </div>
                    </Button>
                  ))}
                </Fragment>
              ))
            ) : filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start h-auto py-2.5 px-2 text-sm mb-0.5"
                  onClick={() => handleActionClick(action)}
                >
                  {action.icon && <span className="mr-2.5 text-primary/90 w-5 h-5 flex items-center justify-center">{action.icon}</span>}
                   <div className="flex flex-col items-start">
                        <span className="text-foreground">{action.name}</span>
                        <span className="text-xs text-muted-foreground/70">{action.group}</span>
                    </div>
                </Button>
              ))
            ) : searchTerm.trim() !== '' ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No results found for "{searchTerm}".</p>
            ) : null}
          </div>
        </ScrollArea>
         <div className="px-4 py-2 border-t border-border/60 text-xs text-muted-foreground flex justify-end">
              ⚡ NexOS Command Launcher
        </div>
      </DialogContent>
    </Dialog>
  );
}

