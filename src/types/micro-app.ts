
// src/types/micro-app.ts

/**
 * Represents a micro-application within the NexOS ecosystem.
 */
export interface MicroApp {
  id: string; // Unique identifier (e.g., "autopilot_workflow_builder_v1.0.0")
  internalName: string; // Slug-like, unique internal name (e.g., "autopilot")
  displayName: string; // User-facing name (e.g., "Autopilot Workflow Builder")
  icon: string; // Icon identifier (e.g., 'Workflow' for a Lucide icon, or a URL)
  description: string;
  category: string; // e.g., "Automation", "Analytics", "Security", "Productivity", "Development", "Monitoring", "Communication", "Utilities", "Core OS", "Discovery", "Information"
  status: 'enabled' | 'disabled' | 'dev-only' | 'archived' | 'beta';
  tags: string[]; // e.g., ["workflow", "ai", "visual-editor", "automation"]
  agentDependencies: string[]; // Array of agent IDs/names (e.g., ["OptimizerPrime", "Orion"])
  authRequired: boolean;
  requiresSubscription?: boolean; // New flag: if true, app needs an active subscription
  monetization: {
    enabled: boolean;
    price?: number; // e.g., 49.99
    billingCycle?: 'monthly' | 'one-time' | 'usage-based';
    billingAgent?: string; // Agent ID/name for handling billing (e.g., "BillingProxy")
    pricingTierId?: string; // Identifier for a predefined pricing tier
    stripeProductId?: string; // Stripe Product ID for subscription/payment
    accessControlFlags?: string[]; // e.g., ["pro_feature", "enterprise_only"]
  } | null;
  flags: {
    isFeatured?: boolean;
    isDevOnly?: boolean; // Can be derived from status, but explicit flag might be useful
    requiresBetaFeature?: boolean; // If the micro-app depends on an OS beta feature
    systemInternal?: boolean; // If it's a core OS micro-app not meant for general toggling
  };
  isVisible: boolean; // Is the app generally visible/deployable on dashboards/launchpads
  version: string; // e.g., "1.0.2"
  entryPoint?: string; // Path to the micro-app, e.g., "/autopilot" or a specific launch command
  defaultLayout?: { // This can remain as it's for generic WorkspaceGrid placement
    lg: { x: number; y: number; w: number; h: number; minW?: number; minH?: number; static?: boolean };
    md?: { x: number; y: number; w: number; h: number; minW?: number; minH?: number; static?: boolean };
    sm?: { x: number; y: number; w: number; h: number; minW?: number; minH?: number; static?: boolean };
  };
  deployableTo: ('dashboard' | 'loom-studio' | 'dedicated-tab' | 'none')[]; // Where it can be deployed/launched from
  permissionsRequired?: string[]; // List of specific permission strings this app needs
  creatorId?: string; // User ID of the creator/publisher
  lastDeployedAt?: string | null; // ISO Date string of last deployment
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

    