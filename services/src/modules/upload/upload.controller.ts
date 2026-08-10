import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadGuard } from 'src/guards/upload.guards';
import {
  ClerkAuthGuard,
  type AuthenticatedRequest,
} from 'src/guards/clerk.gaurds';
import {
  CompleteUploadDTO,
  InitiateUploadDTO,
  ThumbnailUploadDTO,
} from './dto/initiateUpload.dto';
import type { Request } from 'express';
import { PlanTier } from 'src/configs';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('create')
  @HttpCode(200)
  @UseGuards(ClerkAuthGuard, UploadGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Initial video upload' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: InitiateUploadDTO) {
    return this.uploadService.initiateUpload(req.user!.id, dto);
  }

  @Post('complete')
  @HttpCode(200)
  @UseGuards(ClerkAuthGuard, UploadGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete video upload' })
  complete(@Req() req: AuthenticatedRequest, @Body() dto: CompleteUploadDTO) {
    return this.uploadService.completedUpload(
      req.user!.id,
      dto.objectId,
      dto.uploadId,
      dto.key,
      dto.parts,
      dto.videoId,
      req.tier || PlanTier.FREE,
    );
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'oneminutecloud upload webhook' })
  webhook(@Req() req: Request) {
    return this.uploadService.handleWebhook(req);
  }

  @Post('thumbnail/upload')
  @HttpCode(200)
  @UseGuards(ClerkAuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024, //15MB
      },
    }),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload Video Thumbnail' })
  uploadThumbnail(
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() dto: ThumbnailUploadDTO,
  ) {
    if (
      !thumbnail ||
      !dto.thumbnailContentType ||
      !dto.thumbnailFileName ||
      !dto.thumbnailSize
    ) {
      throw new BadRequestException('Thumbnail file required!');
    }

    return this.uploadService.uploadThumbnail(
      dto.videoId,
      dto.thumbnailFileName,
      dto.thumbnailContentType,
      thumbnail,
      dto.thumbnailSize,
    );
  }

  @Get('get-videos-metadata')
  @HttpCode(200)
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all videos metadata' })
  getVideosMetadata(@Req() req: AuthenticatedRequest) {
    return this.uploadService.getVideosMetadata(req.user!.id);
  }
}
