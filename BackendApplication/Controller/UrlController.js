const { nanoid } = require("nanoid");
const URL = require("../Models/UrlModel");

async function handleGenerateShortUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortId = nanoid(8);
    const newUrl = await URL.create({
      shortId,
      redirectURL: url,
      visitHistory: [],
    });

    return res.status(201).json({
      shortId: newUrl.shortId,
      originalUrl: newUrl.redirectURL,
      shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortId}`,
    });
  } catch (error) {
    console.error("URL generation error:", error);
    return res.status(500).json({ error: "Failed to generate short URL" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const { shortId } = req.params;
    const url = await URL.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      shortId: url.shortId,
      originalUrl: url.redirectURL,
      totalClicks: url.visitHistory.length,
      analytics: url.visitHistory.map((visit) => ({
        timestamp: visit.timestamp,
        date: new Date(visit.timestamp).toISOString(),
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

module.exports = {
  handleGenerateShortUrl,
  handleGetAnalytics,
};
