
import React, { lazy } from 'react';

// Define a type for the registry entries
export interface MicroAppRegistryEntry {
  id: string; // Should match the ID in MicroApp type from micro-app.store.ts
  label: string; // User-friendly label, can be same as displayName
  icon?: string; // Lucide icon name string
  component: React.LazyExoticComponent<React.ComponentType<any>>; // The actual component
  // We can add more specific props typing here if needed for micro-apps
  // props?: Record<string, any>; 
}

// This registry maps micro-app IDs (ideally from your MicroApp type in types/micro-app.ts)
// to their lazily-loaded React components.
export const microAppUIComponentRegistry: Record<string, MicroAppRegistryEntry> = {
  // ID should match an ID from useMicroAppRegistryStore for consistency
  // Example: using IDs from mockMicroApps in initial-data.ts
  autopilot_v1: {
    id: 'autopilot_v1',
    label: 'Autopilot Workflow Builder',
    icon: 'Workflow',
    component: lazy(() => import('./components/WorkflowBuilderPlaceholder')),
  },
  pulse_monitor_v0_9b: { // Note: using underscores for IDs from initial-data
    id: 'pulse_monitor_v0.9b',
    label: 'System Pulse Monitor',
    icon: 'RadioTower',
    component: lazy(() => import('./components/SystemMonitor')),
  },
  dev_tools_alpha: {
    id: 'dev_tools_alpha',
    label: 'Developer Sandbox',
    icon: 'TerminalSquare',
    component: lazy(() => import('./components/DocsViewer')), // Reusing DocsViewer as a generic dev tool placeholder
  },
  // Add more entries as you create more micro-app components
  // Example of a non-store-registered component for pure UI:
  genericDocsViewer: {
    id: 'genericDocsViewer',
    label: 'Generic Document Viewer',
    icon: 'BookOpen',
    component: lazy(() => import('./components/DocsViewer')),
  }
};

// Helper function to get a component by its ID
export const getMicroAppComponent = (appId: string): React.LazyExoticComponent<React.ComponentType<any>> | null => {
  return microAppUIComponentRegistry[appId]?.component || null;
};
