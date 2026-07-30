import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import Redis from 'ioredis';
import { DRIZZLE_DB } from 'src/database/database.module';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import * as schema from '../database/schema';
import { AuthenticatedRequest } from './clerk.gaurds';
import {
  cachedPlan,
  CachedPlan,
  cachedUsage,
  CachedUsage,
  hardLockRedisKey,
  normalizePlanTier,
  PLAN_DEFAULTS,
  PLAN_REDIS_TTL,
  planRedisKey,
  PlanTier,
  usageRedisKey,
  VERSION,
} from 'src/configs';
import { eq } from 'drizzle-orm';

@Injectable()
export class UploadGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  private async isHardLocked(userId: string): Promise<boolean> {
    return (await this.redis.exists(hardLockRedisKey(userId))) === 1;
  }

  private async userCachePlan(userId: string): Promise<CachedPlan | undefined> {
    const lru_key = `plan:${VERSION}:${userId}`;

    //! check plan from LRU
    const cached = cachedPlan.get(lru_key);
    if (cached) {
      return cached;
    }

    //! check plan from Redis
    const redis_key = planRedisKey(userId);
    const redis_plan = await this.redis.hgetall(redis_key);
    if (redis_plan?.tier) {
      void this.redis.expire(redis_key, PLAN_REDIS_TTL);
      const plan: CachedPlan = {
        tier: normalizePlanTier(redis_plan.tier),
        updatedAt: Number(redis_plan.updatedAt),
      };
      cachedPlan.set(lru_key, plan);
      return plan;
    }
    //! check from Database
    const record = await this.db.query.plan.findFirst({
      where: (p) => eq(p.user_id, userId),
      columns: { tier: true },
    });

    if (!record) {
      return;
    }

    const tierName = normalizePlanTier(record.tier);

    const plan: CachedPlan = {
      tier: tierName,
      updatedAt: Date.now(),
    };

    await this.redis.hset(redis_key, {
      tier: tierName,
    });
    void this.redis.expire(redis_key, PLAN_REDIS_TTL);

    cachedPlan.set(lru_key, plan);
    return plan;
  }

  private async userCachedUsage(
    userId: string,
    tierDefault: { storageLimit: number; minutesStreamedLimit: number },
  ): Promise<CachedUsage> {
    const lru_key = `usage:${VERSION}:${userId}`;

    const cached = cachedUsage.get(lru_key);
    if (cached) {
      return cached;
    }

    const redis_key = usageRedisKey(userId);
    const redis_usage = await this.redis.hgetall(redis_key);
    if (redis_usage?.storageUsage !== undefined) {
      void this.redis.expire(redis_key, PLAN_REDIS_TTL);
      const usage: CachedUsage = {
        storageUsage: Number(redis_usage.storageUsage),
        storageLimit: Number(redis_usage.storageLimit),
        minutesStreamed: Number(redis_usage.minutesStreamed),
        minutesStreamedLimit: Number(redis_usage.minutesStreamedLimit),
        updatedAt: Number(redis_usage.updatedAt),
      };
      cachedUsage.set(lru_key, usage);
      return usage;
    }

    const record = await this.db.query.usage.findFirst({
      where: (u) => eq(u.user_id, userId),
      columns: {
        storage_usage: true,
        storage_limit: true,
        minutes_streamed: true,
        minutes_streamed_limit: true,
        updated_at: true,
      },
    });

    if (!record) {
      void this.db
        .insert(schema.usage)
        .values({
          user_id: userId,
          storage_usage: 0,
          storage_limit: PLAN_DEFAULTS[PlanTier.FREE].storageLimit,
          minutes_streamed: 0,
          minutes_streamed_limit:
            PLAN_DEFAULTS[PlanTier.FREE].minutesStreamedLimit,
        })
        .onConflictDoNothing()
        .catch((err) => {
          console.log(
            `[UploadGuard] failed to seed the usage row of ${userId}, ${err}`,
          );
        });

      return {
        storageUsage: 0,
        storageLimit: tierDefault.storageLimit,
        minutesStreamed: 0,
        minutesStreamedLimit: tierDefault.minutesStreamedLimit,
        updatedAt: Date.now(),
      };
    }

    const usage: CachedUsage = {
      storageUsage: Number(record.storage_usage),
      storageLimit: Number(record.storage_limit),
      minutesStreamed: Number(record.minutes_streamed),
      minutesStreamedLimit: Number(record.minutes_streamed_limit),
      updatedAt: Number(record.updated_at),
    };

    await this.redis.hset(redis_key, {
      storageUsage: record.storage_usage,
      storageLimit: record.storage_limit,
      minutesStreamed: record.minutes_streamed,
      minutesStreamedLimit: record.minutes_streamed_limit,
    });
    void this.redis.expire(redis_key, PLAN_REDIS_TTL);

    cachedUsage.set(lru_key, usage);
    return usage;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (await this.isHardLocked(userId)) {
      throw new ForbiddenException(
        'Your account has been locked. You have exceeded your usage quota. Please upgrade to a higher plan to continue uploading.',
      );
    }

    const tier = await this.userCachePlan(userId);
    if (!tier) {
      throw new ForbiddenException(
        'You are not authorized to upload videos. Please upgrade to a higher plan to continue uploading.',
      );
    }

    const tierDefault =
      PLAN_DEFAULTS[tier.tier] ?? PLAN_DEFAULTS[PlanTier.FREE];

    const usage = await this.userCachedUsage(userId, tierDefault);

    const effectiveStorageLimit =
      usage.storageLimit > 0 ? usage.storageLimit : tierDefault.storageLimit;

    if (usage.storageUsage >= effectiveStorageLimit) {
      throw new ForbiddenException(
        'You have exceeded your storage quota. Please upgrade to a higher plan to continue uploading.',
      );
    }

    const incomingBytes: number =
      Number(request?.body?.videoSize ?? 0) +
      Number(request?.body?.thumbnailSize ?? 0);

    if (
      incomingBytes > 0 &&
      usage.storageUsage + incomingBytes > effectiveStorageLimit
    ) {
      const remainingMB = Math.floor(
        (effectiveStorageLimit - usage.storageUsage) / 1024 ** 2,
      );
      const incomingMB = Math.ceil(incomingBytes / 1024 ** 2);
      throw new ForbiddenException(
        `You cannot upload this file. It requires ${incomingMB} MB of storage, but you only have ${remainingMB} MB remaining. Please upgrade to a higher plan to continue uploading.`,
      );
    }

    return true;
  }
}
