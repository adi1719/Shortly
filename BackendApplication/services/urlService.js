const { nanoid } = require("nanoid");
const URL = require("../Models/UrlModel");
const redisService = require("./redisService");

class UrlService {
  async generateShortUrl(url, protocol, host) {
    // Check cache first
    const cachedUrl = await redisService.getCachedUrl(url);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Generate new short URL
    const shortId = nanoid(8);
    const newUrl = await URL.create({
      shortId,
      redirectURL: url,
      visitHistory: [],
    });

    const response = {
      shortId: newUrl.shortId,
      originalUrl: newUrl.redirectURL,
      shortUrl: `${protocol}://${host}/${newUrl.shortId}`,
    };

    // Cache the response
    await redisService.cacheUrl(url, response);

    return response;
  }

  async getAnalytics(shortId) {
    // Check cache first
    const cachedAnalytics = await redisService.getCachedAnalytics(shortId);
    if (cachedAnalytics) {
      return cachedAnalytics;
    }

    const url = await URL.findOne({ shortId });
    if (!url) {
      throw new Error("Short URL not found");
    }

    const analytics = {
      shortId: url.shortId,
      originalUrl: url.redirectURL,
      totalClicks: url.visitHistory.length,
      analytics: url.visitHistory.map((visit) => ({
        timestamp: visit.timestamp,
        date: new Date(visit.timestamp).toISOString(),
      })),
    };

    // Cache the analytics
    await redisService.cacheAnalytics(shortId, analytics);

    return analytics;
  }

  async handleRedirect(shortId) {
    // Check cache first
    const cachedRedirect = await redisService.getCachedRedirect(shortId);
    if (cachedRedirect) {
      return cachedRedirect;
    }

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      throw new Error("Short URL not found");
    }

    // Cache the redirect URL
    await redisService.cacheRedirect(shortId, entry.redirectURL);

    return entry.redirectURL;
  }
}

module.exports = new UrlService();
