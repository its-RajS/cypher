import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DRIZZLE_DB } from 'src/database/database.module';
import { REDIS_CLIENT } from 'src/infra/redis.module';

@Injectable()
export class UploadService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: any,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}
}
