const { nanoid } = require("nanoid");
const URL = require("../Models/UrlModel");

async function handleGenerateShortUrl(req, res) {
  const body = req.body;
  const shortID = nanoid(8);
  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }
  try {
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });
    console.log("URL ID Generated for:", body.url, "\nID:", shortID);
    return res.json({ id: shortID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error crictical occured:", error });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateShortUrl,
  handleGetAnalytics,
};
