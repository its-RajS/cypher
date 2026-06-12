import { LRUCache } from 'lru-cache/raw';

export type CachedKey = {
  user_id: string;
  apiKeyDigest: string;
  expiredAt: number;
};

export const VERSION = 'v1';
export const REDIS_HARD_TTL = 10 * 60 * 1000;
export const LRU_SOFT_TTL = 5 * 60 * 1000;
export const LAST_USED_DEBOUNCE = 60;
export const LAST_USED_HASH = `cyph:api_key:last_used:${VERSION}`;
export const localCache = new LRUCache<string, CachedKey>({ max: 100_000 });
export const DEFAULT_PLAYLIST_LIMIT = 10;
