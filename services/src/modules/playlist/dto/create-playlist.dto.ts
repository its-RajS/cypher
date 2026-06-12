import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  @MaxLength(2000, {
    message: 'Description cannot be longer than 2000 characters',
  })
  description?: string;
}
