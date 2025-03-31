const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
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

module.exports = redis;
