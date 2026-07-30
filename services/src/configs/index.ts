import { LRUCache } from 'lru-cache/raw';

export type CachedKey = {
  user_id: string;
  apiKeyDigest: string;
  expiredAt: number;
};

export enum PlanTier {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export function normalizePlanTier(raw: string | undefined | null): PlanTier {
  if (!raw) return PlanTier.FREE;
  const lower = raw.toLowerCase() as PlanTier;
  if (Object.values(PlanTier).includes(lower)) {
    return lower;
  }
  return PlanTier.FREE;
}

export type CachedPlan = {
  tier: PlanTier;
  updatedAt: number;
};

export type CachedUsage = {
  storageUsage: number;
  storageLimit: number;
  minutesStreamed: number;
  minutesStreamedLimit: number;
  updatedAt: number;
};

export type UploadedFilePart = {
  partNumber: number;
  size: number;
  eTag: string;
};

export const VERSION = 'v1';
export const REDIS_HARD_TTL = 10 * 60 * 1000;
export const LRU_SOFT_TTL = 5 * 60 * 1000;
export const LAST_USED_DEBOUNCE = 60;
export const LAST_USED_HASH = `cyph:api_key:last_used:${VERSION}`;
export const localCache = new LRUCache<string, CachedKey>({ max: 100_000 });
export const DEFAULT_PLAYLIST_LIMIT = 10;

export const hardLockRedisKey = (userId: string) =>
  `cyph:user:${userId}:hard_locked`;

export const PLAN_LRU_TTL = 5 * 60 * 1000;
export const PLAN_REDIS_TTL = 6 * 60;

export const planRedisKey = (userId: string) =>
  `cyph:plan:${VERSION}:${userId}`;
export const usageRedisKey = (userId: string) =>
  `cyph:usage:${VERSION}:${userId}`;

export const cachedPlan: LRUCache<string, CachedPlan> = new LRUCache<
  string,
  CachedPlan
>({
  max: 50_000,
  ttl: PLAN_LRU_TTL,
  updateAgeOnGet: true,
  allowStale: false,
});

export const cachedUsage: LRUCache<string, CachedUsage> = new LRUCache<
  string,
  CachedUsage
>({
  max: 50_000,
  ttl: PLAN_LRU_TTL,
  updateAgeOnGet: true,
  allowStale: false,
});

export const GB = 1024 ** 3;
export const TB = 1024 ** 4;

export type PlanDefinition = CachedUsage & {
  displayName: string;
  monthlyPriceUsd: number;
  maxApiKeys: number;
  maxPlaylists: number;
  maxResolution: '720p' | '1080p';
  customBranding: boolean;
  privatePlayback: boolean;
};

export const PLAN_CATALOG: Record<PlanTier, PlanDefinition> = {
  [PlanTier.FREE]: {
    displayName: 'Free',
    monthlyPriceUsd: 0,
    storageLimit: 5 * GB,
    storageUsage: 0,
    minutesStreamedLimit: 1_000,
    minutesStreamed: 0,
    updatedAt: Date.now(),
    maxApiKeys: 2,
    maxPlaylists: 3,
    maxResolution: '720p',
    customBranding: false,
    privatePlayback: false,
  },
  [PlanTier.STARTER]: {
    displayName: 'Starter',
    monthlyPriceUsd: 15,
    storageLimit: 250 * GB,
    storageUsage: 0,
    minutesStreamedLimit: 10_000,
    minutesStreamed: 0,
    updatedAt: Date.now(),
    maxApiKeys: 5,
    maxPlaylists: 10,
    maxResolution: '1080p',
    customBranding: false,
    privatePlayback: true,
  },
  [PlanTier.PRO]: {
    displayName: 'Pro',
    monthlyPriceUsd: 39,
    storageLimit: 600 * GB,
    storageUsage: 0,
    minutesStreamedLimit: 30_000,
    minutesStreamed: 0,
    updatedAt: Date.now(),
    maxApiKeys: 10,
    maxPlaylists: 50,
    maxResolution: '1080p',
    customBranding: true,
    privatePlayback: true,
  },
  [PlanTier.ENTERPRISE]: {
    displayName: 'Business',
    monthlyPriceUsd: 99,
    storageLimit: 1 * TB,
    storageUsage: 0,
    minutesStreamedLimit: 75_000,
    minutesStreamed: 0,
    updatedAt: Date.now(),
    maxApiKeys: 20,
    maxPlaylists: 100,
    maxResolution: '1080p',
    customBranding: true,
    privatePlayback: true,
  },
};

export const PLAN_DEFAULTS: Record<PlanTier, CachedUsage> = PLAN_CATALOG;
