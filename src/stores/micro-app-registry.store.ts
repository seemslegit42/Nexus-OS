
// src/stores/micro-app-registry.store.ts
import { create } from 'zustand';
import type { MicroApp } from '@/types/micro-app';
import { mockMicroApps as initialApps } from '@/app/admin/micro-apps/initial-data';

// Define the cycle of statuses for toggling
const STATUS_CYCLE: MicroApp['status'][] = ['dev-only', 'beta', 'enabled', 'disabled'];

export interface MicroAppRegistryState {
  apps: MicroApp[];
  getMicroApp: (id: string) => MicroApp | undefined;
  updateMicroApp: (id: string, updatedData: Partial<MicroApp>) => void;
  registerMicroApp: (newAppData: Partial<Omit<MicroApp, 'id' | 'createdAt' | 'updatedAt'>> & { internalName: string, displayName: string }) => void;
  toggleAppStatus: (id: string) => void;
  // Selectors
  getAppsByStatus: (statusFilter: MicroApp['status']) => MicroApp[];
  searchApps: (term: string) => MicroApp[];
  getAppsByFlag: (flagName: keyof MicroApp['flags'] | 'monetized') => MicroApp[];
}

export const useMicroAppRegistryStore = create<MicroAppRegistryState>((set, get) => ({
  apps: initialApps,
  getMicroApp: (id) => get().apps.find(app => app.id === id),
  updateMicroApp: (id, updatedData) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, ...updatedData, updatedAt: new Date().toISOString() } : app
      ),
    })),
  registerMicroApp: (newAppData) => {
    const newApp: MicroApp = {
      id: `${newAppData.internalName.replace(/\s+/g, '-').toLowerCase()}_${new Date().getTime().toString(36)}`,
      internalName: newAppData.internalName,
      displayName: newAppData.displayName,
      icon: newAppData.icon || 'Package',
      description: newAppData.description || 'A new micro-application for NexOS.',
      category: newAppData.category || 'General',
      status: newAppData.status || 'dev-only',
      tags: newAppData.tags || [],
      agentDependencies: newAppData.agentDependencies || [],
      authRequired: newAppData.authRequired !== undefined ? newAppData.authRequired : true,
      monetization: newAppData.monetization !== undefined ? newAppData.monetization : null,
      flags: newAppData.flags || {},
      version: newAppData.version || '0.1.0',
      deployableTo: newAppData.deployableTo || ['none'],
      permissionsRequired: newAppData.permissionsRequired || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newAppData, // Spread the rest of the partial data
    };
    set((state) => ({
      apps: [newApp, ...state.apps],
    }));
  },
  toggleAppStatus: (id) => {
    set((state) => ({
      apps: state.apps.map((app) => {
        if (app.id === id) {
          const currentIndex = STATUS_CYCLE.indexOf(app.status);
          const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
          return { ...app, status: STATUS_CYCLE[nextIndex], updatedAt: new Date().toISOString() };
        }
        return app;
      }),
    }));
  },
  // Selectors
  getAppsByStatus: (statusFilter) => {
    return get().apps.filter(app => app.status === statusFilter);
  },
  searchApps: (term) => {
    const lowercasedTerm = term.toLowerCase().trim();
    if (!lowercasedTerm) return get().apps;
    return get().apps.filter(app =>
      app.displayName.toLowerCase().includes(lowercasedTerm) ||
      app.internalName.toLowerCase().includes(lowercasedTerm) ||
      app.description.toLowerCase().includes(lowercasedTerm) ||
      app.category.toLowerCase().includes(lowercasedTerm) ||
      (app.tags && app.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))) ||
      (app.agentDependencies && app.agentDependencies.some(agent => agent.toLowerCase().includes(lowercasedTerm)))
    );
  },
  getAppsByFlag: (flagName) => {
    const allApps = get().apps;
    if (flagName === 'monetized') {
      return allApps.filter(app => app.monetization?.enabled === true);
    }
    // Ensure flags object exists and the specific flag is true
    return allApps.filter(app => app.flags && app.flags[flagName as keyof MicroApp['flags']] === true);
  },
}));

