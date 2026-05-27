import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import { DRIZZLE_DB } from 'src/database/database.module';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from 'src/database/schema';
import { api_key } from 'src/database/schema';
import { sql } from 'drizzle-orm';
import { LAST_USED_HASH } from 'src/configs';

export class ApiKeyLastUsedCron {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleLastUsed() {
    const last_used = await this.redis.hgetall(LAST_USED_HASH);
    if (!last_used || !Object.keys(last_used).length) return;

    await this.redis.del(LAST_USED_HASH);

    const entries = Object.entries(last_used)
      .map(([keyId, lastUsedAt]) => ({
        id: keyId,
        last_used_at: new Date(Number(lastUsedAt)),
      }))
      .filter(
        (entry) =>
          entry.id &&
          entry.last_used_at instanceof Date &&
          !Number.isNaN(entry.last_used_at.getTime()),
      );

    if (entries.length === 0) return;

    await this.db.execute(
      sql`UPDATE ${api_key} as a 
      SET last_used_at = t.last_used_at
      FROM (VALUES ${sql.join(
        entries.map((e) => sql`(${e.id}::uuid, ${e.last_used_at}::timestamp)`),
        sql`, `,
      )}) as t(id, last_used_at)
      WHERE a.id = t.id`,
    );
  }
}
