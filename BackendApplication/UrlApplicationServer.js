const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlRoute = require("./Routes/UrlRoute");
const URL = require("./Models/UrlModel");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Database connection
mongoose
  .connect("mongodb://localhost:27017/url-shortner")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/url", urlRoute);

// URL redirection endpoint
app.get("/:shortId", async (req, res) => {
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

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
