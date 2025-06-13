
'use client';

import React from 'react'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cpu, RadioTower, Bell, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center flex-1 group py-1"> {/* Added py-1 for touch target */}
      <div
        className={cn(
          'p-2 rounded-xl transition-colors duration-200 ease-in-out mb-0.5', // rounded-xl
          isActive ? 'bg-primary/20' : 'group-hover:bg-muted/30'
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn(
            'h-5 w-5 transition-colors duration-200 ease-in-out', // Slightly smaller icon for bottom nav
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          ),
        })}
      </div>
      <span
        className={cn(
          'text-[10px] transition-colors duration-200 ease-in-out', // Smaller label
          isActive ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <Home />, label: 'Home' },
    { href: '/agents', icon: <Cpu />, label: 'Agents' },
    // Placeholder for FAB
    { href: '/pulse', icon: <RadioTower />, label: 'Pulse' },
    { href: '/notifications', icon: <Bell />, label: 'Alerts' },
  ];

  const itemsWithPlaceholder = [
    ...navItems.slice(0, 2),
    { href: '#fab', icon: <div className="h-5 w-5" />, label: '', isPlaceholder: true }, 
    ...navItems.slice(2),
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[70px]">
      <Link 
        href="/loom-studio"
        className={cn(
          'absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-50',
          'flex items-center justify-center h-16 w-16 rounded-full shadow-[0_0_25px_hsl(var(--primary)/0.3)] cursor-pointer transition-all duration-200 ease-in-out', // Jade glow shadow
          'bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground', // Use primary and accent for FAB
          'active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background border-2 border-background' // Added border for definition
        )}
        aria-label="Open Loom Studio"
      >
        <LayoutGrid className="h-7 w-7" />
      </Link>

      <nav className="absolute bottom-0 left-0 right-0 flex justify-around items-center bg-background/50 backdrop-blur-lg p-1 h-[60px] rounded-t-2xl shadow-[0_-8px_30px_hsl(var(--primary)/0.15)] border-t border-primary/20"> {/* Glassy bg, jade border & shadow */}
        {itemsWithPlaceholder.map((item, index) =>
          item.isPlaceholder ? (
            <div key={`fab-spacer-${index}`} className="flex-1"></div> 
          ) : (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
            />
          )
        )}
      </nav>
    </div>
  );
}
