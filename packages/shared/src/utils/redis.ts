import IORedis from "ioredis";

interface RedisConfig {
  url?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

const DEFAULT_CONFIG: Required<RedisConfig> = {
  url: "redis://localhost:6379",
  retryAttempts: 3,
  retryDelay: 1000,
};

export function createRedisConnection(config: RedisConfig = {}): IORedis {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const connection = new IORedis(finalConfig.url, {
    maxRetriesPerRequest: finalConfig.retryAttempts,
    retryStrategy: (times: number) => {
      if (times > finalConfig.retryAttempts) {
        return null; // Stop retrying
      }
      return finalConfig.retryDelay;
    },
  });

  connection.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  connection.on("connect", () => {
    console.log("Connected to Redis");
  });

  connection.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
  });

  return connection;
}
