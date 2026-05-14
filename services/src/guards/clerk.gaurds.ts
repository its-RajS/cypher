import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { LRUCache } from 'lru-cache/raw';
import { verifyToken} from '@clerk/backend';
import { REDIS_CLIENT } from '../infra/redis.module';
import Redis from 'ioredis';
import { DRIZZLE_DB } from '../database/database.module';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../database/schema';
import * as argon2 from 'argon2';
import { Observable } from 'rxjs';


interface CachedKey {
  userId: string;
  expiredAt?: number;
}

const VERSION = 'v1';
const REDIS_HARD_TTL = 10 * 60 * 1000;
const LRU_SOFT_TTL = 5 * 60 * 1000;
const localCache = new LRUCache<string, CachedKey>({ max: 100_000 });

@Injectable()
export class ClerkAuthGuard implements CanActivate {
   constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_DB)
    private db: NeonHttpDatabase<typeof schema>,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
       const  req = context.switchToHttp().getRequest();
       const apiKey = req.headers['x-api-key'];
       
       if(apiKey){

       }else{
        const token = await req.headers['authorization']?.split(' ')[1];
        if(!token){
            throw new UnauthorizedException('Missing authentication token')
        }
        
       }
   }
}