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
       // Only update if layouts actually changed to prevent potential loops with onLayoutChange prop
      if (!expandedZoneId) { // Do not externally overwrite layouts if a zone is expanded by internal state
         setCurrentLayouts(allLayouts);
      }
    }
    if (onLayoutChange) {
      onLayoutChange(currentLayout, allLayouts);
    }
  };
  
  const handleToggleLock = (id: string) => {
    // For now, lock toggles pin status. Implement separate lock logic if needed.
    handleTogglePin(id);
    console.log(`Toggle lock for ${id} (currently acts as pin)`);
  }
  
  const handleTogglePin = useCallback((id: string) => {
    if (expandedZoneId) return; // Don't allow pinning/unpinning if a zone is expanded

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
            // If unpinning, restore draggable/resizable based on original config or true by default
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
      const newLayoutsState = JSON.parse(JSON.stringify(prevLayouts)); // Deep clone

      if (expandedZoneId === id) { // Minimize current expanded zone
        setExpandedZoneId(null);
        const restoredLayouts = storedLayoutsBeforeExpand || prevLayouts;
        setStoredLayoutsBeforeExpand(null);
        // Ensure that upon restoration, items are not all stuck as static
        Object.keys(restoredLayouts).forEach(bp => {
          if (restoredLayouts[bp]) {
            restoredLayouts[bp].forEach((item: Layout) => {
              const originalZoneConfig = zoneConfigs.find(zc => zc.id === item.i);
              const userPinned = storedLayoutsBeforeExpand?.[bp]?.find((l:Layout) => l.i === item.i)?.static;
              // If it was pinned by user (in storedLayouts) OR originally static, keep it static
              item.static = userPinned || originalZoneConfig?.static || false; 
              item.isDraggable = !item.static && (originalZoneConfig?.isDraggable ?? true);
              item.isResizable = !item.static && (originalZoneConfig?.isResizable ?? true);
            });
          }
        });
        return restoredLayouts;
      } else if (!expandedZoneId) { // Expand this zone, no other zone is expanded
        setStoredLayoutsBeforeExpand(JSON.parse(JSON.stringify(prevLayouts)));
        setExpandedZoneId(id);

        Object.keys(newLayoutsState).forEach(bp => {
          const bpKey = bp as keyof typeof cols;
          const currentBPCols = cols[bpKey];
          const bpLayout = newLayoutsState[bpKey] as Layout[];
          
          if (bpLayout) {
            // Make other items static (pinned)
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
                h: 20, // Expanded height (e.g., 20 rows * 30px/row = 600px). Adjust as needed.
                static: true,
                isDraggable: false,
                isResizable: false,
              };
            }
          }
        });
        return newLayoutsState;
      }
      // If another zone is already expanded, and user tries to expand a different one:
      // console.warn("Another zone is already expanded. Please minimize it first.");
      return prevLayouts; // Do nothing
    });
  }, [expandedZoneId, storedLayoutsBeforeExpand, cols, zoneConfigs]);


  const handleClose = (id: string) => {
    if (expandedZoneId) return; // Don't allow closing if a zone is expanded
    console.log(`Attempting to close zone: ${id}. Implement removal from zoneConfigs and update layout.`);
    // Actual removal would involve:
    // 1. Updating the parent component's state that provides zoneConfigs.
    // 2. zoneConfigs prop would change, and useEffect would rebuild initialLayouts.
    // This action is better handled by a callback to the parent that manages zoneConfigs.
  };

  if (!isMounted) {
    // Render placeholders or null during SSR/initial mount before layouts are ready
    return (
      <div className={cn("layout grid-placeholder", className)}>
        {zoneConfigs.map(zc => (
          <div key={zc.id} className="bg-muted/30 rounded-lg p-4">Loading {zc.title}...</div>
        ))}
      </div>
    );
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
      draggableHandle=".card-header" // Ensure zones are draggable by their header
      preventCollision={false} // Set to true if you want items to push each other; false allows potential overlap for more flexible manual layout.
                               // When expanding, collision prevention can be complex.
      isDroppable={!expandedZoneId} // Disable dropping new items if a zone is expanded
      // margin={[10, 10]} // Optional: define margin between items
      // containerPadding={[10,10]} // Optional: define padding for the container
    >
      {zoneConfigs.map((zoneConfig) => {
        // Find the current layout item for this zoneConfig on the current breakpoint
        const rglItem = currentLayouts[currentBreakpoint]?.find(item => item.i === zoneConfig.id);
        
        // Determine pinned status: it's pinned if its layout item is static.
        // Also consider the original static state from zoneConfig if item not found (should not happen after init).
        const isCurrentlyPinned = rglItem ? rglItem.static || false : zoneConfig.static || false;

        // An item is draggable/resizable only if it's NOT pinned/static
        // and its config allows it (or defaults to true)
        // AND no zone is expanded (or if it's the expanded zone, it's also not draggable/resizable)
        const canDragOrResize = !isCurrentlyPinned && !expandedZoneId;
        const isCurrentlyDraggable = canDragOrResize && (rglItem ? rglItem.isDraggable !== false : zoneConfig.isDraggable !== false);
        const isCurrentlyResizable = canDragOrResize && (rglItem ? rglItem.isResizable !== false : zoneConfig.isResizable !== false);

        return (
          <div key={zoneConfig.id} data-grid={rglItem || zoneConfig.defaultLayout.lg} 
            // RGL applies isDraggable, isResizable, static from the layout item directly.
            // We pass them to Zone for UI icon state.
          >
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
              className="h-full" // Ensure Zone fills the RGL item div
              // Pass down draggable/resizable status for potential internal Zone logic or styling, though RGL controls the actual behavior.
              // isDraggable={isCurrentlyDraggable} 
              // isResizable={isCurrentlyResizable}
            >
              {zoneConfig.content}
            </Zone>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
