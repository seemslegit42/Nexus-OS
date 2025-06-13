
// src/app/admin/micro-apps/initial-data.ts
import type { MicroApp } from '@/types/micro-app';

export const mockMicroApps: MicroApp[] = [
  {
    id: 'autopilot_v1',
    internalName: 'autopilot',
    displayName: 'Autopilot Workflow Builder',
    icon: 'Workflow',
    description: 'Visually create and manage multi-step AI-powered automations and task chains.',
    category: 'Automation',
    status: 'enabled', // No change needed
    tags: ['workflow', 'ai', 'visual-editor', 'automation', 'low-code'],
    agentDependencies: ['Orion', 'Proxy'],
    authRequired: true,
    isVisible: true, // No change needed
    requiresSubscription: true,
    monetization: {
        enabled: true,
        price: 29,
        billingCycle: 'monthly',
        billingAgent: 'BillingProxy',
        pricingTierId: 'tier_pro_monthly',
        stripeProductId: 'prod_XyZ123Abc',
        accessControlFlags: ['pro_tier_access']
    },
    flags: { isFeatured: true, requiresBetaFeature: false },
    version: '1.1.0',
    entryPoint: '/loom-studio?app=autopilot', // Exists
    deployableTo: ['loom-studio', 'dashboard'], // Includes 'dashboard'
    permissionsRequired: ['agent:execute', 'workflow:create'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'guardian_sec_v2.3', // SKIPPED due to systemInternal and Security category
    internalName: 'guardian-security-center',
    displayName: 'Guardian Security Center',
    icon: 'ShieldCheck',
    description: 'Monitor system threats, analyze security logs, and manage access controls.',
    category: 'Security',
    status: 'enabled',
    tags: ['security', 'monitoring', 'rbac', 'threat-detection'],
    agentDependencies: ['Aegis', 'LogSentinel'],
    authRequired: true,
    isVisible: true,
    requiresSubscription: false,
    monetization: null,
    flags: { systemInternal: true },
    version: '2.3.1',
    entryPoint: '/security',
    deployableTo: ['dedicated-tab'],
    permissionsRequired: ['security:admin', 'logs:view_sensitive'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pulse_monitor_v0.9b',
    internalName: 'system-pulse',
    displayName: 'System Pulse Monitor',
    icon: 'RadioTower',
    description: 'Live overview of system health, agent activity, and key performance metrics.',
    category: 'Monitoring',
    status: 'enabled', // UPDATED from 'beta'
    tags: ['monitoring', 'health', 'real-time', 'kpi'],
    agentDependencies: [],
    authRequired: true,
    isVisible: true, // No change needed
    requiresSubscription: false,
    monetization: null,
    flags: { requiresBetaFeature: true },
    version: '0.9.0-beta',
    entryPoint: '/pulse', // Exists
    deployableTo: ['dedicated-tab', 'dashboard'], // Includes 'dashboard'
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dev_tools_alpha',
    internalName: 'developer-sandbox',
    displayName: 'Developer Sandbox',
    icon: 'TerminalSquare',
    description: 'Experimental tools and features for NexOS developers. Use with caution.',
    category: 'Development',
    status: 'enabled', // UPDATED from 'dev-only'
    tags: ['experimental', 'debug', 'tools'],
    agentDependencies: [],
    authRequired: true,
    isVisible: true, // UPDATED from false
    requiresSubscription: false,
    monetization: null,
    flags: { isDevOnly: true },
    version: '0.1.0-alpha',
    entryPoint: '/app/developer-sandbox', // UPDATED from undefined
    deployableTo: ['dashboard'], // UPDATED from ['none']
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dashboard-widget-launchpad', // Not skipped: systemInternal but category 'Utilities'
    internalName: 'dashboardLaunchpad',
    displayName: 'Workspace Launchpad',
    icon: 'Rocket',
    description: 'Quickly launch common actions and studio environments.',
    category: 'Utilities',
    status: 'enabled', // No change needed
    tags: ['dashboard', 'quick-actions', 'launcher'],
    agentDependencies: [],
    authRequired: false,
    isVisible: true, // No change needed
    monetization: null,
    flags: { systemInternal: true },
    version: '1.0.0',
    entryPoint: '/launchpad', // Exists
    deployableTo: ['dashboard'], // Includes 'dashboard'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dashboard-widget-activity-feed', // Not skipped: systemInternal but category 'Monitoring'
    internalName: 'dashboardActivityFeed',
    displayName: 'Recent Activity Feed',
    icon: 'Activity',
    description: 'Displays recent system and agent activities.',
    category: 'Monitoring',
    status: 'enabled', // No change needed
    tags: ['logs', 'feed', 'events'],
    agentDependencies: [],
    authRequired: false,
    isVisible: true, // No change needed
    monetization: null,
    flags: { systemInternal: true },
    version: '1.0.0',
    entryPoint: '/monitoring/activity-feed', // Exists
    deployableTo: ['dashboard'], // Includes 'dashboard'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dashboard-widget-agent-presence', // Not skipped: systemInternal but category 'Monitoring'
    internalName: 'dashboardAgentPresence',
    displayName: 'Live Agent Presence',
    icon: 'Cpu',
    description: 'Shows the status and load of active AI agents.',
    category: 'Monitoring',
    status: 'enabled', // No change needed
    tags: ['agents', 'monitoring', 'status'],
    agentDependencies: [],
    authRequired: false,
    isVisible: true, // No change needed
    monetization: null,
    flags: { systemInternal: true },
    version: '1.0.0',
    entryPoint: '/monitoring/agent-presence', // Exists
    deployableTo: ['dashboard'], // Includes 'dashboard'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dashboard-widget-available-apps', // Not skipped: systemInternal but category 'Discovery'
    internalName: 'appDiscovery',
    displayName: 'App Discovery',
    icon: 'LayoutGrid',
    description: 'Discover and launch available micro-applications.',
    category: 'Discovery',
    status: 'enabled', // No change needed
    tags: ['apps', 'launchpad', 'marketplace'],
    agentDependencies: [],
    authRequired: false,
    isVisible: true, // No change needed
    monetization: null,
    flags: { systemInternal: true },
    version: '1.0.0',
    entryPoint: '/explore', // Exists
    deployableTo: ['dashboard'], // Includes 'dashboard'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
    
