import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_DB } from 'src/database/database.module';

@Injectable()
export class ApiKeyService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: any,
  ) {}

  async createApiKey(userId: string) {}

  async listApiKeys(userId: string) {}

  async deleteApiKey(userId: string, id: string) {}

  async regenerateApiKey(userId: string, id: string) {}
}
