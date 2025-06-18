// src/lib/cache/index.ts
'use client';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size?: number;
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  averageAccessTime: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 100; // Maximum number of entries
  private totalHits = 0;
  private totalMisses = 0;
  private accessTimes: number[] = [];
  private maxAccessTimes = 1000; // Keep track of last 1000 access times

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    // Calculate approximate size of data
    const size = this.calculateSize(data);

    // If cache is full, remove least recently used entries
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now,
      size,
    });
  }

  get<T>(key: string): T | null {
    const startTime = performance.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.totalMisses++;
      this.recordAccessTime(performance.now() - startTime);
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.totalMisses++;
      this.recordAccessTime(performance.now() - startTime);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.totalHits++;
    this.recordAccessTime(performance.now() - startTime);

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
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
    this.totalHits = 0;
    this.totalMisses = 0;
    this.accessTimes = [];
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats {
    const totalAccess = this.totalHits + this.totalMisses;
    const hitRate = totalAccess > 0 ? this.totalHits / totalAccess : 0;
    const averageAccessTime =
      this.accessTimes.length > 0
        ? this.accessTimes.reduce((sum, time) => sum + time, 0) /
          this.accessTimes.length
        : 0;

    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size || 0;
    }

    return {
      totalEntries: this.cache.size,
      totalSize,
      hitRate: Math.round(hitRate * 100) / 100,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      averageAccessTime: Math.round(averageAccessTime * 1000) / 1000, // Round to 3 decimal places
    };
  }

  // Get most frequently accessed entries
  getHotEntries(
    limit = 10
  ): Array<{ key: string; accessCount: number; lastAccessed: number }> {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);

    return entries;
  }

  // Cleanup expired entries
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  private calculateSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 1; // Fallback for non-serializable data
    }
  }

  private evictLRU(): void {
    let oldestEntry: { key: string; lastAccessed: number } | null = null;

    for (const [key, entry] of this.cache.entries()) {
      if (!oldestEntry || entry.lastAccessed < oldestEntry.lastAccessed) {
        oldestEntry = { key, lastAccessed: entry.lastAccessed };
      }
    }

    if (oldestEntry) {
      this.cache.delete(oldestEntry.key);
    }
  }

  private recordAccessTime(time: number): void {
    this.accessTimes.push(time);
    if (this.accessTimes.length > this.maxAccessTimes) {
      this.accessTimes.shift(); // Remove oldest entry
    }
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
  AGENT_WORKLOAD: 'agent_workload',
  SYSTEM_LOGS: 'system_logs',
  MARKETPLACE_AGENTS: 'marketplace_agents',
  USER_AGENTS: 'user_agents',
} as const;

// Cache performance monitoring
export function getCachePerformance(): CacheStats {
  return dataCache.getStats();
}

// Utility to prefetch and warm up cache
export async function warmUpCache(): Promise<void> {
  // Run cleanup first
  dataCache.cleanup();

  // This could be enhanced to prefetch commonly accessed data
  console.log('Cache warmed up, stats:', dataCache.getStats());
}
