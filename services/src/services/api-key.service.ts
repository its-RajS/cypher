import { Inject, Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from 'src/database/database.module';
import { api_key } from 'src/database/schema';

@Injectable()
export class ApiKeyService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: any,
  ) {}

  async createApiKey(userId: string) {
    //! Deafult 5 api keys Limit
    const [result] = await this.db
      .select({ count: count() })
      .from(api_key)
      .where(eq(api_key.user_id, userId));
    if (result.count >= 5) {
      throw new Error('You have reached the maximum limit of 5 API keys');
    }
  }

  async listApiKeys(userId: string) {}

  async deleteApiKey(userId: string) {}

  async regenerateApiKey(userId: string, id: string) {}
}
