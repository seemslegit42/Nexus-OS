
// src/components/core/workspace-grid.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { Zone } from '@/components/core/zone';
import { cn } from '@/lib/utils';

const ResponsiveGridLayout = WidthProvider(Responsive);

const MINIMIZED_ZONE_HEADER_ROWS = 2; // Number of rows for a minimized zone's header
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

  const [calculatedRowHeight, setCalculatedRowHeight] = useState(DEFAULT_ROW_HEIGHT_PIXELS);

  useEffect(() => {
    const dummyHeader = document.createElement('div');
    dummyHeader.className = 'draggable-zone-header flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/50 min-h-[48px]';
    dummyHeader.style.position = 'absolute';
    dummyHeader.style.visibility = 'hidden';
    document.body.appendChild(dummyHeader);
    const headerHeight = dummyHeader.offsetHeight || 48; 
    document.body.removeChild(dummyHeader);
    setCalculatedRowHeight(Math.max(10, Math.ceil(headerHeight / MINIMIZED_ZONE_HEADER_ROWS)));
  }, []);


  useEffect(() => {
    setIsMounted(true);
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bpKey => {
      const bp = bpKey as keyof typeof cols;
      initialLayouts[bp] = zoneConfigs.map(zc => {
        const bpLayoutConfig = zc.defaultLayout[bp] || zc.defaultLayout.lg;

        // Determine effective static, isResizable, isDraggable with clearer precedence
        const itemStatic = bpLayoutConfig.static ?? zc.static ?? false;
        // If 'static' is true, isResizable/isDraggable should default to false unless explicitly overridden to true.
        // If 'static' is false, isResizable/isDraggable should default to true unless explicitly overridden to false.
        const itemIsResizable = bpLayoutConfig.isResizable ?? zc.isResizable ?? !itemStatic;
        const itemIsDraggable = bpLayoutConfig.isDraggable ?? zc.isDraggable ?? !itemStatic;

        return {
          i: zc.id,
          ...(bpLayoutConfig), // Spreads x, y, w, h, and potentially minW, minH from bpLayoutConfig
          minW: bpLayoutConfig.minW ?? zc.minW ?? zc.defaultLayout.lg.minW ?? 1,
          minH: bpLayoutConfig.minH ?? zc.minH ?? zc.defaultLayout.lg.minH ?? MINIMIZED_ZONE_HEADER_ROWS,
          static: itemStatic,
          isResizable: itemIsResizable,
          isDraggable: itemIsDraggable,
        };
      });
    });
    setCurrentLayouts(initialLayouts);
  }, [zoneConfigs, cols, calculatedRowHeight]); // added calculatedRowHeight dependency

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
  
  const updateLayoutItem = (id: string, newProps: Partial<Layout>) => {
    setCurrentLayouts(prev => {
      const newLayouts = JSON.parse(JSON.stringify(prev)); // Deep clone
      Object.keys(newLayouts).forEach(bp => {
        const bpLayout = newLayouts[bp] as Layout[] | undefined;
        const itemIndex = bpLayout?.findIndex(item => item.i === id);
        if (bpLayout && itemIndex !== -1 && itemIndex < bpLayout.length) {
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

    const originalZoneConfig = zoneConfigs.find(zc => zc.id === id);
    const newStaticState = !item.static;

    const newProps: Partial<Layout> = {
      static: newStaticState,
      // If unpinning, respect original config for draggable/resizable, else default to true.
      // If pinning, it becomes non-draggable/resizable.
      isDraggable: !newStaticState ? (originalZoneConfig?.isDraggable ?? true) : false,
      isResizable: !newStaticState ? (originalZoneConfig?.isResizable ?? true) : false,
    };
    
    // If it's content-minimized, it should remain non-resizable even if unpinned
    if (minimizedZoneIds.includes(id) && !newStaticState) { 
      newProps.isResizable = false;
    }
    
    updateLayoutItem(id, newProps);
  }, [currentLayouts, currentBreakpoint, maximizedZoneId, zoneConfigs, minimizedZoneIds]);

  const handleToggleMaximize = useCallback((id: string) => {
    const wasMinimized = minimizedZoneIds.includes(id);
    if (wasMinimized) {
        setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
        // Restore height from before content minimize, if stored
        const oldHeights = storedHeightsBeforeMinimize[id];
        if (oldHeights) {
            updateLayoutItem(id, { h: oldHeights.h, minH: oldHeights.minH });
        }
    }
    
    setCurrentLayouts(prevLayouts => {
      const newLayoutsState = JSON.parse(JSON.stringify(prevLayouts));

      if (maximizedZoneId === id) { // Restore from maximized
        setMaximizedZoneId(null);
        const restoredLayouts = storedLayoutsBeforeMaximize || newLayoutsState; // Use newLayoutsState as fallback
        setStoredLayoutsBeforeMaximize(null);
        Object.keys(restoredLayouts).forEach(bp => {
          if (restoredLayouts[bp]) {
            restoredLayouts[bp].forEach((itemL: Layout) => {
              const originalZoneConfig = zoneConfigs.find(zc => zc.id === itemL.i);
              const userPinnedBeforeMaximize = storedLayoutsBeforeMaximize?.[bp]?.find((l:Layout) => l.i === itemL.i)?.static;
              const configStatic = originalZoneConfig?.static || false;
              const shouldBeStatic = userPinnedBeforeMaximize || configStatic;
              
              itemL.static = shouldBeStatic;
              itemL.isDraggable = !shouldBeStatic && (originalZoneConfig?.isDraggable ?? true);
              itemL.isResizable = !shouldBeStatic && (originalZoneConfig?.isResizable ?? true);

              if (minimizedZoneIds.includes(itemL.i) || (itemL.i === id && wasMinimized && maximizedZoneId === id)) { // if restoring the zone that was minimized
                itemL.h = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.minH = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.isResizable = false;
              } else if (itemL.i === id && storedHeightsBeforeMinimize[id] && maximizedZoneId === id) { // If restoring the item we just unminimized.
                  const restoredHeight = storedHeightsBeforeMinimize[id];
                  itemL.h = restoredHeight.h;
                  itemL.minH = restoredHeight.minH;
              }
            });
          }
        });
        if (wasMinimized && maximizedZoneId === id) { // if we are restoring the maximized zone AND it was minimized before maximizing
             const itemToRestoreMinimizedLook = restoredLayouts[currentBreakpoint]?.find(l => l.i === id);
             if(itemToRestoreMinimizedLook) {
                itemToRestoreMinimizedLook.h = MINIMIZED_ZONE_HEADER_ROWS;
                itemToRestoreMinimizedLook.minH = MINIMIZED_ZONE_HEADER_ROWS;
                itemToRestoreMinimizedLook.isResizable = false;
             }
        }
        return restoredLayouts;
      } else if (!maximizedZoneId) { // Maximize
        setStoredLayoutsBeforeMaximize(JSON.parse(JSON.stringify(prevLayouts)));
        setMaximizedZoneId(id);

        Object.keys(newLayoutsState).forEach(bp => {
          const bpKey = bp as keyof typeof cols;
          const currentBPCols = cols[bpKey];
          const bpLayout = newLayoutsState[bpKey] as Layout[];
          
          if (bpLayout) {
            bpLayout.forEach((itemL: Layout) => {
              if (itemL.i === id) {
                itemL.x = 0;
                itemL.y = 0; 
                itemL.w = currentBPCols;
                // Calculate a reasonable maximized height, e.g., 90% of viewport height in rows
                const viewportHeightInRows = Math.floor(window.innerHeight / (calculatedRowHeight + 5 )); // +5 for margin approx
                itemL.h = Math.max(20, viewportHeightInRows - MINIMIZED_ZONE_HEADER_ROWS -1); // Subtract topbar and some padding
                itemL.minH = itemL.h;
                itemL.static = true;
                itemL.isDraggable = false;
                itemL.isResizable = false;
              } else {
                // Make other items static too so they don't move
                 itemL.static = true;
                 itemL.isDraggable = false;
                 itemL.isResizable = false;
              }
            });
          }
        });
        return newLayoutsState;
      }
      return prevLayouts; 
    });
  }, [maximizedZoneId, storedLayoutsBeforeMaximize, cols, zoneConfigs, minimizedZoneIds, calculatedRowHeight, currentBreakpoint, storedHeightsBeforeMinimize]);
  
  const handleToggleMinimize = useCallback((id: string) => {
    if (maximizedZoneId === id || maximizedZoneId) return; 

    const isCurrentlyMinimized = minimizedZoneIds.includes(id);
    const itemCurrentLayout = currentLayouts[currentBreakpoint]?.find(l => l.i === id);
    const originalZoneConfig = zoneConfigs.find(zc => zc.id === id);
    if (!itemCurrentLayout || !originalZoneConfig) return;

    const isPinned = itemCurrentLayout.static;

    if (!isCurrentlyMinimized) { 
      setMinimizedZoneIds(prev => [...prev, id]);
      setStoredHeightsBeforeMinimize(prev => ({
        ...prev,
        [id]: { h: itemCurrentLayout.h, minH: itemCurrentLayout.minH }
      }));
      updateLayoutItem(id, {
        h: MINIMIZED_ZONE_HEADER_ROWS,
        minH: MINIMIZED_ZONE_HEADER_ROWS,
        isResizable: false, 
        isDraggable: !isPinned && (originalZoneConfig.isDraggable ?? true), 
      });
    } else { 
      setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
      const oldHeights = storedHeightsBeforeMinimize[id];
      updateLayoutItem(id, {
        h: oldHeights?.h || itemCurrentLayout.h, 
        minH: oldHeights?.minH || itemCurrentLayout.minH, 
        isResizable: !isPinned && (originalZoneConfig.isResizable ?? true), 
        isDraggable: !isPinned && (originalZoneConfig.isDraggable ?? true), 
      });
      setStoredHeightsBeforeMinimize(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
    }
  }, [maximizedZoneId, minimizedZoneIds, currentLayouts, currentBreakpoint, zoneConfigs, storedHeightsBeforeMinimize]);


  const handleActualClose = (id: string) => {
    if (maximizedZoneId) return; 
    if (onZoneClose) {
      onZoneClose(id); 
    } else {
      console.warn(`Zone close clicked for ${id}, but no onZoneClose handler provided.`);
    }
  };

  if (!isMounted || !calculatedRowHeight) {
    return (
      <div className={cn("layout grid-placeholder", className)} style={{minHeight: '300px'}}>
        {zoneConfigs.map(zc => (
          <div key={zc.id} className="bg-muted/30 rounded-lg p-4">Loading {zc.title}...</div>
        ))}
      </div>
    );
  }
  
  // Use currentLayouts directly, maximized state will alter its properties
  const layoutsToRender = currentLayouts; 

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
      {zoneConfigs.map((zoneConfig) => {
        const rglItem = layoutsToRender[currentBreakpoint]?.find(item => item.i === zoneConfig.id) || 
                        currentLayouts[currentBreakpoint]?.find(item => item.i === zoneConfig.id) || 
                        zoneConfig.defaultLayout.lg;
        
        const isPinned = rglItem.static || false;
        const isCurrentlyMaximized = zoneConfig.id === maximizedZoneId;
        const isCurrentlyMinimized = minimizedZoneIds.includes(zoneConfig.id);

        // Determine if controls should be enabled/disabled
        const controlsCanPin = zoneConfig.canPin !== false && !isCurrentlyMaximized;
        const controlsCanMaximize = zoneConfig.canMaximize !== false && !isCurrentlyMinimized && !maximizedZoneId; // Cannot maximize if another is already maximized
        const controlsCanRestoreFromMax = zoneConfig.canMaximize !== false && isCurrentlyMaximized; // Special case for restore button
        const controlsCanMinimize = zoneConfig.canMinimize !== false && !isCurrentlyMaximized;
        const controlsCanClose = zoneConfig.canClose !== false && !isCurrentlyMaximized;

        return (
          <div key={zoneConfig.id} data-grid={rglItem} 
               className={cn(isCurrentlyMaximized && "rgl-maximized-item z-50")}>
            <Zone
              title={zoneConfig.title}
              icon={zoneConfig.icon}
              
              onPinToggle={controlsCanPin ? () => handleTogglePin(zoneConfig.id) : undefined}
              isPinned={isPinned}
              
              onMaximizeToggle={(controlsCanMaximize || controlsCanRestoreFromMax) ? () => handleToggleMaximize(zoneConfig.id) : undefined}
              isMaximized={isCurrentlyMaximized}
              
              onMinimizeToggle={controlsCanMinimize ? () => handleToggleMinimize(zoneConfig.id) : undefined}
              isMinimized={isCurrentlyMinimized}
              
              onClose={controlsCanClose ? () => handleActualClose(zoneConfig.id) : undefined}
              
              canPin={controlsCanPin}
              canMaximize={controlsCanMaximize || controlsCanRestoreFromMax}
              canMinimize={controlsCanMinimize}
              canClose={controlsCanClose}
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

