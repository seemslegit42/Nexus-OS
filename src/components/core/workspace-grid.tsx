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
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [storedLayoutsBeforeExpand, setStoredLayoutsBeforeExpand] = useState<Layouts | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bpKey => {
      const bp = bpKey as keyof typeof cols;
      initialLayouts[bp] = zoneConfigs.map(zc => ({
        i: zc.id,
        ...(zc.defaultLayout[bp] || zc.defaultLayout.lg), // Fallback to lg if specific breakpoint layout is missing
        minW: zc.minW ?? zc.defaultLayout.lg.minW,
        minH: zc.minH ?? zc.defaultLayout.lg.minH,
        static: zc.static === undefined ? false : zc.static,
        isResizable: zc.isResizable === undefined ? true : zc.isResizable,
        isDraggable: zc.isDraggable === undefined ? true : zc.isDraggable,
      }));
    });
    setCurrentLayouts(initialLayouts);
  }, [zoneConfigs, cols]);

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    if (JSON.stringify(allLayouts) !== JSON.stringify(currentLayouts)) {
      if (!expandedZoneId) { 
         setCurrentLayouts(allLayouts);
      }
    }
    if (onLayoutChange) {
      onLayoutChange(currentLayout, allLayouts);
    }
  };
  
  const handleToggleLock = (id: string) => {
    handleTogglePin(id);
    console.log(`Toggle lock for ${id} (currently acts as pin)`);
  }
  
  const handleTogglePin = useCallback((id: string) => {
    if (expandedZoneId) return; 

    setCurrentLayouts(prevLayouts => {
      const newLayouts = { ...prevLayouts };
      Object.keys(newLayouts).forEach(bp => {
        const bpLayout = newLayouts[bp] ? [...newLayouts[bp]] : [];
        const itemIndex = bpLayout.findIndex(item => item.i === id);
        if (itemIndex !== -1) {
          const currentStaticState = bpLayout[itemIndex].static || false;
          bpLayout[itemIndex] = {
            ...bpLayout[itemIndex],
            static: !currentStaticState,
            isDraggable: currentStaticState ? (zoneConfigs.find(zc => zc.id === id)?.isDraggable ?? true) : false,
            isResizable: currentStaticState ? (zoneConfigs.find(zc => zc.id === id)?.isResizable ?? true) : false,
          };
        }
        newLayouts[bp] = bpLayout;
      });
      return newLayouts;
    });
  }, [expandedZoneId, zoneConfigs]);

  const handleToggleExpand = useCallback((id: string) => {
    setCurrentLayouts(prevLayouts => {
      const newLayoutsState = JSON.parse(JSON.stringify(prevLayouts)); 

      if (expandedZoneId === id) { 
        setExpandedZoneId(null);
        const restoredLayouts = storedLayoutsBeforeExpand || prevLayouts;
        setStoredLayoutsBeforeExpand(null);
        Object.keys(restoredLayouts).forEach(bp => {
          if (restoredLayouts[bp]) {
            restoredLayouts[bp].forEach((item: Layout) => {
              const originalZoneConfig = zoneConfigs.find(zc => zc.id === item.i);
              const userPinned = storedLayoutsBeforeExpand?.[bp]?.find((l:Layout) => l.i === item.i)?.static;
              item.static = userPinned || originalZoneConfig?.static || false; 
              item.isDraggable = !item.static && (originalZoneConfig?.isDraggable ?? true);
              item.isResizable = !item.static && (originalZoneConfig?.isResizable ?? true);
            });
          }
        });
        return restoredLayouts;
      } else if (!expandedZoneId) { 
        setStoredLayoutsBeforeExpand(JSON.parse(JSON.stringify(prevLayouts)));
        setExpandedZoneId(id);

        Object.keys(newLayoutsState).forEach(bp => {
          const bpKey = bp as keyof typeof cols;
          const currentBPCols = cols[bpKey];
          const bpLayout = newLayoutsState[bpKey] as Layout[];
          
          if (bpLayout) {
            bpLayout.forEach((item: Layout) => {
              if (item.i !== id) {
                item.static = true;
                item.isDraggable = false;
                item.isResizable = false;
              }
            });

            const itemIndex = bpLayout.findIndex((item: Layout) => item.i === id);
            if (itemIndex !== -1) {
              bpLayout[itemIndex] = {
                ...bpLayout[itemIndex],
                x: 0,
                y: 0, 
                w: currentBPCols,
                h: 20, 
                static: true,
                isDraggable: false,
                isResizable: false,
              };
            }
          }
        });
        return newLayoutsState;
      }
      return prevLayouts; 
    });
  }, [expandedZoneId, storedLayoutsBeforeExpand, cols, zoneConfigs]);


  const handleClose = (id: string) => {
    if (expandedZoneId) return; 
    console.log(`Attempting to close zone: ${id}. Implement removal from zoneConfigs and update layout.`);
  };

  if (!isMounted) {
    return (
      <div className={cn("layout grid-placeholder", className)}>
        {zoneConfigs.map(zc => (
          <div key={zc.id} className="bg-muted/30 rounded-lg p-4">Loading {zc.title}...</div>
        ))}
      </div>
    );
  }

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
      preventCollision={true} 
      isDroppable={!expandedZoneId} 
    >
      {zoneConfigs.map((zoneConfig) => {
        const rglItem = currentLayouts[currentBreakpoint]?.find(item => item.i === zoneConfig.id);
        const isCurrentlyPinned = rglItem ? rglItem.static || false : zoneConfig.static || false;

        return (
          <div key={zoneConfig.id} data-grid={rglItem || zoneConfig.defaultLayout.lg} >
            <Zone
              title={zoneConfig.title}
              icon={zoneConfig.icon}
              onLockToggle={() => handleToggleLock(zoneConfig.id)}
              isLocked={isCurrentlyPinned} 
              onPinToggle={() => handleTogglePin(zoneConfig.id)}
              isPinned={isCurrentlyPinned}
              onExpandToggle={() => handleToggleExpand(zoneConfig.id)}
              isExpanded={zoneConfig.id === expandedZoneId}
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
