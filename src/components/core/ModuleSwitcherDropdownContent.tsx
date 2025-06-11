
'use client';

import Link from 'next/link';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ReactNode } from 'react';

interface ModuleLink {
  name: string;
  href: string;
  icon: ReactNode;
}

interface ModuleSwitcherDropdownContentProps {
  modules: ModuleLink[];
}

export function ModuleSwitcherDropdownContent({ modules }: ModuleSwitcherDropdownContentProps) {
  return (
    <>
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
    </>
  );
}
