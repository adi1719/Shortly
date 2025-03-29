const mongoose = require("mongoose");

async function connectToDb(url) {
  try {
    await mongoose.connect(url);
    console.log("Connected to DB!");
  } catch (error) {
    console.error("There was an Error Connecting to DB! :( \n ERROR:", error);
  }
}

module.exports = connectToDb;
