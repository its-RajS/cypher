import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './infra/cache.module';
import { RedisModule } from './infra/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiKeyLastUsedCron } from './schedule/api-key-last-used.cron';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CacheModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiKeyLastUsedCron],
})
export class AppModule {}
