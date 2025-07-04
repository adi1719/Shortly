const redis = require("../config/redis");

const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

class RedisService {
  async getCachedUrl(url) {
    try {
      const cachedUrl = await redis.get(`url:${url}`);
      return cachedUrl ? JSON.parse(cachedUrl) : null;
    } catch (err) {
      console.warn("Redis getCachedUrl failed:", err.message);
      return null;
    }
  }

  async cacheUrl(url, data) {
    try {
      await redis.setex(`url:${url}`, CACHE_DURATION, JSON.stringify(data));
    } catch (err) {
      console.warn("Redis cacheUrl failed:", err.message);
    }
  }

  async invalidateUrlCache(url) {
    try {
      await redis.del(`url:${url}`);
    } catch (err) {
      console.warn("Redis invalidateUrlCache failed:", err.message);
    }
  }

  async getCachedAnalytics(shortId) {
    try {
      const cachedAnalytics = await redis.get(`analytics:${shortId}`);
      return cachedAnalytics ? JSON.parse(cachedAnalytics) : null;
    } catch (err) {
      console.warn("Redis getCachedAnalytics failed:", err.message);
      return null;
    }
  }

  async cacheAnalytics(shortId, data) {
    try {
      await redis.setex(
        `analytics:${shortId}`,
        CACHE_DURATION,
        JSON.stringify(data)
      );
    } catch (err) {
      console.warn("Redis cacheAnalytics failed:", err.message);
    }
  }

  async getCachedRedirect(shortId) {
    try {
      return await redis.get(`redirect:${shortId}`);
    } catch (err) {
      console.warn("Redis getCachedRedirect failed:", err.message);
      return null;
    }
  }

  async cacheRedirect(shortId, redirectUrl) {
    try {
      await redis.setex(`redirect:${shortId}`, CACHE_DURATION, redirectUrl);
    } catch (err) {
      console.warn("Redis cacheRedirect failed:", err.message);
    }
  }
}

module.exports = new RedisService();
