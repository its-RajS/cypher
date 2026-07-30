import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DRIZZLE_DB } from 'src/database/database.module';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import { InitiateUploadDTO } from './dto/initiateUpload.dto';
import {
  createStorageBucket,
  UploadFilePart,
} from '@oneminutecloud/storage-bucket';
import { randomUUID } from 'node:crypto';
import { video_metadata } from 'src/database/schema';
import * as schema from 'src/database/schema';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

@Injectable()
export class UploadService {
  private bucket: ReturnType<typeof createStorageBucket>;
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  onModuleInit() {
    this.bucket = createStorageBucket({
      apiKey: process.env.ONEMINUTE_CLOUD_API_KEY!,
    });
  }

  async initiateUpload(userId: string, dto: InitiateUploadDTO) {
    let uploadData: Awaited<ReturnType<typeof this.bucket.initiateUpload>>;

    try {
      uploadData = await this.bucket.initiateUpload({
        bucketId: process.env.BUCKET_ID!,
        filename: dto.videoFileName,
        contentType: dto.videoContentType,
        size: dto.videoSize,
        duration: dto.videoDuration,
      });
    } catch (err: unknown) {
      throw new BadGatewayException(
        err instanceof Error
          ? err.message
          : 'Failed to initiate upload. Please try again',
      );
    }

    const videoId = randomUUID();
    await this.db.insert(video_metadata).values({
      id: videoId,
      user_id: userId,
      title: dto.title,
      description: dto.description,
      videoFileName: dto.videoFileName,
      videoContentType: dto.videoContentType,
      videoSize: dto.videoSize,
      videoDuration: dto.videoDuration,
      thumbnailFileName: dto.thumbnailFileName,
      thumbnailContentType: dto.thumbnailContentType,
      thumbnailSize: dto.thumbnailSize,
      tags: dto.tags ?? [],
      timestamps: dto.timestamps ? JSON.stringify(dto.timestamps) : '',
      playlist_id:
        dto.playlist && dto.playlist.trim() !== '' ? dto.playlist : null,
      generateSubtitle: dto.generateSubtitle ?? false,
      includeWatermark: dto.includeWatermark ?? false,
      status: 'PENDING',
    });

    return {
      uploadData,
      videoId,
    };
  }
}
