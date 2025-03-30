const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/url-shortner";

async function connectToDb() {
  try {
    console.log("Attempting to Create a Connection to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully Connected to DB!");
  } catch (error) {
    console.error("Error Connecting to DB:", error);
  }
}

module.exports = connectToDb;
