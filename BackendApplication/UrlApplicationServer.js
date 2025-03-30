require("dotenv").config();
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

// Database connection with enhanced error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    console.log("Database URL:", process.env.MONGODB_URI);
    console.log("Environment:", process.env.NODE_ENV);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Connection string used:", process.env.MONGODB_URI);
    process.exit(1); // Exit the process if database connection fails
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
