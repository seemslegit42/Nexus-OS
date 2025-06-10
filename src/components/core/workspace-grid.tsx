
// src/components/core/workspace-grid.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { Zone } from '@/components/core/zone';
import { cn } from '@/lib/utils';

const ResponsiveGridLayout = WidthProvider(Responsive);

const MINIMIZED_ZONE_HEADER_ROWS = 2; 
const DEFAULT_ROW_HEIGHT_PIXELS = 30; 

export interface ZoneConfig {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  defaultLayout: {
    lg: Layout;
    md?: Layout;
    sm?: Layout;
    xs?: Layout;
    xxs?: Layout;
  };
  minW?: number;
  minH?: number;
  static?: boolean; 
  isResizable?: boolean;
  isDraggable?: boolean;
  canPin?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canClose?: boolean;
}

interface WorkspaceGridProps {
  zoneConfigs: ZoneConfig[];
  className?: string;
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
  onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
  onZoneClose?: (id: string) => void;
}

export function WorkspaceGrid({
  zoneConfigs,
  className,
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  onLayoutChange,
  onZoneClose,
}: WorkspaceGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentLayouts, setCurrentLayouts] = useState<Layouts>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  
  const [maximizedZoneId, setMaximizedZoneId] = useState<string | null>(null);
  const [storedLayoutsBeforeMaximize, setStoredLayoutsBeforeMaximize] = useState<Layouts | null>(null);
  
  const [minimizedZoneIds, setMinimizedZoneIds] = useState<string[]>([]);
  const [storedHeightsBeforeMinimize, setStoredHeightsBeforeMinimize] = useState<Record<string, { h: number; minH: number }>>({});
  const [locallyClosedZoneIds, setLocallyClosedZoneIds] = useState<string[]>([]);


  const [calculatedRowHeight, setCalculatedRowHeight] = useState(DEFAULT_ROW_HEIGHT_PIXELS);

  useEffect(() => {
    // Calculate row height based on a dummy header to ensure minimized zones fit their header.
    // This runs once on mount.
    const dummyHeader = document.createElement('div');
    // Apply classes similar to Zone's header for accurate height measurement
    dummyHeader.className = 'draggable-zone-header flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/50 min-h-[48px]';
    dummyHeader.style.position = 'absolute';
    dummyHeader.style.visibility = 'hidden';
    dummyHeader.style.width = '300px'; // Arbitrary width
    document.body.appendChild(dummyHeader);
    const headerPixelHeight = dummyHeader.offsetHeight || 48; // Fallback
    document.body.removeChild(dummyHeader);
    
    // Set rowHeight to be a fraction of the header, ensuring MINIMIZED_ZONE_HEADER_ROWS make up the header
    setCalculatedRowHeight(Math.max(10, Math.ceil(headerPixelHeight / MINIMIZED_ZONE_HEADER_ROWS)));
  }, []);


  useEffect(() => {
    if (calculatedRowHeight === DEFAULT_ROW_HEIGHT_PIXELS && !document.body) {
      // Wait for document.body to be available if calculatedRowHeight hasn't been set yet properly
      // This is a safeguard, but the initial useEffect should handle it.
      return;
    }
    setIsMounted(true);
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bpKey => {
      const bp = bpKey as keyof typeof cols;
      initialLayouts[bp] = zoneConfigs
        .filter(zc => !locallyClosedZoneIds.includes(zc.id)) // Filter out locally closed zones
        .map(zc => {
        // Precedence: Breakpoint-specific layout > ZoneConfig top-level > Defaults
        const bpLayoutConfig = zc.defaultLayout[bp] || zc.defaultLayout.lg;

        const itemStatic = bpLayoutConfig.static ?? zc.static ?? false;
        // If static, it's not draggable or resizable by default.
        // Otherwise, allow dragging/resizing unless explicitly set to false.
        const itemIsResizable = bpLayoutConfig.isResizable ?? zc.isResizable ?? !itemStatic;
        const itemIsDraggable = bpLayoutConfig.isDraggable ?? zc.isDraggable ?? !itemStatic;

        return {
          i: zc.id,
          ...(bpLayoutConfig),
          minW: bpLayoutConfig.minW ?? zc.minW ?? zc.defaultLayout.lg.minW ?? 1,
          minH: bpLayoutConfig.minH ?? zc.minH ?? zc.defaultLayout.lg.minH ?? MINIMIZED_ZONE_HEADER_ROWS,
          static: itemStatic,
          isResizable: itemIsResizable,
          isDraggable: itemIsDraggable,
        };
      });
    });
    setCurrentLayouts(initialLayouts);
  }, [zoneConfigs, cols, calculatedRowHeight, locallyClosedZoneIds]); // Add locallyClosedZoneIds dependency

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    if (JSON.stringify(allLayouts) !== JSON.stringify(currentLayouts)) {
      if (!maximizedZoneId) { 
         setCurrentLayouts(allLayouts);
      }
    }
    if (onLayoutChange) {
      onLayoutChange(currentLayout, allLayouts);
    }
  };
  
  const updateLayoutItemForAllBreakpoints = (id: string, newProps: Partial<Layout>) => {
    setCurrentLayouts(prev => {
      const newLayouts = JSON.parse(JSON.stringify(prev)); 
      Object.keys(newLayouts).forEach(bp => {
        const bpLayout = newLayouts[bp] as Layout[] | undefined;
        const itemIndex = bpLayout?.findIndex(item => item.i === id);
        if (bpLayout && itemIndex !== -1 && typeof itemIndex === 'number' && itemIndex < bpLayout.length) {
          bpLayout[itemIndex] = { ...bpLayout[itemIndex], ...newProps };
        }
      });
      return newLayouts;
    });
  };

  const handleTogglePin = useCallback((id: string) => {
    if (maximizedZoneId) return;

    const currentBpLayout = currentLayouts[currentBreakpoint];
    const item = currentBpLayout?.find(l => l.i === id);
    if (!item) return;

    const newStaticState = !item.static;
    const isMinimized = minimizedZoneIds.includes(id);

    updateLayoutItemForAllBreakpoints(id, {
      static: newStaticState,
      isDraggable: !newStaticState,
      isResizable: !newStaticState && !isMinimized, 
    });
  }, [currentLayouts, currentBreakpoint, maximizedZoneId, minimizedZoneIds]);

  const handleToggleMaximize = useCallback((id: string) => {
    setCurrentLayouts(prevLayouts => {
      const newLayoutsState = JSON.parse(JSON.stringify(prevLayouts));

      if (maximizedZoneId === id) { // Restore from maximized
        setMaximizedZoneId(null);
        const restoredLayouts = storedLayoutsBeforeMaximize || newLayoutsState;
        setStoredLayoutsBeforeMaximize(null);

        Object.keys(restoredLayouts).forEach(bp => {
          if (restoredLayouts[bp]) {
             (restoredLayouts[bp] as Layout[]).forEach((itemL: Layout) => {
              // Properties are restored from storedLayoutsBeforeMaximize
              // Now, re-apply minimized state if necessary and if it was stored
              const wasMinimizedBeforeMaximize = minimizedZoneIds.includes(itemL.i) && storedLayoutsBeforeMaximize?.[bp]?.find(l => l.i === itemL.i);
              if (wasMinimizedBeforeMaximize) {
                itemL.h = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.minH = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.isResizable = false;
                // isDraggable remains as per its pinned state from storedLayoutsBeforeMaximize
              }
            });
          }
        });
        return restoredLayouts;

      } else if (!maximizedZoneId) { // Maximize a new zone
        setStoredLayoutsBeforeMaximize(JSON.parse(JSON.stringify(prevLayouts)));
        setMaximizedZoneId(id);
        
        // Ensure the target zone is not minimized visually when maximized
        const updatedMinimizedZoneIds = minimizedZoneIds.filter(minId => minId !== id);
        setMinimizedZoneIds(updatedMinimizedZoneIds);


        Object.keys(newLayoutsState).forEach(bp => {
          const bpKey = bp as keyof typeof cols;
          const currentBPCols = cols[bpKey];
          const bpLayout = newLayoutsState[bpKey] as Layout[];
          
          if (bpLayout) {
            bpLayout.forEach((itemL: Layout) => {
              if (itemL.i === id) { // The zone being maximized
                itemL.x = 0;
                itemL.y = 0; 
                itemL.w = currentBPCols;
                const viewportHeightInRows = Math.floor(window.innerHeight / (calculatedRowHeight + 5 )); 
                itemL.h = Math.max(10, viewportHeightInRows - MINIMIZED_ZONE_HEADER_ROWS -1); 
                itemL.minH = Math.max(MINIMIZED_ZONE_HEADER_ROWS, itemL.h); 
                itemL.static = true;
                itemL.isDraggable = false;
                itemL.isResizable = false;
              } else { // Other zones
                 itemL.static = true; 
                 itemL.isDraggable = false;
                 itemL.isResizable = false;
              }
            });
          }
        });
        return newLayoutsState;
      }
      // If a zone is already maximized and a different zone's maximize is triggered, do nothing.
      return prevLayouts; 
    });
  }, [maximizedZoneId, storedLayoutsBeforeMaximize, cols, calculatedRowHeight, minimizedZoneIds, storedHeightsBeforeMinimize]);
  
  const handleToggleMinimize = useCallback((id: string) => {
    if (maximizedZoneId) return; // Cannot minimize if a zone is maximized

    const isCurrentlyMinimized = minimizedZoneIds.includes(id);
    const itemCurrentLayoutForBp = currentLayouts[currentBreakpoint]?.find(l => l.i === id);
    if (!itemCurrentLayoutForBp) return;
    const isPinned = itemCurrentLayoutForBp.static;


    if (!isCurrentlyMinimized) { 
      setMinimizedZoneIds(prev => [...prev, id]);
      setStoredHeightsBeforeMinimize(prev => ({
        ...prev,
        [id]: { h: itemCurrentLayoutForBp.h, minH: itemCurrentLayoutForBp.minH || MINIMIZED_ZONE_HEADER_ROWS }
      }));
      updateLayoutItemForAllBreakpoints(id, {
        h: MINIMIZED_ZONE_HEADER_ROWS,
        minH: MINIMIZED_ZONE_HEADER_ROWS,
        isResizable: false, 
        isDraggable: !isPinned, 
      });
    } else { 
      setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
      const oldHeights = storedHeightsBeforeMinimize[id];
      updateLayoutItemForAllBreakpoints(id, {
        h: oldHeights?.h || itemCurrentLayoutForBp.h, 
        minH: oldHeights?.minH || itemCurrentLayoutForBp.minH || MINIMIZED_ZONE_HEADER_ROWS, 
        isResizable: !isPinned, 
        isDraggable: !isPinned, 
      });
      setStoredHeightsBeforeMinimize(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
    }
  }, [maximizedZoneId, minimizedZoneIds, currentLayouts, currentBreakpoint, storedHeightsBeforeMinimize]);


  const handleActualClose = (id: string) => {
    if (maximizedZoneId) return; 
    if (onZoneClose) {
      onZoneClose(id); 
    } else {
      // If no external handler, manage "closed" state internally for this session
      setLocallyClosedZoneIds(prev => [...prev, id]);
      // Remove any stored minimize heights for this zone
      setStoredHeightsBeforeMinimize(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
       // Remove from minimized list if it was minimized
      setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
    }
  };

  if (!isMounted || !calculatedRowHeight || (calculatedRowHeight === DEFAULT_ROW_HEIGHT_PIXELS && zoneConfigs.length > 0 && typeof window !== 'undefined')) {
    // Basic placeholder while rowHeight is being calculated or not mounted
    return (
      <div className={cn("layout grid-placeholder", className)} style={{minHeight: '300px'}}>
        {zoneConfigs
          .filter(zc => !locallyClosedZoneIds.includes(zc.id))
          .map(zc => (
          <div key={zc.id} className="bg-muted/30 rounded-lg p-4">Loading {zc.title}...</div>
        ))}
      </div>
    );
  }
  
  const layoutsToRender = currentLayouts; 
  const activeZoneConfigs = zoneConfigs.filter(zc => !locallyClosedZoneIds.includes(zc.id));


  return (
    <ResponsiveGridLayout
      className={cn("layout", className)}
      layouts={layoutsToRender}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={cols}
      rowHeight={calculatedRowHeight}
      onLayoutChange={handleLayoutChange}
      onBreakpointChange={(newBreakpoint) => setCurrentBreakpoint(newBreakpoint)}
      draggableHandle=".draggable-zone-header" 
      preventCollision={true} 
      isDroppable={!maximizedZoneId}
      measureBeforeMount={false} 
      useCSSTransforms={true}
    >
      {activeZoneConfigs.map((zoneConfig) => {
        const rglItem = layoutsToRender[currentBreakpoint]?.find(item => item.i === zoneConfig.id) || 
                        currentLayouts[currentBreakpoint]?.find(item => item.i === zoneConfig.id) || 
                        zoneConfig.defaultLayout.lg; // Fallback
        
        const isEffectivelyPinned = rglItem.static || false; // Based on RGL item's current state
        const isCurrentlyMaximized = zoneConfig.id === maximizedZoneId;
        const isActuallyMinimized = minimizedZoneIds.includes(zoneConfig.id);

        // Determine if controls should be enabled/disabled
        const canPinZone = zoneConfig.canPin !== false && !isCurrentlyMaximized;
        // Can maximize if not minimized AND ( (no zone is maximized) OR (this IS the maximized zone) )
        const canMaximizeZone = zoneConfig.canMaximize !== false && !isActuallyMinimized && (!maximizedZoneId || isCurrentlyMaximized) ;
        // Can minimize if not maximized
        const canMinimizeZone = zoneConfig.canMinimize !== false && !isCurrentlyMaximized;
        // Can close if not maximized
        const canCloseZone = zoneConfig.canClose !== false && !isCurrentlyMaximized;

        return (
          <div key={zoneConfig.id} data-grid={rglItem} 
               className={cn(isCurrentlyMaximized && "rgl-maximized-item z-50")}>
            <Zone
              title={zoneConfig.title}
              icon={zoneConfig.icon}
              
              onPinToggle={canPinZone ? () => handleTogglePin(zoneConfig.id) : undefined}
              isPinned={isEffectivelyPinned} // Reflect RGL's static state
              
              onMaximizeToggle={canMaximizeZone ? () => handleToggleMaximize(zoneConfig.id) : undefined}
              isMaximized={isCurrentlyMaximized}
              
              onMinimizeToggle={canMinimizeZone ? () => handleToggleMinimize(zoneConfig.id) : undefined}
              isMinimized={isActuallyMinimized}
              
              onClose={canCloseZone ? () => handleActualClose(zoneConfig.id) : undefined}
              
              canPin={canPinZone}
              canMaximize={canMaximizeZone}
              canMinimize={canMinimizeZone}
              canClose={canCloseZone}
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

