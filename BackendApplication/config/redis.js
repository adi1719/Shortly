const Redis = require("ioredis");

const MAX_RECONNECT_ATTEMPTS = 3;
let lastRetryCount = 0;

const redis = new Redis(process.env.REDIS_URL, {
  // Limit per-command retries and avoid queueing commands while offline
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    lastRetryCount = times;
    if (times > MAX_RECONNECT_ATTEMPTS) {
      console.warn(
        `Redis: reached max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}), stopping retries.`
      );
      return null; // returning null stops reconnect attempts
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("Connected to Redis Cloud");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("ready", () => {
  console.log("Redis client ready");
});

redis.on("close", () => {
  console.warn("Redis connection closed");
});

module.exports = redis;
