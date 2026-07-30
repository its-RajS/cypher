import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { DRIZZLE_DB } from 'src/database/database.module';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { api_key } from 'src/database/schema';

jest.mock('argon2');
jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual<typeof crypto>('crypto');
  return {
    ...actualCrypto,
    randomUUID: jest.fn(),
    randomBytes: jest.fn(),
  };
});

describe('ApiKeyService', () => {
  let service: ApiKeyService;

  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    query: {
      api_key: {
        findFirst: jest.fn(),
      },
      plan: {
        findFirst: jest.fn(),
      },
    },
  };

  const mockRedis = {
    hget: jest.fn(),
    del: jest.fn(),
  };

  let db: typeof mockDb;
  let redis: typeof mockRedis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: DRIZZLE_DB,
          useValue: mockDb,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
    db = module.get(DRIZZLE_DB);
    redis = module.get(REDIS_CLIENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApiKey', () => {
    it('should create a new API key', async () => {
      const userId = 'user-123';
      const uuid = 'mocked-uuid';
      const secret = 'mocked-secret';
      const hash = 'mocked-hash';

      (crypto.randomUUID as jest.Mock).mockReturnValue(uuid);
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: jest.fn().mockReturnValue(secret),
      });
      (argon2.hash as jest.Mock).mockResolvedValue(hash);

      db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ count: 0 }]),
        }),
      });

      const result = await service.createApiKey(userId);

      expect(result).toHaveProperty('key');
      expect(result.key).toContain('CYPH_');
      expect(db.insert).toHaveBeenCalledWith(api_key);
    });

    it('should throw error if limit reached', async () => {
      db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ count: 5 }]),
        }),
      });

      await expect(service.createApiKey('user-123')).rejects.toThrow(
        'You have reached the maximum limit of 1 API keys',
      );
    });
  });

  describe('listApiKeys', () => {
    it('should return a list of api keys', async () => {
      const userId = 'user-123';
      const mockKeys = [{ id: '1', prefix: 'CYPH...', created_at: new Date() }];
      db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(mockKeys),
        }),
      });

      const result = await service.listApiKeys(userId);

      expect(result).toEqual(mockKeys);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('deleteApiKey', () => {
    it('should revoke an api key', async () => {
      const userId = 'user-123';
      const id = 'key-123';
      db.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue({}),
        }),
      });

      const result = await service.deleteApiKey(userId, id);

      expect(result).toEqual({ success: true });
      expect(db.update).toHaveBeenCalled();
      expect(redis.del).toHaveBeenCalled();
    });
  });

  describe('regenerateApiKey', () => {
    it('should regenerate an api key', async () => {
      const userId = 'user-123';
      const id = 'key-123';
      const newUuid = 'new-uuid';
      const newSecret = 'new-secret';
      const newHash = 'new-hash';

      (crypto.randomUUID as jest.Mock).mockReturnValue(newUuid);
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: jest.fn().mockReturnValue(newSecret),
      });
      (argon2.hash as jest.Mock).mockResolvedValue(newHash);

      db.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue({}),
        }),
      });

      const result = await service.regenerateApiKey(userId, id);

      expect(result).toHaveProperty('key');
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe('last_used_apiKey', () => {
    it('should return from redis if available', async () => {
      const id = 'key-123';
      const now = Date.now();
      redis.hget.mockResolvedValue(now.toString());

      const result = await service.last_used_apiKey(id);

      expect(result).toBeInstanceOf(Date);
      expect((result as Date).getTime()).toBe(now);
      expect(redis.hget).toHaveBeenCalled();
    });

    it('should return from db if not in redis', async () => {
      const id = 'key-123';
      const now = new Date();
      redis.hget.mockResolvedValue(null);
      db.query.api_key.findFirst.mockResolvedValue({ last_used_at: now });

      const result = await service.last_used_apiKey(id);

      expect(result).toEqual(now);
      expect(db.query.api_key.findFirst).toHaveBeenCalled();
    });

    it('should throw if not found', async () => {
      redis.hget.mockResolvedValue(null);
      db.query.api_key.findFirst.mockResolvedValue(null);

      await expect(service.last_used_apiKey('key-123')).rejects.toThrow(
        'API key not found',
      );
    });
  });
});
