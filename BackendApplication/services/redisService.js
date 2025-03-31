const redis = require("../config/redis");

const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

class RedisService {
  // URL Operations
  async getCachedUrl(url) {
    const cachedUrl = await redis.get(`url:${url}`);
    return cachedUrl ? JSON.parse(cachedUrl) : null;
  }

  async cacheUrl(url, data) {
    await redis.setex(`url:${url}`, CACHE_DURATION, JSON.stringify(data));
  }

  async invalidateUrlCache(url) {
    await redis.del(`url:${url}`);
  }

  // Analytics Operations
  async getCachedAnalytics(shortId) {
    const cachedAnalytics = await redis.get(`analytics:${shortId}`);
    return cachedAnalytics ? JSON.parse(cachedAnalytics) : null;
  }

  async cacheAnalytics(shortId, data) {
    await redis.setex(
      `analytics:${shortId}`,
      CACHE_DURATION,
      JSON.stringify(data)
    );
  }

  // Redirect Operations
  async getCachedRedirect(shortId) {
    return await redis.get(`redirect:${shortId}`);
  }

  async cacheRedirect(shortId, redirectUrl) {
    await redis.setex(`redirect:${shortId}`, CACHE_DURATION, redirectUrl);
  }
}

module.exports = new RedisService();
