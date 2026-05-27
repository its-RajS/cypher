import { Test, TestingModule } from '@nestjs/testing';
import { ClerkAuthGuard, AuthenticatedRequest } from './clerk.gaurds';
import { REDIS_CLIENT } from '../infra/redis.module';
import { DRIZZLE_DB } from '../database/database.module';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import * as argon2 from 'argon2';
import { extractApiKey } from 'src/utils/apiKeyVerifier';
import { generateKeyDigest } from 'src/utils/keyDigest';
import { localCache } from 'src/configs';
import Redis from 'ioredis';

jest.mock('@clerk/backend');
jest.mock('argon2');
jest.mock('src/utils/apiKeyVerifier');
jest.mock('src/utils/keyDigest');

describe('ClerkAuthGuard', () => {
  let guard: ClerkAuthGuard;
  let mockRedis: jest.Mocked<Partial<Redis>>;
  let mockDb: {
    query: {
      api_key: {
        findFirst: jest.Mock;
      };
    };
  };

  beforeEach(async () => {
    mockRedis = {
      set: jest.fn(),
      hset: jest.fn(),
      hgetall: jest.fn(),
      expire: jest.fn(),
    };

    mockDb = {
      query: {
        api_key: {
          findFirst: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClerkAuthGuard,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
        {
          provide: DRIZZLE_DB,
          useValue: mockDb,
        },
      ],
    }).compile();

    guard = module.get<ClerkAuthGuard>(ClerkAuthGuard);
    localCache.clear();
    jest.clearAllMocks();
  });

  const createMockContext = (
    headers: Record<string, string>,
  ): ExecutionContext => {
    const req = { headers, user: undefined };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(req),
      }),
    };
    return context as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('API Key Authentication', () => {
    const apiKey = 'test-api-key';
    const keyId = 'key-id';
    const keyDigest = 'digest';
    const userId = 'user-123';

    beforeEach(() => {
      (extractApiKey as jest.Mock).mockReturnValue(keyId);
      (generateKeyDigest as jest.Mock).mockReturnValue(keyDigest);
    });

    it('should authenticate with valid API key (LRU cache hit)', async () => {
      const now = Date.now();
      localCache.set(`v1:${keyId}`, {
        user_id: userId,
        apiKeyDigest: keyDigest,
        expiredAt: now + 10000,
      });

      const context = createMockContext({ 'x-api-key': apiKey });
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
      expect(req.user).toEqual({ id: userId, keyId });
      expect(mockRedis.set).toHaveBeenCalled(); // trackApiKeyLastUsed
    });

    it('should authenticate with valid API key (Redis hit)', async () => {
      (mockRedis.hgetall as jest.Mock).mockResolvedValue({
        user_id: userId,
        apiKeyDigest: keyDigest,
      });

      const context = createMockContext({ 'x-api-key': apiKey });
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
      expect(req.user).toEqual({ id: userId, keyId });
      expect(localCache.get(`v1:${keyId}`)).toBeDefined();
    });

    it('should authenticate with valid API key (DB lookup)', async () => {
      (mockRedis.hgetall as jest.Mock).mockResolvedValue({}); // Empty object for missing redis key
      mockDb.query.api_key.findFirst.mockResolvedValue({
        user_id: userId,
        value: 'hashed-key',
        revoked_at: null,
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const context = createMockContext({ 'x-api-key': apiKey });
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockRedis.hset).toHaveBeenCalled(); // Save to redis
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
      expect(req.user).toEqual({ id: userId, keyId });
    });

    it('should throw UnauthorizedException for invalid key format', async () => {
      (extractApiKey as jest.Mock).mockReturnValue(null);
      const context = createMockContext({ 'x-api-key': 'invalid' });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if key not found in DB', async () => {
      (mockRedis.hgetall as jest.Mock).mockResolvedValue({});
      mockDb.query.api_key.findFirst.mockResolvedValue(null);

      const context = createMockContext({ 'x-api-key': apiKey });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if argon2 verify fails', async () => {
      (mockRedis.hgetall as jest.Mock).mockResolvedValue({});
      mockDb.query.api_key.findFirst.mockResolvedValue({
        user_id: userId,
        value: 'hashed-key',
        revoked_at: null,
      });
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const context = createMockContext({ 'x-api-key': apiKey });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockRedis.hset).toHaveBeenCalledWith(
        expect.any(String),
        'invalid',
        '1',
      );
    });
  });

  describe('Clerk Token Authentication', () => {
    const token = 'valid-token';
    const mockUser = { sub: 'user-123', email: 'test@example.com' };

    it('should authenticate with valid Clerk token', async () => {
      (verifyToken as jest.Mock).mockResolvedValue(mockUser);
      const context = createMockContext({ authorization: `Bearer ${token}` });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
      expect(req.user).toEqual({ id: mockUser.sub, ...mockUser });
    });

    it('should throw UnauthorizedException for missing token', async () => {
      const context = createMockContext({});
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Missing authentication token',
      );
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      (verifyToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));
      const context = createMockContext({ authorization: `Bearer ${token}` });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
