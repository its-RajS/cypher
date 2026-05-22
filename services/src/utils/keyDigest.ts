import crypto from 'crypto';

const REDIS_KEY_SECRET = process.env.REDIS_KEY_SECRET || '';

export function generateKeyDigest(key: string): string {
  return crypto
    .createHmac('sha256', REDIS_KEY_SECRET)
    .update(key)
    .digest('hex');
}
