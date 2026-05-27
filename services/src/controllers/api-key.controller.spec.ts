import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from 'src/services/api-key.service';
import { ClerkAuthGuard } from 'src/guards/clerk.gaurds';

describe('ApiKeyController', () => {
  let controller: ApiKeyController;

  const mockApiKeyService = {
    createApiKey: jest.fn(),
    listApiKeys: jest.fn(),
    deleteApiKey: jest.fn(),
    regenerateApiKey: jest.fn(),
    last_used_apiKey: jest.fn(),
  };

  const mockClerkAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        {
          provide: ApiKeyService,
          useValue: mockApiKeyService,
        },
      ],
    })
      .overrideGuard(ClerkAuthGuard)
      .useValue(mockClerkAuthGuard)
      .compile();

    controller = module.get<ApiKeyController>(ApiKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createApiKey', () => {
    it('should call service.createApiKey', async () => {
      const mockReq = { user: { id: 'user-123' }, headers: {} };
      mockApiKeyService.createApiKey.mockResolvedValue({ key: 'new-key' });

      const result = await controller.createApiKey(mockReq);

      expect(result).toEqual({ key: 'new-key' });
      expect(mockApiKeyService.createApiKey).toHaveBeenCalledWith('user-123');
    });
  });

  describe('listApiKeys', () => {
    it('should call service.listApiKeys', async () => {
      const mockReq = { user: { id: 'user-123' }, headers: {} };
      const mockKeys = [{ id: '1', prefix: 'CYPH...' }];
      mockApiKeyService.listApiKeys.mockResolvedValue(mockKeys);

      const result = await controller.listApiKeys(mockReq);

      expect(result).toEqual(mockKeys);
      expect(mockApiKeyService.listApiKeys).toHaveBeenCalledWith('user-123');
    });
  });

  describe('deleteApiKey', () => {
    it('should call service.deleteApiKey', async () => {
      const mockReq = { user: { id: 'user-123' }, headers: {} };
      const id = 'key-123';
      mockApiKeyService.deleteApiKey.mockResolvedValue({ success: true });

      const result = await controller.deleteApiKey(mockReq, id);

      expect(result).toEqual({ success: true });
      expect(mockApiKeyService.deleteApiKey).toHaveBeenCalledWith(
        'user-123',
        id,
      );
    });
  });

  describe('regenerateApiKey', () => {
    it('should call service.regenerateApiKey', async () => {
      const mockReq = { user: { id: 'user-123' }, headers: {} };
      const id = 'key-123';
      mockApiKeyService.regenerateApiKey.mockResolvedValue({ key: 'new-key' });

      const result = await controller.regenerateApiKey(mockReq, id);

      expect(result).toEqual({ key: 'new-key' });
      expect(mockApiKeyService.regenerateApiKey).toHaveBeenCalledWith(
        'user-123',
        id,
      );
    });
  });

  describe('last_used_apiKey', () => {
    it('should call service.last_used_apiKey', async () => {
      const id = 'key-123';
      const now = new Date();
      mockApiKeyService.last_used_apiKey.mockResolvedValue(now);

      const result = await controller.last_used_apiKey(id);

      expect(result).toEqual(now);
      expect(mockApiKeyService.last_used_apiKey).toHaveBeenCalledWith(id);
    });
  });
});
