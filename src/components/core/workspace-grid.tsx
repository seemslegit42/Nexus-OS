
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

  const [calculatedRowHeight, setCalculatedRowHeight] = useState(DEFAULT_ROW_HEIGHT_PIXELS);

  useEffect(() => {
    const dummyHeader = document.createElement('div');
    dummyHeader.className = 'draggable-zone-header flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/50 min-h-[48px]'; // Match Zone header style
    dummyHeader.style.position = 'absolute';
    dummyHeader.style.visibility = 'hidden';
    document.body.appendChild(dummyHeader);
    const headerHeight = dummyHeader.offsetHeight || 48; // Fallback, should match CSS
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

        const itemStatic = bpLayoutConfig.static ?? zc.static ?? false;
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
  }, [zoneConfigs, cols, calculatedRowHeight]); 

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
            restoredLayouts[bp].forEach((itemL: Layout) => {
              // Properties are already restored from storedLayoutsBeforeMaximize
              // Now, re-apply minimized state if necessary
              if (minimizedZoneIds.includes(itemL.i)) {
                itemL.h = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.minH = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.isResizable = false;
                // isDraggable remains as per its pinned state from storedLayoutsBeforeMaximize
              }
            });
          }
        });
        return restoredLayouts;

      } else if (!maximizedZoneId) { // Maximize
        setStoredLayoutsBeforeMaximize(JSON.parse(JSON.stringify(prevLayouts)));
        setMaximizedZoneId(id);
        
        // Un-minimize the target zone if it was minimized
        if (minimizedZoneIds.includes(id)) {
            setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
            // Height will be overridden by maximize logic below
        }

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
                const viewportHeightInRows = Math.floor(window.innerHeight / (calculatedRowHeight + 5 )); 
                itemL.h = Math.max(10, viewportHeightInRows - MINIMIZED_ZONE_HEADER_ROWS -1); 
                itemL.minH = Math.max(MINIMIZED_ZONE_HEADER_ROWS, itemL.h); 
                itemL.static = true;
                itemL.isDraggable = false;
                itemL.isResizable = false;
              } else {
                 itemL.static = true; // Pin other zones in place
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
  }, [maximizedZoneId, storedLayoutsBeforeMaximize, cols, calculatedRowHeight, currentBreakpoint, minimizedZoneIds, storedHeightsBeforeMinimize]);
  
  const handleToggleMinimize = useCallback((id: string) => {
    if (maximizedZoneId === id || maximizedZoneId) return; 

    const isCurrentlyMinimized = minimizedZoneIds.includes(id);
    const itemCurrentLayoutForBp = currentLayouts[currentBreakpoint]?.find(l => l.i === id);
    if (!itemCurrentLayoutForBp) return;
    const isPinned = itemCurrentLayoutForBp.static;


    if (!isCurrentlyMinimized) { 
      setMinimizedZoneIds(prev => [...prev, id]);
      setStoredHeightsBeforeMinimize(prev => ({
        ...prev,
        [id]: { h: itemCurrentLayoutForBp.h, minH: itemCurrentLayoutForBp.minH }
      }));
      updateLayoutItemForAllBreakpoints(id, {
        h: MINIMIZED_ZONE_HEADER_ROWS,
        minH: MINIMIZED_ZONE_HEADER_ROWS,
        isResizable: false, 
        isDraggable: !isPinned, // Draggable if not pinned
      });
    } else { 
      setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
      const oldHeights = storedHeightsBeforeMinimize[id];
      updateLayoutItemForAllBreakpoints(id, {
        h: oldHeights?.h || itemCurrentLayoutForBp.h, 
        minH: oldHeights?.minH || itemCurrentLayoutForBp.minH, 
        isResizable: !isPinned, // Resizable if not pinned
        isDraggable: !isPinned, // Draggable if not pinned
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
      // console.warn(`Zone close clicked for ${id}, but no onZoneClose handler provided.`);
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
                        zoneConfig.defaultLayout.lg; // Fallback, should ideally always find
        
        const isPinnedByGrid = rglItem.static || false;
        const isCurrentlyMaximized = zoneConfig.id === maximizedZoneId;
        const isActuallyMinimized = minimizedZoneIds.includes(zoneConfig.id);

        const canPinZone = zoneConfig.canPin !== false && !isCurrentlyMaximized;
        const canMaximizeZone = zoneConfig.canMaximize !== false && !isActuallyMinimized && (!maximizedZoneId || isCurrentlyMaximized) ;
        const canMinimizeZone = zoneConfig.canMinimize !== false && !isCurrentlyMaximized;
        const canCloseZone = zoneConfig.canClose !== false && !isCurrentlyMaximized;

        return (
          <div key={zoneConfig.id} data-grid={rglItem} 
               className={cn(isCurrentlyMaximized && "rgl-maximized-item z-50")}>
            <Zone
              title={zoneConfig.title}
              icon={zoneConfig.icon}
              
              onPinToggle={canPinZone ? () => handleTogglePin(zoneConfig.id) : undefined}
              isPinned={isPinnedByGrid}
              
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
