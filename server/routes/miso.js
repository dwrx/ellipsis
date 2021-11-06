const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async function (req, res) {
  res.status(200).sendFile(path.resolve("./build/index.html"));
});

module.exports = router;
