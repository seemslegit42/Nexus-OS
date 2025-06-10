
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
  Settings as SettingsIcon, // Renamed to avoid conflict
  LogOut, 
  UserCircle, 
  Cpu, 
  ShieldAlert, 
  Grid3x3,
  Home,
  LayoutGrid,
  Command,
  SlidersHorizontal,
  FileArchive,
  BarChart3,
  ListChecks,
  History,
  Info,
  AlertTriangleIcon,
  CheckCircle2,
  Users, // For Permissions
  ShieldCheck, // For Security Center
  FileText, // For OS Updates (alternative to History)
  Settings2, // For Settings Page (alternative to SettingsIcon if needed for variety)
  Rocket, // For Onboarding
  Briefcase // For Modules (alternative to SlidersHorizontal)
} from 'lucide-react';

const modules = [
  { name: 'Dashboard', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { name: 'Agent Console', href: '/agents', icon: <Cpu className="mr-2 h-4 w-4" /> },
  { name: 'Logs & Audit', href: '/logs', icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { name: 'Modules', href: '/modules', icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { name: 'Settings', href: '/settings', icon: <SettingsIcon className="mr-2 h-4 w-4" /> },
  { name: 'Permissions', href: '/permissions', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Security Center', href: '/security', icon: <ShieldCheck className="mr-2 h-4 w-4" /> },
  { name: 'Command & Cauldron', href: '/command', icon: <Command className="mr-2 h-4 w-4" /> },
  { name: 'Alerts & Notifications', href: '/notifications', icon: <Bell className="mr-2 h-4 w-4" /> },
  { name: 'Billing & Usage', href: '/billing', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  { name: 'Onboarding Wizard', href: '/onboarding', icon: <Rocket className="mr-2 h-4 w-4" /> },
  { name: 'File Vault', href: '/files', icon: <FileArchive className="mr-2 h-4 w-4" /> },
  { name: 'OS Updates', href: '/updates', icon: <FileText className="mr-2 h-4 w-4" /> },
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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <NexosLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-foreground">NexOS</span>
          </Link>
          <span className="text-sm text-muted-foreground hidden md:block">/ CurrentContext</span>
        </div>

        <div className="flex-1 max-w-lg px-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Command or Search (Ctrl+K)..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border-border focus:ring-primary text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
                    <Link href={mod.href} key={mod.name} passHref>
                      <DropdownMenuItem asChild>
                        <a>
                          {mod.icon}
                          <span>{mod.name}</span>
                        </a>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
                      <div key={agent.name} className="grid grid-cols-[1fr_auto] items-center gap-x-2 p-2 rounded-md hover:bg-muted/30">
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
                          className={
                            agent.status === 'Active' || agent.status === 'Processing' ? 'bg-green-500/80 text-white min-w-[70px] text-center justify-center' : 
                            agent.status === 'Error' ? 'min-w-[70px] text-center justify-center' :
                            'min-w-[70px] text-center justify-center'
                          }
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
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <Bell className="h-5 w-5" />
                {recentNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
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
                      <div key={notif.id} className="flex items-start gap-3 p-2.5 rounded-md border border-border/50 hover:bg-muted/50">
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

          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <div className="text-xs hidden lg:block">
              <span className="text-foreground font-medium">Admin</span>
              <span className="text-muted-foreground"> | ax7...f3</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>NX</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none font-headline">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@nexos.ai
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/settings#profile" passHref>
                <DropdownMenuItem asChild>
                   <a><UserCircle className="mr-2 h-4 w-4" /><span>Profile</span></a>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings" passHref>
                <DropdownMenuItem asChild>
                  <a><SettingsIcon className="mr-2 h-4 w-4" /><span>Settings</span></a>
                </DropdownMenuItem>
              </Link>
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

    