// src/stores/agent-marketplace.store.ts
import { create } from 'zustand';
import type { MarketplaceAgent } from '@/types/marketplace-agent';
import { mockMarketplaceAgents } from '@/app/(public)/explore/agents/initial-data';

export interface AgentMarketplaceState {
  agents: MarketplaceAgent[];
  getAgentById: (id: string) => MarketplaceAgent | undefined;
  searchAgents: (term: string) => MarketplaceAgent[];
  getAgentsByCategory: (category: string) => MarketplaceAgent[];
  // Potential future actions: addAgent, updateAgent, etc.
}

export const useAgentMarketplaceStore = create<AgentMarketplaceState>(
  (set, get) => ({
    agents: mockMarketplaceAgents,
    getAgentById: id => get().agents.find(agent => agent.id === id),
    searchAgents: term => {
      const lowercasedTerm = term.toLowerCase().trim();
      if (!lowercasedTerm) return get().agents;
      return get().agents.filter(
        agent =>
          agent.name.toLowerCase().includes(lowercasedTerm) ||
          agent.tagline.toLowerCase().includes(lowercasedTerm) ||
          agent.description.toLowerCase().includes(lowercasedTerm) ||
          agent.category.toLowerCase().includes(lowercasedTerm) ||
          (agent.tags &&
            agent.tags.some(tag =>
              tag.toLowerCase().includes(lowercasedTerm)
            )) ||
          agent.author.toLowerCase().includes(lowercasedTerm)
      );
    },
    getAgentsByCategory: category => {
      const lowercasedCategory = category.toLowerCase();
      return get().agents.filter(
        agent => agent.category.toLowerCase() === lowercasedCategory
      );
    },
  })
);
