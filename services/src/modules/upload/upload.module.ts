import { Module } from '@nestjs/common';
import { RedisModule } from 'src/infra/redis.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [RedisModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
