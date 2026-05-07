import { Global, Module } from '@nestjs/common';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import WebSocket from 'ws';
import * as schema from './schema';

export const DRIZZLE_DB = 'DRIZZLE_DB';

neonConfig.webSocketConstructor = WebSocket;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new Error('DATABASE_URL is not defined');
        }

        const pool = new Pool({ connectionString });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DatabaseModule {}
