import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './infra/cache.module';
import { RedisModule } from './infra/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiKeyLastUsedCron } from './schedule/api-key-last-used.cron';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyController } from './controllers/api-key.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CacheModule,
    RedisModule,
  ],
  controllers: [AppController, ApiKeyController],
  providers: [AppService, ApiKeyLastUsedCron, ApiKeyService],
})
export class AppModule {}
