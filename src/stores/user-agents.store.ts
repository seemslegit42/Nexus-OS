
// src/stores/user-agents.store.ts
import { create } from 'zustand';

interface UserAgentsState {
  acquiredAgentIds: string[];
  addAgentId: (id: string) => void;
  isAcquired: (id: string) => boolean;
  // removeAgentId could be added later if needed
}

export const useUserAgentsStore = create<UserAgentsState>((set, get) => ({
  acquiredAgentIds: [],
  addAgentId: (id) => {
    if (!get().acquiredAgentIds.includes(id)) {
      set((state) => ({ acquiredAgentIds: [...state.acquiredAgentIds, id] }));
    }
  },
  isAcquired: (id) => get().acquiredAgentIds.includes(id),
}));
