import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UploadFilePart } from '@oneminutecloud/storage-bucket';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class InitiateUploadDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoFileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoContentType: string;

  @ApiProperty()
  @IsNumber()
  videoSize: number;

  @ApiProperty()
  @IsNumber()
  videoDuration: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  thumbnailFileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  thumbnailContentType: string;

  @ApiProperty()
  @IsNumber()
  thumbnailSize: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  timestamps?: string[];

  @IsOptional()
  @IsString()
  playlist?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  generateSubtitles?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeWatermark?: boolean;
}

export class CompleteUploadDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  objectId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  parts: UploadFilePart[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoId: string;
}

export class ThumbnailUploadDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  thumbnailFileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  thumbnailContentType: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  thumbnailSize: number;
}
