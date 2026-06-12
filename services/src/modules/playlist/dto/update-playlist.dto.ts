import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @MaxLength(2000, {
    message: 'Description cannot be longer than 2000 characters',
  })
  description?: string;
}
