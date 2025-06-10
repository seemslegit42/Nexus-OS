// src/components/core/workspace-grid.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback }
from 'react';
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
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');

  useEffect(() => {
    setIsMounted(true);
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bpKey => {
      const bp = bpKey as keyof typeof cols;
      initialLayouts[bp] = zoneConfigs.map(zc => ({
        i: zc.id,
        ...(zc.defaultLayout[bp] || zc.defaultLayout.lg),
        minW: zc.minW,
        minH: zc.minH,
        static: zc.static === undefined ? false : zc.static,
        isResizable: zc.isResizable === undefined ? true : zc.isResizable,
        isDraggable: zc.isDraggable === undefined ? true : zc.isDraggable,
      }));
    });
    setCurrentLayouts(initialLayouts);
  }, [zoneConfigs, cols]);

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    // Only update layouts if they are truly different to avoid infinite loops if onLayoutChange prop causes re-render
    if (JSON.stringify(allLayouts) !== JSON.stringify(currentLayouts)) {
      setCurrentLayouts(allLayouts);
    }
    if (onLayoutChange) {
      onLayoutChange(currentLayout, allLayouts);
    }
  };
  
  const handleToggleLock = (id: string) => console.log(`Toggle lock for ${id}`);
  
  const handleTogglePin = useCallback((id: string) => {
    setCurrentLayouts(prevLayouts => {
      const newLayouts = { ...prevLayouts };
      // Toggle static for the item across all breakpoints for consistency
      Object.keys(newLayouts).forEach(bp => {
        const bpLayout = newLayouts[bp] ? [...newLayouts[bp]] : [];
        const itemIndex = bpLayout.findIndex(item => item.i === id);
        if (itemIndex !== -1) {
          bpLayout[itemIndex] = {
            ...bpLayout[itemIndex],
            static: !bpLayout[itemIndex].static,
          };
          newLayouts[bp] = bpLayout;
        }
      });
      return newLayouts;
    });
  }, []);

  const handleToggleExpand = (id: string) => console.log(`Toggle expand for ${id}`);
  const handleClose = (id: string) => console.log(`Close ${id}`);

  if (!isMounted) {
    return null; 
  }

  const currentBreakpointLayout = currentLayouts[currentBreakpoint] || [];

  return (
    <ResponsiveGridLayout
      className={cn("layout", className)}
      layouts={currentLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={cols}
      rowHeight={rowHeight}
      onLayoutChange={handleLayoutChange}
      onBreakpointChange={(newBreakpoint) => setCurrentBreakpoint(newBreakpoint)}
      draggableHandle=".card-header"
      preventCollision={false}
    >
      {zoneConfigs.map((zoneConfig) => {
        const rglItem = currentBreakpointLayout.find(item => item.i === zoneConfig.id);
        const isCurrentlyPinned = rglItem ? rglItem.static || false : zoneConfig.static || false;
        // isDraggable and isResizable are derived from !isCurrentlyPinned unless explicitly set false
        const isCurrentlyDraggable = !isCurrentlyPinned && (rglItem ? rglItem.isDraggable !== false : zoneConfig.isDraggable !== false);
        const isCurrentlyResizable = !isCurrentlyPinned && (rglItem ? rglItem.isResizable !== false : zoneConfig.isResizable !== false);

        // This div is the grid item. react-grid-layout needs a key here.
        // It will use properties from the `layouts` prop for this key.
        return (
          <div key={zoneConfig.id} data-grid={
            // Provide explicit layout if not using layouts prop directly, but we are.
            // So this data-grid is mostly for debugging or direct styling if needed.
            // RGL derives props from the `layouts` object matching this key.
            currentLayouts[currentBreakpoint]?.find(l => l.i === zoneConfig.id) || zoneConfig.defaultLayout.lg
          }>
            <Zone
              title={zoneConfig.title}
              icon={zoneConfig.icon}
              onLockToggle={() => handleToggleLock(zoneConfig.id)}
              isLocked={isCurrentlyPinned} // For now, lock means pinned
              onPinToggle={() => handleTogglePin(zoneConfig.id)}
              isPinned={isCurrentlyPinned}
              onExpandToggle={() => handleToggleExpand(zoneConfig.id)}
              onClose={() => handleClose(zoneConfig.id)}
              className="h-full"
            >
              {zoneConfig.content}
            </Zone>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
