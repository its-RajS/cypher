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
import { generateKeyDigest } from 'src/utils/keyDigest';
import { and, eq, isNull } from 'drizzle-orm';
import * as argon2 from 'argon2';

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
  user_id: string;
  apiKeyDigest: string;
  expiredAt: number;
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
      const keyDigest = generateKeyDigest(apiKey);
      const lruKey = `${VERSION}:${keyId}`;
      const now = Date.now();

      try {
        // Fasted way to verify the apikey with LRU
        const cachedKey = localCache.get(lruKey);
        if (
          cachedKey &&
          cachedKey.apiKeyDigest === keyDigest &&
          cachedKey.expiredAt > now
        ) {
          req.user = {
            id: cachedKey.user_id,
            keyId,
          };
          return true;
        }

        // Second fastest way to verify the apikey with REDIS
        const redisKeyDigest = `cyph:api_key:${VERSION}:${keyId}`;
        const redisDigest = await this.redis.hgetall(redisKeyDigest);
        if (
          redisDigest?.invalid === '1' ||
          redisDigest?.apiKeyDigest !== keyDigest
        ) {
          throw new UnauthorizedException('Invalid API key');
        }

        if (redisDigest?.user_id) {
          localCache.set(lruKey, {
            user_id: redisDigest.user_id,
            apiKeyDigest: keyDigest,
            expiredAt: now + LRU_SOFT_TTL,
          });
          req.user = {
            id: redisDigest.user_id,
            keyId,
          };
          return true;
        }

        // User req is for the first time or after a long time
        const record = await this.db.query.api_key.findFirst({
          where: (ak) => and(eq(ak.id, keyId), isNull(ak.revoked_at)),
          columns: {
            user_id: true,
            value: true,
            revoked_at: true,
          },
        });

        if (!record) {
          throw new UnauthorizedException('Unauthorized');
        }

        const isValid = await argon2.verify(record.value, apiKey);
        if (!isValid) {
          await this.redis.hset(redisKeyDigest, 'invalid', '1');
          await this.redis.expire(redisKeyDigest, REDIS_HARD_TTL);
          throw new UnauthorizedException('Unauthorized');
        }

        await this.redis.hset(redisKeyDigest, {
          user_id: record.user_id,
          apiKeyDigest: keyDigest,
          expiredAt: now + REDIS_HARD_TTL,
        });
        req.user = {
          id: record.user_id,
          keyId,
        };
        return true;
      } catch (error) {
        console.error('Authorization Error:', error);
        throw new UnauthorizedException('Error in API KEY');
      }
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
        console.error('Authorization Error:', error);
        throw new UnauthorizedException(
          'Something went wrong! Please upload your file using our SDK.',
        );
      }
    }
  }
}
