import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { HttpCode, Post } from '@nestjs/common';
import { UploadGuard } from 'src/guards/upload.guards';
import {
  ClerkAuthGuard,
  type AuthenticatedRequest,
} from 'src/guards/clerk.gaurds';
import { InitiateUploadDTO } from './dto/initiateUpload.dto';
import type { Request } from 'express';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(ClerkAuthGuard, UploadGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initial video upload' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: InitiateUploadDTO) {
    return this.uploadService.initiateUpload(req.user!.id, dto);
  }
}
