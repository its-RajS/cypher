import {
  Controller,
  Param,
  Post,
  Req,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/guards/clerk.gaurds';
import type { AuthenticatedRequest } from 'src/guards/clerk.gaurds';
import { ApiKeyService } from 'src/services/api-key.service';

@Controller('api-keys')
@ApiTags('API KEYS')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  async createApiKey(@Req() req: AuthenticatedRequest) {
    return this.apiKeyService.createApiKey(req.user!.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all API keys' })
  async listApiKeys(@Req() req: AuthenticatedRequest) {
    return this.apiKeyService.listApiKeys(req.user!.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke an API key' })
  async deleteApiKey(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.apiKeyService.deleteApiKey(req.user!.id, id);
  }

  @Post(':id/regenerate')
  @ApiOperation({ summary: 'Regenerate an API key' })
  async regenerateApiKey(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.apiKeyService.regenerateApiKey(req.user!.id, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key last used at' })
  async last_used_apiKey(@Param('id') id: string) {
    return this.apiKeyService.last_used_apiKey(id);
  }
}
