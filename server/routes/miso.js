const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const indexPath = path.resolve("./build/index.html");

router.get("/", async function (req, res) {
  fs.stat(indexPath, function (err, stats) {
    if (stats) {
      res.status(200).sendFile(indexPath);
    } else {
      res.send("Miso One.");
    }
  });
});

module.exports = router;
