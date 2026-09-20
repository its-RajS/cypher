import crypto from 'crypto';

export function generateKeyDigest(key: string): string {
  const secret = process.env.REDIS_SECRET_KEY;
  if (!secret) {
    throw new Error('REDIS_SECRET_KEY environment variable is required');
  }
  return crypto.createHmac('sha256', secret).update(key).digest('hex');
}
