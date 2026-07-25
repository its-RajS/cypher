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
  hardLockRedisKey,
  normalizePlanTier,
  PLAN_REDIS_TTL,
  planRedisKey,
} from 'src/configs';

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
    const lru_key = `plan:${userId}`;

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

    return true;
  }
}
