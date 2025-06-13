
// src/components/core/workspace-grid.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { Zone } from '@/components/core/zone';
import { ZoneSettingsDrawer } from '@/components/core/zone-settings-drawer';
import { cn } from '@/lib/utils';
import { useLogs } from '@/contexts/LogContext'; 

const ResponsiveGridLayout = WidthProvider(Responsive);

const MINIMIZED_ZONE_HEADER_ROWS = 2; 
const DEFAULT_ROW_HEIGHT_PIXELS = 30; 

export interface ZoneSpecificSettings {
  isVisible: boolean;
  linkedAgent: string | null;
  scheduleTime: string | null;
  notificationsEnabled: boolean;
  hasActiveAutomation?: boolean;
}

export interface ZoneConfig {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  defaultLayout: Layout; // Simplified: use only 'lg' as base, RGL handles others if not specified in layouts prop
  minW?: number;
  minH?: number;
  static?: boolean; 
  isResizable?: boolean;
  isDraggable?: boolean;
  canPin?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canClose?: boolean;
  canSettings?: boolean;
  defaultZoneSettings?: Partial<ZoneSpecificSettings>;
  onOpenApp?: (zoneId: string, zoneTitle: string) => void;
  onRunTask?: (zoneId: string, zoneTitle: string) => Promise<void>;
  onViewLogs?: (zoneId: string, zoneTitle: string) => void;
}

interface WorkspaceGridProps {
  zoneConfigs: ZoneConfig[];
  className?: string;
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
  rowHeight?: number; // Allow rowHeight override
  onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
  onZoneClose?: (id: string) => void;
  storageKey?: string; // For localStorage persistence
}

