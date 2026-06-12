import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/guards/clerk.gaurds';
import type { AuthenticatedRequest } from 'src/guards/clerk.gaurds';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlists')
@ApiTags('playlists')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a playlist' })
  createPlaylist(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePlaylistDto,
  ) {
    return this.playlistService.createPlaylist(req.user!.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all playlists' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.playlistService.findAll(req.user!.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a playlist' })
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.playlistService.findOne(req.user!.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a playlist' })
  updatePlaylist(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlistService.updatePlaylist(req.user!.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist' })
  deletePlaylist(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.playlistService.deletePlaylist(req.user!.id, id);
  }
}
