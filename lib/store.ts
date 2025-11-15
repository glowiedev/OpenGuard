import { ReplayStore } from "@openkitx403/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export class RedisReplayStore implements ReplayStore {
  async check(key: string, ttl: number): Promise<boolean> {
    return !!(await redis.exists(key));
  }

  async store(key: string, ttl: number): Promise<void> {
    await redis.setex(key, ttl, "1");
  }
}
