import { WordDefinition } from '../types';

class CacheService {
  private cache: Map<string, { data: WordDefinition; timestamp: number }>;
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.cache = new Map();
  }

  get(key: string): WordDefinition | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: WordDefinition): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();

