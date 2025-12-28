const redis = require("../config/redis");

const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

function isRedisReady() {
  try {
    return (
      redis && typeof redis.status === "string" && redis.status === "ready"
    );
  } catch (e) {
    return false;
  }
}

const MAX_REDIS_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 100;

async function retryOperation(fn, attempts = MAX_REDIS_ATTEMPTS) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const delay = BASE_RETRY_DELAY_MS * Math.pow(2, i);
      if (i < attempts - 1) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastErr;
}

class RedisService {
  async getCachedUrl(url) {
    try {
      const cachedUrl = await retryOperation(() => redis.get(`url:${url}`));
      return cachedUrl ? JSON.parse(cachedUrl) : null;
    } catch (err) {
      console.warn("Redis getCachedUrl failed after retries:", err.message);
      return null;
    }
  }

  async cacheUrl(url, data) {
    try {
      await retryOperation(() =>
        redis.setex(`url:${url}`, CACHE_DURATION, JSON.stringify(data))
      );
    } catch (err) {
      console.warn("Redis cacheUrl failed after retries:", err.message);
    }
  }

  async invalidateUrlCache(url) {
    try {
      await retryOperation(() => redis.del(`url:${url}`));
    } catch (err) {
      console.warn(
        "Redis invalidateUrlCache failed after retries:",
        err.message
      );
    }
  }

  async getCachedAnalytics(shortId) {
    try {
      const cachedAnalytics = await retryOperation(() =>
        redis.get(`analytics:${shortId}`)
      );
      return cachedAnalytics ? JSON.parse(cachedAnalytics) : null;
    } catch (err) {
      console.warn(
        "Redis getCachedAnalytics failed after retries:",
        err.message
      );
      return null;
    }
  }

  async cacheAnalytics(shortId, data) {
    try {
      await retryOperation(() =>
        redis.setex(
          `analytics:${shortId}`,
          CACHE_DURATION,
          JSON.stringify(data)
        )
      );
    } catch (err) {
      console.warn("Redis cacheAnalytics failed after retries:", err.message);
    }
  }

  async getCachedRedirect(shortId) {
    try {
      return await retryOperation(() => redis.get(`redirect:${shortId}`));
    } catch (err) {
      console.warn(
        "Redis getCachedRedirect failed after retries:",
        err.message
      );
      return null;
    }
  }

  async cacheRedirect(shortId, redirectUrl) {
    try {
      await retryOperation(() =>
        redis.setex(`redirect:${shortId}`, CACHE_DURATION, redirectUrl)
      );
    } catch (err) {
      console.warn("Redis cacheRedirect failed after retries:", err.message);
    }
  }
}

module.exports = new RedisService();
