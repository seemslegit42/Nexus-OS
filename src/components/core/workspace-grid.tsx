
// src/components/core/workspace-grid.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { Zone } from '@/components/core/zone';
import { cn } from '@/lib/utils';

const ResponsiveGridLayout = WidthProvider(Responsive);

const MINIMIZED_ZONE_HEADER_ROWS = 2; // Number of rows for a minimized zone's header
const DEFAULT_ROW_HEIGHT_PIXELS = 30; // Fallback if header calculation fails

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
  // rowHeight prop is now calculated internally
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
  onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
  onZoneClose?: (id: string) => void; // Callback for when a zone's close button is clicked
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
    // Calculate rowHeight based on a typical Zone header height
    const dummyHeader = document.createElement('div');
    dummyHeader.className = 'draggable-zone-header flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/50 min-h-[48px]'; // Match Zone's CardHeader classes
    dummyHeader.style.position = 'absolute';
    dummyHeader.style.visibility = 'hidden';
    document.body.appendChild(dummyHeader);
    const headerHeight = dummyHeader.offsetHeight || 48; // Fallback to 48px
    document.body.removeChild(dummyHeader);
    setCalculatedRowHeight(Math.max(10, Math.ceil(headerHeight / MINIMIZED_ZONE_HEADER_ROWS)));
  }, []);


  useEffect(() => {
    setIsMounted(true);
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bpKey => {
      const bp = bpKey as keyof typeof cols;
      initialLayouts[bp] = zoneConfigs.map(zc => {
        const defaultStatic = zc.static ?? false;
        return {
          i: zc.id,
          ...(zc.defaultLayout[bp] || zc.defaultLayout.lg),
          minW: zc.minW ?? zc.defaultLayout.lg.minW ?? 1,
          minH: zc.minH ?? zc.defaultLayout.lg.minH ?? MINIMIZED_ZONE_HEADER_ROWS,
          static: defaultStatic,
          isResizable: zc.isResizable !== undefined ? zc.isResizable : !defaultStatic,
          isDraggable: zc.isDraggable !== undefined ? zc.isDraggable : !defaultStatic,
        };
      });
    });
    setCurrentLayouts(initialLayouts);
  }, [zoneConfigs, cols]);

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
      const newLayouts = JSON.parse(JSON.stringify(prev));
      Object.keys(newLayouts).forEach(bp => {
        const bpLayout = newLayouts[bp] as Layout[] | undefined;
        const itemIndex = bpLayout?.findIndex(item => item.i === id);
        if (bpLayout && itemIndex !== -1) {
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
      isDraggable: !newStaticState && (originalZoneConfig?.isDraggable ?? true),
      isResizable: !newStaticState && (originalZoneConfig?.isResizable ?? true),
    };
    
    if (minimizedZoneIds.includes(id)) { // If content is minimized
      newProps.isResizable = false; // Keep it non-resizable
    }
    
    updateLayoutItem(id, newProps);
  }, [currentLayouts, currentBreakpoint, maximizedZoneId, zoneConfigs, minimizedZoneIds]);

  const handleToggleMaximize = useCallback((id: string) => {
    setMinimizedZoneIds(prev => prev.filter(minId => minId !== id)); // Un-minimize if it was

    setCurrentLayouts(prevLayouts => {
      const newLayoutsState = JSON.parse(JSON.stringify(prevLayouts));

      if (maximizedZoneId === id) { // Restore
        setMaximizedZoneId(null);
        const restoredLayouts = storedLayoutsBeforeMaximize || prevLayouts;
        setStoredLayoutsBeforeMaximize(null);
        Object.keys(restoredLayouts).forEach(bp => {
          if (restoredLayouts[bp]) {
            restoredLayouts[bp].forEach((itemL: Layout) => {
              const originalZoneConfig = zoneConfigs.find(zc => zc.id === itemL.i);
              const userPinned = storedLayoutsBeforeMaximize?.[bp]?.find((l:Layout) => l.i === itemL.i)?.static;
              const shouldBeStatic = userPinned || originalZoneConfig?.static || false;
              
              itemL.static = shouldBeStatic;
              itemL.isDraggable = !shouldBeStatic && (originalZoneConfig?.isDraggable ?? true);
              itemL.isResizable = !shouldBeStatic && (originalZoneConfig?.isResizable ?? true);

              if (minimizedZoneIds.includes(itemL.i)) {
                itemL.h = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.minH = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.isResizable = false;
              }
            });
          }
        });
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
              itemL.static = true; // Make all items static
              itemL.isDraggable = false;
              itemL.isResizable = false;
              if (itemL.i === id) {
                itemL.x = 0;
                itemL.y = 0; 
                itemL.w = currentBPCols;
                itemL.h = Math.max(20, Math.floor(window.innerHeight / (calculatedRowHeight + 5)) - 5 ); // Approx full height
                itemL.minH = itemL.h; // prevent resizing when maximized
              }
            });
          }
        });
        return newLayoutsState;
      }
      return prevLayouts; 
    });
  }, [maximizedZoneId, storedLayoutsBeforeMaximize, cols, zoneConfigs, minimizedZoneIds, calculatedRowHeight]);
  
  const handleToggleMinimize = useCallback((id: string) => {
    if (maximizedZoneId === id || maximizedZoneId) return; // Cannot minimize a maximized zone, or any zone if one is maximized

    const isCurrentlyMinimized = minimizedZoneIds.includes(id);
    const itemCurrentLayout = currentLayouts[currentBreakpoint]?.find(l => l.i === id);
    const originalZoneConfig = zoneConfigs.find(zc => zc.id === id);
    if (!itemCurrentLayout || !originalZoneConfig) return;

    const isPinned = itemCurrentLayout.static;

    if (!isCurrentlyMinimized) { // Minimize content
      setMinimizedZoneIds(prev => [...prev, id]);
      setStoredHeightsBeforeMinimize(prev => ({
        ...prev,
        [id]: { h: itemCurrentLayout.h, minH: itemCurrentLayout.minH }
      }));
      updateLayoutItem(id, {
        h: MINIMIZED_ZONE_HEADER_ROWS,
        minH: MINIMIZED_ZONE_HEADER_ROWS,
        isResizable: false, // Cannot resize when content is minimized
        isDraggable: !isPinned && (originalZoneConfig.isDraggable ?? true), // Draggable if not pinned
      });
    } else { // Restore content
      setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
      const oldHeights = storedHeightsBeforeMinimize[id];
      updateLayoutItem(id, {
        h: oldHeights?.h || itemCurrentLayout.h,
        minH: oldHeights?.minH || itemCurrentLayout.minH,
        isResizable: !isPinned && (originalZoneConfig.isResizable ?? true), // Resizable if not pinned
        isDraggable: !isPinned && (originalZoneConfig.isDraggable ?? true), // Draggable if not pinned
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
      onZoneClose(id); // Let parent component handle removal from zoneConfigs
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
  
  const layoutsToRender = maximizedZoneId ? storedLayoutsBeforeMaximize || currentLayouts : currentLayouts;

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
      measureBeforeMount={false} // Important for dynamically calculated rowHeight
      useCSSTransforms={true}
    >
      {zoneConfigs.map((zoneConfig) => {
        const rglItem = layoutsToRender[currentBreakpoint]?.find(item => item.i === zoneConfig.id) || 
                        currentLayouts[currentBreakpoint]?.find(item => item.i === zoneConfig.id) || 
                        zoneConfig.defaultLayout.lg;
        
        const isPinned = rglItem.static || false;
        const isCurrentlyMaximized = zoneConfig.id === maximizedZoneId;
        const isCurrentlyMinimized = minimizedZoneIds.includes(zoneConfig.id);

        return (
          <div key={zoneConfig.id} data-grid={rglItem} 
               className={cn(isCurrentlyMaximized && "rgl-maximized-item z-50")}>
            <Zone
              title={zoneConfig.title}
              icon={zoneConfig.icon}
              
              onPinToggle={zoneConfig.canPin !== false ? () => handleTogglePin(zoneConfig.id) : undefined}
              isPinned={isPinned}
              
              onMaximizeToggle={zoneConfig.canMaximize !== false ? () => handleToggleMaximize(zoneConfig.id) : undefined}
              isMaximized={isCurrentlyMaximized}
              
              onMinimizeToggle={zoneConfig.canMinimize !== false ? () => handleToggleMinimize(zoneConfig.id) : undefined}
              isMinimized={isCurrentlyMinimized}
              
              onClose={zoneConfig.canClose !== false ? () => handleActualClose(zoneConfig.id) : undefined}
              
              canPin={zoneConfig.canPin !== false && !isCurrentlyMaximized}
              canMaximize={zoneConfig.canMaximize !== false && !minimizedZoneIds.includes(zoneConfig.id)}
              canMinimize={zoneConfig.canMinimize !== false && !isCurrentlyMaximized}
              canClose={zoneConfig.canClose !== false && !isCurrentlyMaximized}
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
