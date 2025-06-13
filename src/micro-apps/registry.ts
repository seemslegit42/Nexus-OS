
// This registry maps micro-app IDs (ideally from your MicroApp type in types/micro-app.ts)
// to a function that performs the dynamic import.
const microAppRegistry: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  autopilot_v1: () => import('./components/WorkflowBuilderPlaceholder'),
  pulse_monitor_v0_9b: () => import('./components/SystemMonitor'),
  dev_tools_alpha: () => import('./components/DocsViewer'), // Reusing DocsViewer as a generic dev tool placeholder
  'smart-lead-tracker': () => import('./components/SmartLeadTracker'),
  // Add new micro-apps here, for example:
  // 'invoice-generator': () => import('./invoice-generator/InvoiceGenerator'),
  // 'ai-notepad': () => import('./ai-notepad/AINotepad'),
};

// Helper function to get a dynamic import function by its app ID
export function getDynamicImportFn(appId: string): (() => Promise<{ default: React.ComponentType<any> }>) | null {
  return microAppRegistry[appId] || null;
}
