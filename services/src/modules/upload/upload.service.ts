import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DRIZZLE_DB } from 'src/database/database.module';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import { InitiateUploadDTO } from './dto/initiateUpload.dto';
import {
  createStorageBucket,
  UploadFilePart,
} from '@oneminutecloud/storage-bucket';
import { media } from '@oneminutecloud/media-convert';
import { randomUUID } from 'node:crypto';
import * as schema from 'src/database/schema';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { PLAN_REDIS_TTL, usageRedisKey } from 'src/configs';
import { eq } from 'drizzle-orm';

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
      apiKey: process.env.ONEMINUTECLOUD_API_KEY!,
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
        (err as { message?: string })?.message ??
          'Failed to initiate upload. Please try again.',
      );
    }

    const videoId = randomUUID();
    await this.db.insert(schema.video_metadata).values({
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

    await this.db.insert(schema.pending_uploads).values({
      id: randomUUID(),
      video_id: videoId,
      videoSize: dto.videoSize,
      started_at: new Date(),
    });

    const reservedBytes = dto.videoSize + dto.thumbnailSize;
    const redis_key = usageRedisKey(userId);

    const exists = await this.redis.exists(redis_key);
    if (exists) {
      await this.redis.hincrby(redis_key, 'storageUsage', reservedBytes);
      await this.redis.hincrby(redis_key, 'videoCount', 1);
      void this.redis.expire(redis_key, PLAN_REDIS_TTL);
    }

    return { ...uploadData, videoId };
  }

  async completedUpload(
    userId: string,
    objectId: string,
    uploadId: string,
    key: string,
    parts: UploadFilePart[],
    videoId: string,
    tier: string,
  ) {
    const completeUpload = await this.bucket.confirmUpload({
      bucketId: process.env.BUCKET_ID!,
      objectId,
      uploadId,
      key,
      parts,
    });

    await this.db
      .delete(schema.pending_uploads)
      .where(eq(schema.pending_uploads.video_id, videoId));

    const { trackingId } = await media.convert({
      apiKey: process.env.ONEMINUTECLOUD_API_KEY!,
      keyname: key,
      outPutBucketId: process.env
        .ONEMINUTECLOUD_TRANSCODING_BUCKET_ID as string,
      outputs: tier === 'free' ? ['720p'] : ['360p', '480p', '720p', '1080p'],
      generateSubtitles: true,
      webhookUrl:
        'https://herbicide-senate-unethical.ngrok-free.dev/api/v1/upload/webhook',
    });

    await this.db
      .update(schema.video_metadata)
      .set({
        status: 'PROCESSING',
        videoTracking_id: trackingId,
        updated_at: new Date(),
      })
      .where(eq(schema.video_metadata.id, videoId));

    return completeUpload;
  }
}
