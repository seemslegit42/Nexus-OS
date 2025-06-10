// src/components/core/workspace-grid.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { Zone } from '@/components/core/zone';
import { cn } from '@/lib/utils';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface ZoneConfig {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  defaultLayout: {
    lg: Layout; // Default layout for large screens
    md?: Layout; // Optional: medium screens
    sm?: Layout; // Optional: small screens
    xs?: Layout; // Optional: extra-small screens
    xxs?: Layout; // Optional: extra-extra-small screens
  };
  minW?: number;
  minH?: number;
  static?: boolean; // If true, item is not draggable or resizable
  isResizable?: boolean;
  isDraggable?: boolean;
}

interface WorkspaceGridProps {
  zoneConfigs: ZoneConfig[];
  className?: string;
  rowHeight?: number;
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
  onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
}

export function WorkspaceGrid({
  zoneConfigs,
  className,
  rowHeight = 30,
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  onLayoutChange,
}: WorkspaceGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentLayouts, setCurrentLayouts] = useState<Layouts>({});

  useEffect(() => {
    setIsMounted(true);
    // Initialize layouts from zoneConfigs
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bp => {
      initialLayouts[bp] = zoneConfigs.map(zc => ({
        i: zc.id,
        ...(zc.defaultLayout[bp as keyof typeof zc.defaultLayout] || zc.defaultLayout.lg),
        minW: zc.minW,
        minH: zc.minH,
        static: zc.static,
        isResizable: zc.isResizable,
        isDraggable: zc.isDraggable,
      }));
    });
    setCurrentLayouts(initialLayouts);
  }, [zoneConfigs, cols]);

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setCurrentLayouts(allLayouts);
    if (onLayoutChange) {
      onLayoutChange(currentLayout, allLayouts);
    }
  };
  
  // Dummy handlers for Zone actions - these would typically update state or call props
  const handleToggleLock = (id: string) => console.log(`Toggle lock for ${id}`);
  const handleTogglePin = (id: string) => {
    console.log(`Toggle pin for ${id}`);
    // Example: Make item static by updating its layout property
    // This requires more complex state management to update `currentLayouts`
    // and then pass the updated layouts back to ResponsiveGridLayout.
  };
  const handleToggleExpand = (id: string) => console.log(`Toggle expand for ${id}`);
  const handleClose = (id: string) => console.log(`Close ${id}`);


  if (!isMounted) {
    // Prevent server-side rendering mismatch for react-grid-layout
    // You could return a loader here if preferred
    return null; 
  }

  return (
    <ResponsiveGridLayout
      className={cn("layout", className)}
      layouts={currentLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={cols}
      rowHeight={rowHeight}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".card-header" // Allows dragging only from the Zone's header
    >
      {zoneConfigs.map((zoneConfig) => (
        <div key={zoneConfig.id} className="bg-transparent">
          <Zone
            title={zoneConfig.title}
            icon={zoneConfig.icon}
            onLockToggle={() => handleToggleLock(zoneConfig.id)}
            isLocked={zoneConfig.static} // Example: map static to isLocked
            onPinToggle={() => handleTogglePin(zoneConfig.id)}
            isPinned={zoneConfig.static} // Example: map static to isPinned
            onExpandToggle={() => handleToggleExpand(zoneConfig.id)}
            // isExpanded={...} // Requires state
            onClose={() => handleClose(zoneConfig.id)}
            className="h-full" // Ensure Zone fills its grid item
          >
            {zoneConfig.content}
          </Zone>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
