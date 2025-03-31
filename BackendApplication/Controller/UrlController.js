const { nanoid } = require("nanoid");
const URL = require("../Models/UrlModel");
const redis = require("../config/redis");

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60;

async function handleGenerateShortUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Check if URL exists in Redis cache
    const cachedUrl = await redis.get(`url:${url}`);
    if (cachedUrl) {
      return res.status(200).json(JSON.parse(cachedUrl));
    }

    const shortId = nanoid(8);
    const newUrl = await URL.create({
      shortId,
      redirectURL: url,
      visitHistory: [],
    });

    const response = {
      shortId: newUrl.shortId,
      originalUrl: newUrl.redirectURL,
      shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortId}`,
    };

    // Cache the response
    await redis.setex(`url:${url}`, CACHE_DURATION, JSON.stringify(response));

    return res.status(201).json(response);
  } catch (error) {
    console.error("URL generation error:", error);
    return res.status(500).json({ error: "Failed to generate short URL" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const { shortId } = req.params;

    // Check if analytics exist in Redis cache
    const cachedAnalytics = await redis.get(`analytics:${shortId}`);
    if (cachedAnalytics) {
      return res.json(JSON.parse(cachedAnalytics));
    }

    const url = await URL.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
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
    await redis.setex(
      `analytics:${shortId}`,
      CACHE_DURATION,
      JSON.stringify(analytics)
    );

    return res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

// Function to invalidate cache when URL is updated
async function invalidateUrlCache(url) {
  await redis.del(`url:${url}`);
}

module.exports = {
  handleGenerateShortUrl,
  handleGetAnalytics,
  invalidateUrlCache,
};
