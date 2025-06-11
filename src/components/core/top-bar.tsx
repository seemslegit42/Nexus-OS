
import Link from 'next/link';
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
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  AlertTriangleIcon,
  CheckCircle2,
  Users, 
  ShieldCheck, 
  Settings2, 
  Rocket, 
  MessageSquare,
  ChevronsUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const modules = [
  { name: 'Dashboard', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
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

const recentNotifications = [
  { id: 1, type: 'error', title: 'Agent SecureGuard Offline', message: 'Agent has unexpectedly stopped.', time: '2m ago', icon: <AlertTriangleIcon className="h-4 w-4 text-destructive" /> },
  { id: 2, type: 'info', title: 'OS Update v1.1.0 Available', message: 'New version of NexOS ready for installation.', time: '1h ago', icon: <Info className="h-4 w-4 text-primary" /> },
  { id: 3, type: 'success', title: 'Task Completed by DataMinerX', message: 'Q3 sales data analysis finished.', time: '3h ago', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
  { id: 4, type: 'warning', title: 'Low Disk Space', message: 'Module storage is at 92% capacity.', time: '5h ago', icon: <AlertTriangleIcon className="h-4 w-4 text-yellow-500" /> },
];


export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-lg border-b border-border/70 shadow-sm">
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
              className="w-full pl-10 pr-4 py-2 rounded-md bg-background/70 border-input focus:ring-primary text-sm h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                <Grid3x3 className="h-5 w-5" />
                <span className="sr-only">Quick Switch Modules</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>Switch Module</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[calc(100vh_-_10rem)] max-h-[400px]">
                <DropdownMenuGroup>
                  {modules.map((mod) => (
                    <DropdownMenuItem key={mod.name} asChild>
                      <Link href={mod.href}>
                        {mod.icon}
                        <span>{mod.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </ScrollArea>
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
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none font-headline text-foreground">Active Agents</h4>
                  <p className="text-sm text-muted-foreground">
                    Quick overview of agent states.
                  </p>
                </div>
                <ScrollArea className="max-h-72">
                  <div className="grid gap-1 pr-1">
                    {activeAgentsInfo.map((agent) => (
                      <div key={agent.name} className="grid grid-cols-[1fr_auto] items-center gap-x-2 p-2 rounded-md hover:bg-muted/50">
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium leading-none text-foreground truncate">
                            {agent.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={agent.lastLog}>
                            {agent.tasks} active tasks - {agent.lastLog}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            agent.status === 'Active' || agent.status === 'Processing' ? 'default' : 
                            agent.status === 'Error' ? 'destructive' : 'secondary'
                          }
                          className={cn(
                            "min-w-[70px] text-center justify-center text-xs py-0.5 px-2 h-5",
                            (agent.status === 'Active' || agent.status === 'Processing') && 'bg-green-500/80 text-white'
                          )}
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/agents">View All Agents</Link>
                </Button>
              </div>
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
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium leading-none font-headline text-foreground">Recent Notifications</h4>
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto text-primary">Mark all as read</Button>
                </div>
                <ScrollArea className="max-h-80">
                  <div className="grid gap-2 pr-2">
                    {recentNotifications.map((notif) => (
                      <div key={notif.id} className="flex items-start gap-3 p-2.5 rounded-md border border-border/60 hover:bg-muted/50">
                        <div className="mt-0.5">{notif.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</p>
                      </div>
                    ))}
                    {recentNotifications.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
                    )}
                  </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/notifications">View All Notifications</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-md bg-muted/40 border border-transparent hover:border-border/50 transition-colors">
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
                 <Link href="/settings#userProfileSettings">
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
  );
}
