// src/lib/cache/index.ts
'use client';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const dataCache = new DataCache();

// Cache keys constants
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  TEAM_MEMBERS: 'team_members',
  ACTIVE_SESSIONS: 'active_sessions',
  USER_ITEMS: 'user_items',
  ADMIN_USERS: 'admin_users',
  ADMIN_REPORTS: 'admin_reports',
  ADMIN_REVIEWS: 'admin_reviews',
  ITEM_DETAILS: (id: string) => `item_details_${id}`,
  ITEM_MODULES: (id: string) => `item_modules_${id}`,
  AVAILABLE_MODULES: 'available_modules',
  INTEGRATIONS: 'integrations',
  EARNINGS: 'earnings',
} as const;
