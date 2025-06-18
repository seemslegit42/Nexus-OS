// src/lib/cache/enhanced-cache.ts
'use client';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  priority: number;
}

interface CacheStats {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  size: number;
  memoryUsage: number;
  averageAccessTime: number;
  evictionCount: number;
}

interface CacheOptions {
  maxSize?: number;
  maxMemory?: number; // in bytes
  defaultTTL?: number;
  cleanupInterval?: number;
  compressionThreshold?: number;
}

class EnhancedDataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private maxMemory: number;
  private defaultTTL: number;
  private cleanupInterval: number;
  private compressionThreshold: number;
  private totalHits = 0;
  private totalMisses = 0;
  private evictionCount = 0;
  private accessTimes: number[] = [];
  private maxAccessTimes = 1000;
  private cleanupTimer?: NodeJS.Timeout;
  private compressionEnabled =
    typeof window !== 'undefined' && 'CompressionStream' in window;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.maxMemory = options.maxMemory || 50 * 1024 * 1024; // 50MB default
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes
    this.cleanupInterval = options.cleanupInterval || 60 * 1000; // 1 minute
    this.compressionThreshold = options.compressionThreshold || 1024; // 1KB

    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    if (typeof window === 'undefined') return;

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  private async compressData(data: any): Promise<any> {
    if (!this.compressionEnabled) return data;

    try {
      const serialized = JSON.stringify(data);
      if (serialized.length < this.compressionThreshold) return data;

      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();

      writer.write(new TextEncoder().encode(serialized));
      writer.close();

      const chunks: Uint8Array[] = [];
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }

      return {
        __compressed: true,
        data: chunks,
        originalSize: serialized.length,
      };
    } catch {
      return data; // Fallback to uncompressed
    }
  }

  private async decompressData(entry: any): Promise<any> {
    if (!entry.__compressed) return entry;

    try {
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();

      for (const chunk of entry.data) {
        writer.write(chunk);
      }
      writer.close();

      const chunks: Uint8Array[] = [];
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }

      const decoder = new TextDecoder();
      const decompressed = decoder.decode(
        new Uint8Array(
          chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[])
        )
      );

      return JSON.parse(decompressed);
    } catch {
      return entry; // Fallback
    }
  }

  async set<T>(
    key: string,
    data: T,
    ttl: number = this.defaultTTL,
    priority: number = 1
  ): Promise<void> {
    const startTime = performance.now();

    // Compress data if applicable
    const processedData = await this.compressData(data);

    const entry: CacheEntry<T> = {
      data: processedData,
      expiresAt: Date.now() + ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size: this.calculateSize(processedData),
      priority,
    };

    // Check memory constraints before adding
    if (this.getCurrentMemoryUsage() + entry.size > this.maxMemory) {
      await this.evictByMemory(entry.size);
    }

    // Check size constraints
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.recordAccessTime(performance.now() - startTime);
  }

  async get<T>(key: string): Promise<T | null> {
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

    // Decompress data if needed
    const decompressedData = await this.decompressData(entry.data);
    return decompressedData;
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
    this.evictionCount = 0;
    this.accessTimes = [];
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats {
    const total = this.totalHits + this.totalMisses;
    const hitRate = total > 0 ? (this.totalHits / total) * 100 : 0;
    const averageAccessTime =
      this.accessTimes.length > 0
        ? this.accessTimes.reduce((a, b) => a + b, 0) / this.accessTimes.length
        : 0;

    return {
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      hitRate,
      size: this.cache.size,
      memoryUsage: this.getCurrentMemoryUsage(),
      averageAccessTime,
      evictionCount: this.evictionCount,
    };
  }

  getHotEntries(
    limit = 10
  ): Array<{ key: string; accessCount: number; lastAccessed: number }> {
    return Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  // Enhanced cleanup with priority-based eviction
  cleanup(): number {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    // Additional memory-based cleanup if over threshold
    const currentMemory = this.getCurrentMemoryUsage();
    if (currentMemory > this.maxMemory * 0.8) {
      this.evictByMemory(currentMemory - this.maxMemory * 0.7);
    }

    return expiredCount;
  }

  private getCurrentMemoryUsage(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  private async evictByMemory(targetSize: number): Promise<void> {
    let freedSize = 0;

    // Sort by priority (lower) and access frequency
    const entries = Array.from(this.cache.entries()).sort(([, a], [, b]) => {
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return a.accessCount - b.accessCount;
    });

    for (const [key, entry] of entries) {
      if (freedSize >= targetSize) break;

      this.cache.delete(key);
      freedSize += entry.size;
      this.evictionCount++;
    }
  }

  private calculateSize(data: any): number {
    try {
      if (data && data.__compressed) {
        return data.data.reduce(
          (size: number, chunk: Uint8Array) => size + chunk.length,
          0
        );
      }
      return JSON.stringify(data).length * 2; // Rough UTF-16 size
    } catch {
      return 1; // Fallback for non-serializable data
    }
  }

  private evictLRU(): void {
    let oldestEntry: {
      key: string;
      lastAccessed: number;
      priority: number;
    } | null = null;

    for (const [key, entry] of this.cache.entries()) {
      if (
        !oldestEntry ||
        entry.priority < oldestEntry.priority ||
        (entry.priority === oldestEntry.priority &&
          entry.lastAccessed < oldestEntry.lastAccessed)
      ) {
        oldestEntry = {
          key,
          lastAccessed: entry.lastAccessed,
          priority: entry.priority,
        };
      }
    }

    if (oldestEntry) {
      this.cache.delete(oldestEntry.key);
      this.evictionCount++;
    }
  }

  private recordAccessTime(time: number): void {
    this.accessTimes.push(time);
    if (this.accessTimes.length > this.maxAccessTimes) {
      this.accessTimes.shift();
    }
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Enhanced cache instance with better defaults
export const enhancedDataCache = new EnhancedDataCache({
  maxSize: 2000,
  maxMemory: 100 * 1024 * 1024, // 100MB
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000, // 2 minutes
  compressionThreshold: 2048, // 2KB
});

// Cache-aware data fetcher wrapper
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number,
  priority?: number
): T {
  return (async (...args: Parameters<T>) => {
    const cacheKey = keyGenerator(...args);

    // Try to get from cache first
    const cached = await enhancedDataCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn(...args);
    await enhancedDataCache.set(cacheKey, result, ttl, priority);

    return result;
  }) as T;
}

// API compatibility with old cache
export function getCachePerformance(): CacheStats {
  return enhancedDataCache.getStats();
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    enhancedDataCache.destroy();
  });
}
