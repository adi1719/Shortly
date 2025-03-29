const express = require("express");
const app = express();
const PORT = 8080;
const connectToDb = require("./DatabaseConnection");
const urlRoute = require("./Routes/UrlRoute");
const URL = require("./Models/UrlModel");

app.listen(PORT, () => {
  console.log("Server running @ PORT:", PORT);
});

app.use(express.json());

connectToDb("mongodb://localhost:27017/url-shortner");

app.get("/:shortId", async (req, res) => {
  const shortID = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: shortID },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
    console.log("URL:", entry.redirectURL, "URL_ID:", shortID, "TimeStamp:");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while handling the redirection" });
  }
});

app.use("/url", urlRoute);
