// src/components/core/bottom-nav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House as Home,
  Cpu,
  Radio as RadioTower,
  Bell,
  GridFour as LayoutGrid,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className="group flex flex-1 flex-col items-center justify-center py-1"
    >
      <div
        className={cn(
          'mb-0.5 rounded-xl p-2 transition-colors duration-200 ease-in-out',
          isActive
            ? 'bg-[var(--accent-primary-color)]/20'
            : 'group-hover:bg-[var(--panel-background-color)]/50' // Use panel bg for hover
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn(
            'h-5 w-5 transition-colors duration-200 ease-in-out',
            isActive
              ? 'text-[var(--accent-primary-color)]'
              : 'text-[var(--text-secondary-color)] group-hover:text-[var(--text-primary-color)]'
          ),
        })}
      </div>
      <span
        className={cn(
          'text-[10px] transition-colors duration-200 ease-in-out',
          isActive
            ? 'font-medium text-[var(--accent-primary-color)]'
            : 'text-[var(--text-secondary-color)] group-hover:text-[var(--text-primary-color)]'
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
    { href: '/home', icon: <Home />, label: 'Home' },
    { href: '/agents', icon: <Cpu />, label: 'Agents' },
    // Placeholder for FAB
    { href: '/pulse', icon: <RadioTower />, label: 'Pulse' },
    { href: '/notifications', icon: <Bell />, label: 'Alerts' },
  ];

  const itemsWithPlaceholder = [
    ...navItems.slice(0, 2),
    {
      href: '#fab',
      icon: <div className="h-5 w-5" />,
      label: '',
      isPlaceholder: true as true,
    },
    ...navItems.slice(2),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-[70px] md:hidden">
      <Link
        href="/loom-studio"
        className={cn(
          'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-1/2 transform',
          'flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-[0_0_25px_hsl(var(--primary-hsl)/0.3)] transition-all duration-200 ease-in-out',
          'hover:bg-[var(--accent-primary-color)]/90 bg-[var(--accent-primary-color)] text-[var(--primary-foreground)]', // FAB uses primary accent (Purple)
          'border-2 border-[var(--background-main-color)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95' // Use main background for border
        )}
        aria-label="Open Loom Studio"
      >
        <LayoutGrid className="h-7 w-7" />
      </Link>

      <nav className="bg-[var(--panel-background-color)]/50 absolute bottom-0 left-0 right-0 flex h-[60px] items-center justify-around rounded-t-2xl border-t border-[var(--border-color-main)] p-1 shadow-[0_-8px_30px_hsl(var(--primary-hsl)/0.15)] backdrop-blur-lg">
        {itemsWithPlaceholder.map((item, index) => {
          if ('isPlaceholder' in item && item.isPlaceholder) {
            return <div key={`fab-spacer-${index}`} className="flex-1"></div>;
          }

          let isActiveCalc = false;
          if (item.href === '/home') {
            isActiveCalc =
              pathname === '/home' || pathname.startsWith('/home/');
          } else if (item.href === '/') {
            isActiveCalc = pathname === '/';
          } else {
            isActiveCalc = pathname.startsWith(item.href);
          }

          return (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActiveCalc}
            />
          );
        })}
      </nav>
    </div>
  );
}
