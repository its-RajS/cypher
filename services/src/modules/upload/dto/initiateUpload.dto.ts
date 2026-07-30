import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  generateSubtitle?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeWatermark?: boolean;
}
