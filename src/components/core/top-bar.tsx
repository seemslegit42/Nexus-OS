
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
  Bell, 
  Search, 
  Settings, 
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
  History
} from 'lucide-react';

const modules = [
  { name: 'Dashboard', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'Agent Console', href: '/agents', icon: <Cpu className="mr-2 h-4 w-4" /> },
  { name: 'Loom Studio', href: '/loom-studio', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { name: 'Command Center', href: '/command', icon: <Command className="mr-2 h-4 w-4" /> },
  { name: 'Modules', href: '/modules', icon: <SlidersHorizontal className="mr-2 h-4 w-4" /> },
  { name: 'File Vault', href: '/files', icon: <FileArchive className="mr-2 h-4 w-4" /> },
  { name: 'Billing', href: '/billing', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  { name: 'Logs & Audit', href: '/logs', icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { name: 'Updates', href: '/updates', icon: <History className="mr-2 h-4 w-4" /> },
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
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Cpu className="h-5 w-5" />
            <span className="sr-only">Agent Status</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

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
                  <a><Settings className="mr-2 h-4 w-4" /><span>Settings</span></a>
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