export function WorkspaceGrid({
  zoneConfigs: initialZoneConfigs,
  className,
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight, // Accept optional rowHeight prop
  onLayoutChange,
  onZoneClose,
  storageKey,
}: WorkspaceGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentLayouts, setCurrentLayouts] = useState<Layouts>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  
  const [maximizedZoneId, setMaximizedZoneId] = useState<string | null>(null);
  const [storedLayoutsBeforeMaximize, setStoredLayoutsBeforeMaximize] = useState<Layouts | null>(null);
  
  const [minimizedZoneIds, setMinimizedZoneIds] = useState<string[]>([]);
  const [storedHeightsBeforeMinimize, setStoredHeightsBeforeMinimize] = useState<Record<string, { h: number; minH: number }>>({});
  const [locallyClosedZoneIds, setLocallyClosedZoneIds] = useState<string[]>([]);

  const [dynamicRowHeight, setDynamicRowHeight] = useState(rowHeight || DEFAULT_ROW_HEIGHT_PIXELS);

  const [zoneSettingsMap, setZoneSettingsMap] = useState<Record<string, ZoneSpecificSettings>>({});
  const [editingSettingsForZoneId, setEditingSettingsForZoneId] = useState<string | null>(null);

  const { addLog } = useLogs();

  const handleOpenApp = useCallback((zoneId: string, zoneTitle: string) => {
    addLog(`'Open App' action triggered for zone: ${zoneTitle} (ID: ${zoneId})`, 'WorkspaceAction');
    alert(`Simulating opening app: ${zoneTitle}`);
  }, [addLog]);

  const handleRunTask = useCallback(async (zoneId: string, zoneTitle: string) => {
    addLog(`'Run Task Now' initiated for zone: ${zoneTitle} (ID: ${zoneId})`, 'WorkspaceAction');
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog(`Task completed for zone: ${zoneTitle} (ID: ${zoneId})`, 'WorkspaceAction');
  }, [addLog]);

  const handleViewLogs = useCallback((zoneId: string, zoneTitle: string) => {
    addLog(`'View Logs' action triggered for zone: ${zoneTitle} (ID: ${zoneId})`, 'WorkspaceAction');
    alert(`Simulating viewing logs for: ${zoneTitle}. Check persistent console.`);
  }, [addLog]);

  const zoneConfigs = initialZoneConfigs.map(zc => ({
    ...zc,
    onOpenApp: zc.onOpenApp || handleOpenApp,
    onRunTask: zc.onRunTask || handleRunTask,
    onViewLogs: zc.onViewLogs || handleViewLogs,
  }));

  useEffect(() => {
    if (!rowHeight) { // Only calculate if not overridden
        const dummyHeader = document.createElement('div');
        dummyHeader.className = 'draggable-zone-header flex flex-row items-center justify-between space-y-0 p-3 border-b border-border/50 min-h-[48px]';
        dummyHeader.style.position = 'absolute';
        dummyHeader.style.visibility = 'hidden';
        dummyHeader.style.width = '300px'; 
        document.body.appendChild(dummyHeader);
        const headerPixelHeight = dummyHeader.offsetHeight || 48; 
        document.body.removeChild(dummyHeader);
        setDynamicRowHeight(Math.max(10, Math.ceil(headerPixelHeight / MINIMIZED_ZONE_HEADER_ROWS)));
    }
  }, [rowHeight]);

  useEffect(() => {
    const initialSettings: Record<string, ZoneSpecificSettings> = {};
    zoneConfigs.forEach(zc => {
      initialSettings[zc.id] = {
        isVisible: zc.defaultZoneSettings?.isVisible ?? true,
        linkedAgent: zc.defaultZoneSettings?.linkedAgent ?? null,
        scheduleTime: zc.defaultZoneSettings?.scheduleTime ?? null,
        notificationsEnabled: zc.defaultZoneSettings?.notificationsEnabled ?? true,
        hasActiveAutomation: false, 
      };
      initialSettings[zc.id].hasActiveAutomation = 
        !!(initialSettings[zc.id].scheduleTime || initialSettings[zc.id].linkedAgent);
    });
    setZoneSettingsMap(initialSettings);
  }, [zoneConfigs]);
  
  const initializeDefaultLayouts = useCallback(() => {
    const initialLayouts: Layouts = {};
    Object.keys(cols).forEach(bpKey => {
      const bp = bpKey as keyof typeof cols;
      initialLayouts[bp] = zoneConfigs
        .filter(zc => !locallyClosedZoneIds.includes(zc.id) && (zoneSettingsMap[zc.id]?.isVisible ?? true))
        .map(zc => {
          const layoutConfig = zc.defaultLayout; 
          const itemStatic = layoutConfig.static ?? zc.static ?? false;
          const itemIsResizable = layoutConfig.isResizable ?? zc.isResizable ?? !itemStatic;
          const itemIsDraggable = layoutConfig.isDraggable ?? zc.isDraggable ?? !itemStatic;

          return {
            i: zc.id,
            ...layoutConfig,
            minW: layoutConfig.minW ?? zc.minW ?? 1,
            minH: layoutConfig.minH ?? zc.minH ?? MINIMIZED_ZONE_HEADER_ROWS,
            static: itemStatic,
            isResizable: itemIsResizable,
            isDraggable: itemIsDraggable,
          };
        });
    });
    setCurrentLayouts(initialLayouts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneConfigs, cols, dynamicRowHeight, locallyClosedZoneIds, zoneSettingsMap]);


  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      const savedLayouts = localStorage.getItem(storageKey);
      if (savedLayouts) {
        try {
          const parsedLayouts = JSON.parse(savedLayouts);
          if (typeof parsedLayouts === 'object' && parsedLayouts !== null && Object.keys(parsedLayouts).some(key => cols.hasOwnProperty(key))) {
            setCurrentLayouts(parsedLayouts);
          } else {
            console.warn(`Invalid layouts found in localStorage for key "${storageKey}". Using defaults.`);
            initializeDefaultLayouts();
          }
        } catch (e) {
          console.error(`Error parsing layouts from localStorage for key "${storageKey}":`, e);
          initializeDefaultLayouts();
        }
      } else {
        initializeDefaultLayouts();
      }
    } else {
      initializeDefaultLayouts();
    }
    setIsMounted(true);
  }, [storageKey, initializeDefaultLayouts, cols]);


  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    if (JSON.stringify(allLayouts) !== JSON.stringify(currentLayouts)) {
      if (!maximizedZoneId) { 
         setCurrentLayouts(allLayouts);
         if (storageKey && typeof window !== 'undefined') {
           localStorage.setItem(storageKey, JSON.stringify(allLayouts));
         }
      }
    }
    if (onLayoutChange) {
      onLayoutChange(currentLayout, allLayouts);
    }
  };
  
  const updateLayoutItemForAllBreakpoints = useCallback((id: string, newProps: Partial<Layout>) => {
    setCurrentLayouts(prev => {
      const newLayouts = JSON.parse(JSON.stringify(prev)); 
      Object.keys(newLayouts).forEach(bp => {
        const bpLayout = newLayouts[bp] as Layout[] | undefined;
        const itemIndex = bpLayout?.findIndex(item => item.i === id);
        if (bpLayout && typeof itemIndex === 'number' && itemIndex !== -1 && itemIndex < bpLayout.length) {
          const currentItem = bpLayout[itemIndex];
          bpLayout[itemIndex] = { ...currentItem, ...newProps };
        }
      });
      if (storageKey && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(newLayouts));
      }
      return newLayouts;
    });
  }, [storageKey]);

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
  }, [currentLayouts, currentBreakpoint, maximizedZoneId, minimizedZoneIds, updateLayoutItemForAllBreakpoints]);

  const handleToggleMaximize = useCallback((id: string) => {
    setCurrentLayouts(prevLayouts => {
      let newLayoutsState = JSON.parse(JSON.stringify(prevLayouts));
      if (maximizedZoneId === id) { 
        setMaximizedZoneId(null);
        newLayoutsState = storedLayoutsBeforeMaximize || newLayoutsState;
        setStoredLayoutsBeforeMaximize(null);
        Object.keys(newLayoutsState).forEach(bp => {
          if (newLayoutsState[bp]) {
             (newLayoutsState[bp] as Layout[]).forEach((itemL: Layout) => {
              const wasMinimizedBeforeMaximize = minimizedZoneIds.includes(itemL.i) && storedLayoutsBeforeMaximize?.[bp]?.find(l => l.i === itemL.i);
              if (wasMinimizedBeforeMaximize) {
                itemL.h = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.minH = MINIMIZED_ZONE_HEADER_ROWS;
                itemL.isResizable = false;
              }
            });
          }
        });
      } else if (!maximizedZoneId) { 
        setStoredLayoutsBeforeMaximize(JSON.parse(JSON.stringify(prevLayouts)));
        setMaximizedZoneId(id);
        const updatedMinimizedZoneIds = minimizedZoneIds.filter(minId => minId !== id);
        setMinimizedZoneIds(updatedMinimizedZoneIds);
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
                const viewportHeightInRows = Math.floor(window.innerHeight / (dynamicRowHeight + 5 )); 
                itemL.h = Math.max(10, viewportHeightInRows - MINIMIZED_ZONE_HEADER_ROWS -1); 
                itemL.minH = Math.max(MINIMIZED_ZONE_HEADER_ROWS, itemL.h); 
                itemL.static = true;
                itemL.isDraggable = false;
                itemL.isResizable = false;
              } else { 
                 itemL.static = true; 
                 itemL.isDraggable = false;
                 itemL.isResizable = false;
              }
            });
          }
        });
      }
      if (storageKey && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(newLayoutsState));
      }
      return newLayoutsState; 
    });
  }, [maximizedZoneId, storedLayoutsBeforeMaximize, cols, dynamicRowHeight, minimizedZoneIds, storageKey]);
  
  const handleToggleMinimize = useCallback((id: string) => {
    if (maximizedZoneId) return;
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
  }, [maximizedZoneId, minimizedZoneIds, currentLayouts, currentBreakpoint, storedHeightsBeforeMinimize, updateLayoutItemForAllBreakpoints]);

  const handleActualClose = useCallback((id: string) => {
    if (maximizedZoneId) return; 
    addLog(`Zone '${zoneConfigs.find(zc => zc.id === id)?.title || id}' removed.`, 'WorkspaceAction');
    if (onZoneClose) {
      onZoneClose(id); 
    } else {
      setLocallyClosedZoneIds(prev => [...prev, id]);
      setStoredHeightsBeforeMinimize(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
      setMinimizedZoneIds(prev => prev.filter(minId => minId !== id));
    }
  }, [maximizedZoneId, addLog, zoneConfigs, onZoneClose]);

  const handleOpenSettingsDrawer = useCallback((zoneId: string) => {
    setEditingSettingsForZoneId(zoneId);
  }, []);

  const handleSaveZoneSettings = useCallback((zoneId: string, newSettings: ZoneSpecificSettings) => {
    const derivedHasActiveAutomation = !!(newSettings.scheduleTime || (newSettings.linkedAgent && newSettings.linkedAgent !== 'None'));
    setZoneSettingsMap(prev => ({
      ...prev,
      [zoneId]: { ...newSettings, hasActiveAutomation: derivedHasActiveAutomation },
    }));
    if (!newSettings.isVisible && !locallyClosedZoneIds.includes(zoneId)) {
        if(!onZoneClose){ 
             setLocallyClosedZoneIds(prev => [...prev, zoneId]);
        }
    } else if (newSettings.isVisible && locallyClosedZoneIds.includes(zoneId)) {
        if(!onZoneClose){
            setLocallyClosedZoneIds(prev => prev.filter(id => id !== zoneId));
        }
    }
    addLog(`Settings saved for zone: ${zoneConfigs.find(zc => zc.id === zoneId)?.title || zoneId}`, 'WorkspaceAction');
  }, [addLog, zoneConfigs, onZoneClose, locallyClosedZoneIds]);


  if (!isMounted || !dynamicRowHeight || (dynamicRowHeight === DEFAULT_ROW_HEIGHT_PIXELS && zoneConfigs.length > 0 && typeof window !== 'undefined' && !rowHeight)) {
    return (
      <div className={cn("layout grid-placeholder", className)} style={{minHeight: '300px'}}>
        {zoneConfigs
          .filter(zc => !locallyClosedZoneIds.includes(zc.id) && (zoneSettingsMap[zc.id]?.isVisible ?? true))
          .map(zc => (
          <div key={zc.id} className="bg-muted/30 rounded-lg p-4">Loading {zc.title}...</div>
        ))}
      </div>
    );
  }
  
  const layoutsToRender = currentLayouts; 
  const activeZoneConfigs = zoneConfigs.filter(zc => 
    !locallyClosedZoneIds.includes(zc.id) && 
    (zoneSettingsMap[zc.id]?.isVisible ?? true)
  );

  const currentEditingZoneConfig = zoneConfigs.find(zc => zc.id === editingSettingsForZoneId);

  return (
    <>
      <ResponsiveGridLayout
        className={cn("layout", className)}
        layouts={layoutsToRender}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={cols}
        rowHeight={dynamicRowHeight}
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
                          zoneConfig.defaultLayout; 
          
          const isEffectivelyPinned = rglItem?.static || false; 
          const isCurrentlyMaximized = zoneConfig.id === maximizedZoneId;
          const isActuallyMinimized = minimizedZoneIds.includes(zoneConfig.id);

          const canPinZone = zoneConfig.canPin !== false && !isCurrentlyMaximized;
          const canMaximizeZone = zoneConfig.canMaximize !== false && !isActuallyMinimized && (!maximizedZoneId || isCurrentlyMaximized) ;
          const canMinimizeZone = zoneConfig.canMinimize !== false && !isCurrentlyMaximized;
          const canCloseZone = zoneConfig.canClose !== false && !isCurrentlyMaximized; 
          const canSettingsZone = zoneConfig.canSettings !== false && !isCurrentlyMaximized;
          const currentZoneSettings = zoneSettingsMap[zoneConfig.id];

          if (!rglItem) { 
            console.warn(`Layout item for zone ${zoneConfig.id} not found for breakpoint ${currentBreakpoint}. Skipping render.`);
            return null;
          }


          return (
            <div key={zoneConfig.id} data-grid={rglItem} 
                 className={cn(isCurrentlyMaximized && "rgl-maximized-item z-50")}>
              <Zone
                id={zoneConfig.id} 
                title={zoneConfig.title}
                icon={zoneConfig.icon}
                onPinToggle={handleTogglePin}
                isPinned={isEffectivelyPinned}
                onMaximizeToggle={handleToggleMaximize}
                isMaximized={isCurrentlyMaximized}
                onMinimizeToggle={handleToggleMinimize}
                isMinimized={isActuallyMinimized}
                onClose={handleActualClose} 
                onSettingsToggle={handleOpenSettingsDrawer} 
                canPin={canPinZone}
                canMaximize={canMaximizeZone}
                canMinimize={canMinimizeZone}
                canClose={canCloseZone} 
                canSettings={canSettingsZone}
                hasActiveAutomation={currentZoneSettings?.hasActiveAutomation ?? false}
                onOpenApp={zoneConfig.onOpenApp}
                onRunTask={zoneConfig.onRunTask}
                onViewLogs={zoneConfig.onViewLogs}
                className="h-full" 
              >
                {zoneConfig.content}
              </Zone>
            </div>
          );
        })}
      </ResponsiveGridLayout>
      
      {editingSettingsForZoneId && currentEditingZoneConfig && (
        <ZoneSettingsDrawer
          zoneId={editingSettingsForZoneId}
          zoneTitle={currentEditingZoneConfig.title}
          currentSettings={zoneSettingsMap[editingSettingsForZoneId]}
          onOpenChange={(open) => { if (!open) setEditingSettingsForZoneId(null); }}
          onSaveSettings={handleSaveZoneSettings}
        />
      )}
    </>
  );
}
    
