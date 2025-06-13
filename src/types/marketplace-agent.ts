
// src/types/marketplace-agent.ts

/**
 * Represents an AI Agent available for discovery and deployment from the NexOS Marketplace.
 */
export interface MarketplaceAgent {
  id: string; // Unique identifier (e.g., "optimizer_prime_v1")
  name: string; // User-facing name (e.g., "OptimizerPrime")
  tagline: string; // Short, catchy phrase describing the agent's core function
  description: string; // Detailed explanation of what the agent does, its capabilities, and use cases
  longDescription?: string; // More extensive details, perhaps markdown content for a detail page
  icon: string; // Lucide icon name (e.g., "Cpu", "Brain", "Shield")
  category: string; // e.g., "Data Analysis", "Workflow Automation", "Security Monitoring", "Content Generation"
  version: string; // Semantic versioning, e.g., "1.0.2"
  author: string; // Creator or publisher of the agent (e.g., "NexOS Labs", "CommunityContributorX")
  tags: string[]; // Keywords for discoverability (e.g., ["optimization", "code_analysis", "performance"])
  status: 'available' | 'beta' | 'preview' | 'coming_soon' | 'deprecated'; // Lifecycle status
  
  capabilities: { // Key features or tasks the agent can perform
    title: string;
    description: string;
    icon?: string; // Optional icon for each capability
  }[];

  pricing: {
    type: 'free' | 'one-time' | 'subscription' | 'usage-based';
    amount?: number; // e.g., 19.99 (if applicable)
    currency?: string; // e.g., "USD" (if applicable)
    billingCycle?: 'monthly' | 'annually'; // For subscription type
    tier?: string; // Name of the pricing tier, e.g., "Pro Agent Access", "Enterprise Agent Pack"
    detailsUrl?: string; // Link to a more detailed pricing page or documentation
    trialDays?: number; // Number of days for a free trial, if applicable
  } | null; // Null if inherently free or bundled

  entryPoint: string; // Base path for the agent's detail/configuration page, e.g., "/explore/agents/optimizer_prime_v1"
  
  // Visuals for marketplace card and detail page
  heroImage?: string; // URL for a primary promotional image
  previewImages?: string[]; // URLs for screenshots or diagrams showcasing the agent
  dataAiHints?: string[]; // For placeholder images if real ones aren't available

  // Technical & Operational Details
  requiredOsVersion?: string; // Minimum NexOS version compatibility
  dependencies?: string[]; // Other agents or modules this agent depends on
  permissionsRequired?: string[]; // Specific NexOS permissions needed to operate

  // Community & Support
  documentationUrl?: string;
  supportUrl?: string;
  userRating?: {
    average: number; // e.g., 4.5
    count: number; // e.g., 120
  };

  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}
