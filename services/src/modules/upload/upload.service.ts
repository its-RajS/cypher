import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
import type { Request } from 'express';
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

  async uploadThumbnail(
    videoId: string,
    thumbnailFileName: string,
    thumbnailContentType: string,
    thumbnail: Express.Multer.File,
    thumbnailSize: number,
  ) {
    try {
      const thumbnailUpload = await this.bucket.uploadFile({
        bucketId: process.env.BUCKET_ID!,
        file: thumbnail,
        filename: thumbnailFileName,
        contentType: thumbnailContentType,
        size: thumbnailSize,
      });

      await this.db
        .update(schema.video_metadata)
        .set({
          thumbnailTracking_id: thumbnailUpload.thumbnailKey,
          updated_at: new Date(),
        })
        .where(eq(schema.video_metadata.id, videoId));

      return thumbnailUpload;
    } catch (error: unknown) {
      throw new Error(
        (error as { message?: string })?.message ??
          'Failed to upload thumbnail. Please try again.',
      );
    }
  }

  async handleWebhook(req: Request) {
    try {
      const apiKey = process.env.ONEMINUTECLOUD_API_KEY!;
      if (!apiKey) throw new UnauthorizedException('API key not found');

      const headers = req.headers as Record<string, string>;
      const body = (req.body ?? {}) as Record<string, unknown>;

      const valid = await media.verifyWebhook({
        apiKey,
        headers,
        body,
      });

      if (!valid) throw new UnauthorizedException('Invalid webhook');

      const trackingId =
        typeof body.jobId === 'string'
          ? body.jobId
          : typeof body.trackingId === 'string'
            ? body.trackingId
            : undefined;
      const event = typeof body.event === 'string' ? body.event : undefined;

      if (!trackingId) throw new BadGatewayException('Invalid payload');

      const metaData = await media.getMetadata({ apiKey, trackingId });

      await this.db
        .update(schema.video_metadata)
        .set({
          status: event === 'job.completed' ? 'SUCCESS' : 'FAILED',
          updated_at: new Date(),
        })
        .where(eq(schema.video_metadata.videoTracking_id, trackingId));

      const [videoRow] = await this.db
        .select({
          id: schema.video_metadata.id,
          userId: schema.video_metadata.user_id,
          videoSize: schema.video_metadata.videoSize,
          thumbnailSize: schema.video_metadata.thumbnailSize,
        })
        .from(schema.video_metadata)
        .where(eq(schema.video_metadata.videoTracking_id, trackingId));

      if (!videoRow) {
        throw new Error(`No video found for the trackingID: ${trackingId}`);
      }

      const existingTranscoding = await this.db
        .select({
          id: schema.transcoding_metadata.id,
          totalSizeBytes: schema.transcoding_metadata.totalSizeBytes,
        })
        .from(schema.transcoding_metadata)
        .where(eq(schema.transcoding_metadata.video_id, videoRow.id))
        .limit(1);

      if (existingTranscoding.length > 0) {
        await this.db
          .update(schema.transcoding_metadata)
          .set({
            fileCount: metaData.fileCount ?? 0,
            resolution: metaData.resolution ?? [],
            totalSizeBytes: metaData.totalSizeBytes ?? 0,
            status: event === 'job.completed' ? 'SUCCESS' : 'FAILED',
          })
          .where(eq(schema.transcoding_metadata.id, existingTranscoding[0].id));
      } else {
        await this.db.insert(schema.transcoding_metadata).values({
          id: randomUUID(),
          video_id: videoRow.id,
          fileCount: metaData.fileCount ?? 0,
          resolution: metaData.resolution ?? [],
          totalSizeBytes: metaData.totalSizeBytes ?? 0,
          status: event === 'job.completed' ? 'SUCCESS' : 'FAILED',
          updatedAt: new Date(),
        });
      }

      const prevStorage =
        existingTranscoding.length > 0
          ? videoRow.videoSize + (existingTranscoding[0].totalSizeBytes ?? 0)
          : videoRow.videoSize;
      const totalStorageUsage = metaData.totalSizeBytes + videoRow.videoSize;
      const storageUsed = totalStorageUsage - prevStorage;

      const [usageRow] = await this.db
        .select({
          id: schema.usage.id,
          storage_usage: schema.usage.storage_usage,
        })
        .from(schema.usage)
        .where(eq(schema.usage.user_id, videoRow.userId))
        .limit(1);

      const updatedStorageUsage = Math.max(
        0,
        (usageRow?.storage_usage ?? 0) + storageUsed,
      );

      if (usageRow) {
        await this.db
          .update(schema.usage)
          .set({
            storage_usage: updatedStorageUsage,
            updated_at: new Date(),
          })
          .where(eq(schema.usage.id, usageRow.id));
      } else {
        await this.db.insert(schema.usage).values({
          user_id: videoRow.userId,
          storage_usage: updatedStorageUsage,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      const redis_key = usageRedisKey(videoRow.userId);
      const isExist = await this.redis.exists(redis_key);
      if (!isExist) {
        await this.redis.hset(redis_key, {
          storageUsage: updatedStorageUsage,
          videoCount: 1,
        });
        void this.redis.expire(redis_key, PLAN_REDIS_TTL);
      }

      return { message: 'Webhook processed successfully' };
    } catch (err: unknown) {
      console.error('Error in webhook:', err as Record<string, unknown>);
      if (
        err instanceof UnauthorizedException ||
        err instanceof BadGatewayException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to handle webhook');
    }
  }

  async getVideosMetadata(userId: string) {
    return this.db
      .select({
        title: schema.video_metadata.title,
        description: schema.video_metadata.description,
        playlist_id: schema.video_metadata.playlist_id,
        playlist_name: schema.playlist.name,
        videoTracking_id: schema.video_metadata.videoTracking_id,
        thumbnailTracking_id: schema.video_metadata.thumbnailTracking_id,
        status: schema.video_metadata.status,
      })
      .from(schema.video_metadata)
      .leftJoin(
        schema.playlist,
        eq(schema.video_metadata.playlist_id, schema.playlist.id),
      )
      .where(eq(schema.video_metadata.user_id, userId))
      .orderBy(schema.video_metadata.created_at);
  }
}
