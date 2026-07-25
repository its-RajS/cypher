import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import Redis from 'ioredis';
import { DRIZZLE_DB } from 'src/database/database.module';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import * as schema from '../database/schema';
import { AuthenticatedRequest } from './clerk.gaurds';
import { hardLockRedisKey } from 'src/configs';

@Injectable()
export class UploadGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  private async isHardLocked(userId: string): Promise<boolean> {
    return (await this.redis.exists(hardLockRedisKey(userId)) === 1);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    
    if(await this)
    return true;
  }
}
