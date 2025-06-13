
// This registry maps micro-app IDs (ideally from your MicroApp type in types/micro-app.ts)
// to a function that performs the dynamic import.
const microAppRegistry: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  autopilot_v1: () => import('./WorkflowBuilderPlaceholder'),
  pulse_monitor_v0_9b: () => import('./SystemMonitor'),
  dev_tools_alpha: () => import('./DocsViewer'), // Reusing DocsViewer as a generic dev tool placeholder
  'smart-lead-tracker': () => import('./SmartLeadTracker'),
  'security-surface-scan-app': () => import('./SecuritySurfaceScanApp'), // Added new app
  // Add new micro-apps here, for example:
  // 'invoice-generator': () => import('./invoice-generator/InvoiceGenerator'),
  // 'ai-notepad': () => import('./ai-notepad/AINotepad'),
};

// Helper function to get a dynamic import function by its app ID
export function getDynamicImportFn(appId: string): (() => Promise<{ default: React.ComponentType<any> }>) | null {
  return microAppRegistry[appId] || null;
}
