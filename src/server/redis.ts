import { Redis } from '@upstash/redis';
import { type Address } from 'viem';

import { env } from '~/env';

// Parse URL to get credentials
const url = env.REDIS_URL;
const token = env.REDIS_PASSWORD;

// Create Redis client singleton with Upstash client
const redis = new Redis({
  url: url.toString(),
  token,
  automaticDeserialization: true,
});

// Helper functions for identity caching
const IDENTITY_CACHE_PREFIX = 'identity:';
const CONTEST_CACHE_PREFIX = 'contest:';
const CACHE_TTL = 300; // 5 minutes in seconds

export type CachedIdentity = {
  name: string | null;
  image: string | null;
  bio: string | null;
};

export type CachedContest = {
  id: bigint;
  gameId: bigint;
  creator: string;
  boxCost: {
    currency: Address;
    decimals: number;
    symbol: string;
    name: string;
    amount: bigint;
    image: string;
  };
  boxesCanBeClaimed: boolean;
  rewardsPaid: {
    q1Paid: boolean;
    q2Paid: boolean;
    q3Paid: boolean;
    finalPaid: boolean;
  };
  totalRewards: bigint;
  boxesClaimed: bigint;
  randomValuesSet: boolean;
  cols: readonly number[];
  rows: readonly number[];
  boxesAddress: Address;
  q1Paid: boolean;
  q2Paid: boolean;
  q3Paid: boolean;
  finalPaid: boolean;
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
        ex: CACHE_TTL,
      }
    );
  } catch (err) {
    console.error('Upstash Redis Set Error:', err instanceof Error ? err.message : String(err));
  }
}

export async function getCachedContest(contestId: string): Promise<CachedContest | null> {
  try {
    const cachedData = await redis.get<CachedContest>(`${CONTEST_CACHE_PREFIX}${contestId}`);
    if (!cachedData) return null;
    return cachedData;
  } catch (err) {
    console.error('Upstash Redis Get Error:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

export async function setCachedContest(contestId: string, contestData: CachedContest): Promise<void> {
  try {
    await redis.set(
      `${CONTEST_CACHE_PREFIX}${contestId}`,
      contestData,
      {
        ex: CACHE_TTL,
      }
    );
  } catch (err) {
    console.error('Upstash Redis Set Error:', err instanceof Error ? err.message : String(err));
  }
}

export async function invalidateContestCache(contestId: string): Promise<void> {
  try {
    await redis.del(`${CONTEST_CACHE_PREFIX}${contestId}`);
  } catch (err) {
    console.error('Upstash Redis Delete Error:', err instanceof Error ? err.message : String(err));
  }
} 