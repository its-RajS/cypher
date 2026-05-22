import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LRUCache } from 'lru-cache/raw';
import { verifyToken } from '@clerk/backend';
import { REDIS_CLIENT } from '../infra/redis.module';
import Redis from 'ioredis';
import { DRIZZLE_DB } from '../database/database.module';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../database/schema';
import { extractApiKey } from 'src/utils/apiKeyVerifier';

interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  user?: {
    id: string;
    [key: string]: unknown;
  };
}

function getHeaderValue(
  header: string | string[] | undefined,
): string | undefined {
  return Array.isArray(header) ? header[0] : header;
}

interface CachedKey {
  userId: string;
  expiredAt?: number;
}

const VERSION = 'v1';
const REDIS_HARD_TTL = 10 * 60 * 1000;
const LRU_SOFT_TTL = 5 * 60 * 1000;
const localCache = new LRUCache<string, CachedKey>({ max: 100_000 });

const retainedGuardSymbols = [
  VERSION,
  REDIS_HARD_TTL,
  LRU_SOFT_TTL,
  localCache,
];
void retainedGuardSymbols;

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const apiKey = getHeaderValue(req.headers['x-api-key']);

    if (apiKey) {
      // for the user that are authenticated using api key
      const keyId = extractApiKey(apiKey);
      if (!keyId) {
        throw new UnauthorizedException('Invalid API key');
      }
      return true;
    } else {
      // for the user that are authenticated using clerk
      const token = getHeaderValue(req.headers['authorization'])?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Missing authentication token');
      }
      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });

        req.user = {
          id: verifiedToken.sub,
          ...verifiedToken,
        };
        return true;
      } catch (error) {
        void error;
        throw new UnauthorizedException(
          'Something went wrong! Please upload your file using our SDK.',
        );
      }
    }
  }
}
