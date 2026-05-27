import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from 'src/database/database.module';
import { api_key } from 'src/database/schema';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from 'src/database/schema';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import { LAST_USED_HASH, localCache, VERSION } from 'src/configs';

@Injectable()
export class ApiKeyService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private generateApiKey(): { plainTextKey: string; hashedKey: string } {
    const hashedKey = crypto.randomUUID().replace(/-/g, '');
    const secret = crypto.randomBytes(32).toString('base64url');
    const plainTextKey = `CYPH_${hashedKey}_${secret}`;
    return { plainTextKey, hashedKey };
  }

  async createApiKey(userId: string) {
    //! Deafult 5 api keys Limit
    const [result] = await this.db
      .select({
        count: count(),
      })
      .from(api_key)
      .where(eq(api_key.user_id, userId));
    if (result.count >= 5) {
      throw new Error('You have reached the maximum limit of 5 API keys');
    }
    const { plainTextKey, hashedKey } = this.generateApiKey();
    const hash = await argon2.hash(plainTextKey, {
      type: argon2.argon2id,
      timeCost: 2,
      memoryCost: 65536,
      parallelism: 1,
    });

    const prefix = plainTextKey.substring(0, 18) + '...';

    await this.db.insert(api_key).values({
      id: hashedKey,
      user_id: userId,
      prefix,
      value: hash,
    });

    return { key: plainTextKey };
  }

  async listApiKeys(userId: string) {
    return await this.db
      .select({
        id: api_key.id,
        prefix: api_key.prefix,
        createdAt: api_key.created_at,
        lastUsedAt: api_key.last_used_at,
        revokedAt: api_key.revoked_at,
      })
      .from(api_key)
      .where(eq(api_key.user_id, userId));
  }

  async deleteApiKey(userId: string, id: string) {
    await this.db
      .update(api_key)
      .set({
        revoked_at: new Date(),
      })
      .where(and(eq(api_key.user_id, userId), eq(api_key.id, id)));

    await this.redis.del(`cyph:api_key:${VERSION}:${id}`);
    await this.redis.del(`cyph:api_key:last_used:${VERSION}:${id}`);
    localCache.delete(`cyph:api_key:${VERSION}:${id}`);

    return {
      success: true,
    };
  }

  async regenerateApiKey(userId: string, id: string) {
    const { plainTextKey, hashedKey: newKeyID } = this.generateApiKey();
    const hash = await argon2.hash(plainTextKey, {
      type: argon2.argon2id,
      timeCost: 2,
      memoryCost: 65536,
      parallelism: 1,
    });

    const prefix = plainTextKey.substring(0, 18) + '...';

    await this.db
      .update(api_key)
      .set({ id: newKeyID, prefix, value: hash })
      .where(and(eq(api_key.user_id, userId), eq(api_key.id, id)));

    return { key: plainTextKey };
  }

  async last_used_apiKey(id: string) {
    // check redis first
    const redis_record = await this.redis.hget(LAST_USED_HASH, id);
    if (redis_record) {
      return new Date(Number(redis_record));
    }

    // check db
    const db_record = await this.db.query.api_key.findFirst({
      where: eq(api_key.id, id),
      columns: {
        last_used_at: true,
      },
    });

    if (!db_record) {
      throw new Error('API key not found');
    }

    return db_record?.last_used_at ?? 'Never used';
  }
}
