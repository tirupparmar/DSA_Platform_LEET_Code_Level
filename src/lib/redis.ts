// Redis client — uses Upstash (free tier) or local Redis
// Upstash is recommended for production (https://upstash.com)

let redis: any = null;

export async function getRedis() {
  if (redis) return redis;

  const url = process.env.REDIS_URL;
  if (!url) {
    // Return a mock Redis for environments without Redis
    return {
      get: async (key: string) => null,
      set: async (key: string, value: string, options?: any) => 'OK',
      del: async (key: string) => 1,
      incr: async (key: string) => 1,
      expire: async (key: string, seconds: number) => 1,
    };
  }

  // Dynamic import to avoid bundling redis in client
  const { createClient } = await import('redis');
  redis = createClient({ url });
  await redis.connect();
  return redis;
}

// Caching helpers
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedis();
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300) {
  try {
    const client = await getRedis();
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    // Silently fail — cache is not critical
  }
}

export async function cacheDel(key: string) {
  try {
    const client = await getRedis();
    await client.del(key);
  } catch {}
}
