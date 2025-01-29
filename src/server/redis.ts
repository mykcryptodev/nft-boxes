import { Redis } from '@upstash/redis';

import { env } from '~/env';

// Parse URL to get credentials
const url = env.REDIS_URL;
const token = env.REDIS_PASSWORD;

// Create Redis client singleton with Upstash client
const redis = new Redis({
  url,
  token,
  automaticDeserialization: true,
});

// Helper functions for identity caching
const IDENTITY_CACHE_PREFIX = 'identity:';
const IDENTITY_CACHE_TTL = 300; // 5 minutes in seconds

export type CachedIdentity = {
  name: string | null;
  image: string | null;
  bio: string | null;
};

export async function getCachedIdentity(address: string): Promise<CachedIdentity | null> {
  try {
    const cachedData = await redis.get<CachedIdentity>(`${IDENTITY_CACHE_PREFIX}${address.toLowerCase()}`);
    if (!cachedData) return null;
    return cachedData;
  } catch (err) {
    console.error('Upstash Redis Get Error:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

export async function setCachedIdentity(address: string, identityData: CachedIdentity): Promise<void> {
  try {
    await redis.set(
      `${IDENTITY_CACHE_PREFIX}${address.toLowerCase()}`,
      identityData,
      {
        ex: IDENTITY_CACHE_TTL,
      }
    );
  } catch (err) {
    console.error('Upstash Redis Set Error:', err instanceof Error ? err.message : String(err));
  }
} 