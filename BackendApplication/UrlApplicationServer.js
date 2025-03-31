require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlRoute = require("./Routes/UrlRoute");
const URL = require("./Models/UrlModel");
const redis = require("./config/redis");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    console.log("Environment:", process.env.NODE_ENV);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Add connection event listeners
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

// Routes
app.use("/api/url", urlRoute);
app.get("/ping", (req, res) => {
  res.send("Hello PingPong, Backend is running buddy!");
});

// URL redirection endpoint with Redis caching
app.get("/:shortId", async (req, res) => {
  try {
    // Check Redis cache first
    const cachedUrl = await redis.get(`redirect:${req.params.shortId}`);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    const entry = await URL.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Cache the redirect URL
    await redis.setex(
      `redirect:${req.params.shortId}`,
      24 * 60 * 60,
      entry.redirectURL
    );

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirection error:", error);
    res.status(500).json({ error: "Failed to process redirection" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
