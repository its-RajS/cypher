import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DRIZZLE_DB } from 'src/database/database.module';
import * as schema from '../../database/schema';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { and, eq } from 'drizzle-orm';
import { normalizePlanTier, PLAN_CATALOG } from 'src/configs';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async createPlaylist(userId: string, dto: CreatePlaylistDto) {
    const planRecord = await this.db.query.plan.findFirst({
      where: (p) => eq(p.user_id, userId),
      columns: { tier: true },
    });
    const effectiveLimit =
      PLAN_CATALOG[normalizePlanTier(planRecord?.tier)].maxPlaylists;

    const playlists = await this.db
      .select({
        id: schema.playlist.id,
        playlist_limit: schema.playlist.limit,
      })
      .from(schema.playlist)
      .where(eq(schema.playlist.user_id, userId));

    if (playlists.length >= effectiveLimit) {
      throw new BadRequestException(
        `You have reached the maximum limit of playlists (${effectiveLimit}). Contact the support team to increase the limit.`,
      );
    }

    const [created] = await this.db
      .insert(schema.playlist)
      .values({
        user_id: userId,
        name: dto.name,
        description: dto.description,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning({
        id: schema.playlist.id,
        name: schema.playlist.name,
        description: schema.playlist.description,
      });

    return created;
  }

  async findAll(userId: string) {
    return this.db
      .select()
      .from(schema.playlist)
      .where(eq(schema.playlist.user_id, userId));
  }

  async findOne(userId: string, id: string) {
    const record = await this.db.query.playlist.findFirst({
      where: (p) => and(eq(p.id, id), eq(p.user_id, userId)),
      columns: {
        id: true,
        name: true,
        description: true,
        cover_image_url: true,
        total_duration: true,
        total_videos: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Playlist not found');
    }

    return record;
  }

  async updatePlaylist(userId: string, id: string, dto: UpdatePlaylistDto) {
    const record = await this.db
      .update(schema.playlist)
      .set(dto)
      .where(
        and(eq(schema.playlist.id, id), eq(schema.playlist.user_id, userId)),
      )
      .returning({
        id: schema.playlist.id,
        name: schema.playlist.name,
        description: schema.playlist.description,
      });

    if (!record) {
      throw new NotFoundException('Playlist not found');
    }

    return record;
  }

  async deletePlaylist(userId: string, id: string) {
    const record = await this.db
      .delete(schema.playlist)
      .where(
        and(eq(schema.playlist.id, id), eq(schema.playlist.user_id, userId)),
      )
      .returning({
        id: schema.playlist.id,
        name: schema.playlist.name,
        description: schema.playlist.description,
      });
    if (!record) {
      throw new NotFoundException('Playlist not found');
    }
    return {
      success: true,
    };
  }
}
