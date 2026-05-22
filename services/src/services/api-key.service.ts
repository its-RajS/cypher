import { Inject, Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from 'src/database/database.module';
import { api_key } from 'src/database/schema';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class ApiKeyService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: any,
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
      .select({ count: count() })
      .from(api_key)
      .where(eq(api_key.user_id, userId));
    if (result.count >= 5) {
      throw new Error('You have reached the maximum limit of 5 API keys');
    }
    const { plainTextKey, hashedKey } = this.generateApiKey();
    const hash = argon2.hash(plainTextKey, {
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

  async listApiKeys(userId: string) {}

  async deleteApiKey(userId: string) {}

  async regenerateApiKey(userId: string, id: string) {}
}
