const urlService = require("../services/urlService");

async function handleGenerateShortUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await urlService.generateShortUrl(
      url,
      req.protocol,
      req.get("host")
    );

    return res.status(201).json(response);
  } catch (error) {
    console.error("URL generation error:", error);
    return res.status(500).json({ error: "Failed to generate short URL" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const { shortId } = req.params;
    const analytics = await urlService.getAnalytics(shortId);
    return res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    if (error.message === "Short URL not found") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

module.exports = {
  handleGenerateShortUrl,
  handleGetAnalytics,
};
