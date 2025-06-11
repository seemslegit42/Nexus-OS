
'use client';

import React from 'react'; // Added React import
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
    <Link href={href} className="flex flex-col items-center justify-center flex-1 group">
      <div
        className={cn(
          'p-2 rounded-full transition-colors duration-200 ease-in-out mb-0.5',
          isActive ? 'bg-primary/20' : 'group-hover:bg-muted/50'
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn(
            'h-6 w-6 transition-colors duration-200 ease-in-out',
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          ),
        })}
      </div>
      <span
        className={cn(
          'text-xs transition-colors duration-200 ease-in-out',
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

  // Insert a placeholder for the FAB to correctly space out NavItems
  const itemsWithPlaceholder = [
    ...navItems.slice(0, 2),
    { href: '#fab', icon: <div className="h-6 w-6" />, label: '', isPlaceholder: true }, // FAB Spacer
    ...navItems.slice(2),
  ];


  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[70px]"> {/* Wrapper to position FAB correctly */}
      {/* Floating Action Button */}
      <Link href="/loom-studio" legacyBehavior>
        <a
          className={cn(
            'absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-50',
            'flex items-center justify-center h-16 w-16 rounded-full shadow-2xl cursor-pointer transition-all duration-200 ease-in-out',
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
          aria-label="Open Loom Studio"
        >
          <LayoutGrid className="h-7 w-7" />
        </a>
      </Link>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 flex justify-around items-center bg-card/80 backdrop-blur-lg p-1.5 h-[60px] rounded-t-2xl shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.2)] border-t border-border/60">
        {itemsWithPlaceholder.map((item, index) =>
          item.isPlaceholder ? (
            <div key={`fab-spacer-${index}`} className="flex-1"></div> // Spacer takes up space
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

    