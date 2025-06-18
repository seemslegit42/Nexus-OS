// src/app/(public)/explore/agents/initial-data.ts
import type { MarketplaceAgent } from '@/types/marketplace-agent';

export const mockMarketplaceAgents: MarketplaceAgent[] = [
  {
    id: 'optimizer_prime_v1',
    name: 'OptimizerPrime',
    tagline: 'Your AI Code & Workflow Optimization Expert.',
    description:
      'OptimizerPrime analyzes your code, workflows, and system configurations to suggest and (optionally) implement performance enhancements, security hardening, and best-practice alignments. It integrates deeply with NexOS modules and the Loom Studio.',
    icon: 'Cpu', // Lucide icon name
    category: 'Development & Optimization',
    version: '1.2.1',
    author: 'NexOS Labs',
    tags: [
      'optimization',
      'code analysis',
      'performance',
      'security',
      'ai developer tool',
    ],
    status: 'available',
    capabilities: [
      {
        title: 'Automated Code Review',
        description:
          'Identifies potential bottlenecks and vulnerabilities in your scripts and module code.',
      },
      {
        title: 'Workflow Efficiency Analysis',
        description:
          'Suggests improvements to Loom Studio workflows for speed and cost-effectiveness.',
      },
      {
        title: 'Resource Allocation Tuning',
        description: 'Helps optimize agent and module resource usage.',
      },
    ],
    pricing: {
      type: 'subscription',
      amount: 29,
      currency: 'USD',
      billingCycle: 'monthly',
      tier: 'Pro Developer Tier',
    },
    entryPoint: '/explore/agents/optimizer_prime_v1',
    heroImage: 'https://placehold.co/800x450.png',
    dataAiHints: ['ai code optimization abstract'],
    previewImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'guardian_angel_v2',
    name: 'GuardianAngel AI',
    tagline: 'Proactive Security & Threat Monitoring Agent.',
    description:
      'GuardianAngel AI continuously monitors your NexOS environment for suspicious activities, policy violations, and emerging threats. It provides real-time alerts and can automate defensive actions based on configured protocols.',
    icon: 'ShieldCheck',
    category: 'Security',
    version: '2.0.3',
    author: 'SecureSphere Inc.',
    tags: [
      'security',
      'threat detection',
      'monitoring',
      'rbac',
      'compliance',
      'automated defense',
    ],
    status: 'available',
    capabilities: [
      {
        title: 'Real-time Anomaly Detection',
        description: 'Uses behavioral analysis to spot unusual patterns.',
      },
      {
        title: 'Automated Threat Response',
        description:
          'Can isolate agents, block IPs, or alert admins based on rules.',
      },
      {
        title: 'Compliance Reporting Aid',
        description: 'Helps gather data for security audits.',
      },
    ],
    pricing: {
      type: 'subscription',
      amount: 49,
      currency: 'USD',
      billingCycle: 'monthly',
      tier: 'Enterprise Security Suite',
    },
    entryPoint: '/explore/agents/guardian_angel_v2',
    heroImage: 'https://placehold.co/800x450.png',
    dataAiHints: ['cyber security shield network'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content_scribe_beta',
    name: 'ContentScribe',
    tagline: 'AI-Powered Content Generation Assistant.',
    description:
      'ContentScribe helps you draft articles, marketing copy, code documentation, and more. It can learn your style and integrate with various data sources for context-aware content.',
    icon: 'Sparkles', // Or 'Feather', 'Edit3'
    category: 'Content Generation',
    version: '0.8.5',
    author: 'NexOS Labs',
    tags: [
      'writing',
      'ai content',
      'nlp',
      'drafting',
      'marketing',
      'documentation',
    ],
    status: 'beta',
    capabilities: [
      {
        title: 'Versatile Text Generation',
        description: 'Creates various types of content from prompts.',
      },
      {
        title: 'Style Adaptation',
        description: 'Learns and mimics preferred writing styles.',
      },
      {
        title: 'Data Source Integration',
        description: 'Pulls context from connected modules or File Vault.',
      },
    ],
    pricing: {
      type: 'free', // Beta might be free, or have a specific beta access tier
      tier: 'Beta Program Access',
    },
    entryPoint: '/explore/agents/content_scribe_beta',
    heroImage: 'https://placehold.co/800x450.png',
    dataAiHints: ['ai writing creative abstract'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'taskmaster_automate_v1',
    name: 'TaskMaster Automate',
    tagline: 'Your Personal Workflow & Task Automation Agent.',
    description:
      'TaskMaster Automate watches for triggers and executes pre-defined sequences of actions across your NexOS items and modules. Ideal for automating routine business processes, notifications, and data synchronization tasks.',
    icon: 'Workflow',
    category: 'Workflow Automation',
    version: '1.0.0',
    author: 'AutoPilots Co.',
    tags: ['automation', 'workflow', 'task management', 'ifttt', 'zapier-like'],
    status: 'available',
    capabilities: [
      {
        title: 'Trigger-Based Execution',
        description:
          'Responds to system events, schedules, or manual triggers.',
      },
      {
        title: 'Multi-Step Action Chains',
        description:
          'Orchestrates complex sequences involving multiple agents or modules.',
      },
      {
        title: 'Conditional Logic',
        description: 'Implements if/then/else branching in automations.',
      },
    ],
    pricing: {
      type: 'usage-based',
      detailsUrl: '/pricing#automation-credits', // Link to where usage credits are explained
      tier: 'Automation Credits',
    },
    entryPoint: '/explore/agents/taskmaster_automate_v1',
    heroImage: 'https://placehold.co/800x450.png',
    dataAiHints: ['workflow automation gears connection'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
