const express = require("express");
const path = require("path");
const fs = require("fs");
const { sequelize } = require("../models");

const indexPath = path.resolve("./build/index.html");

const router = express.Router();

router.get("/", async function (req, res) {
  fs.stat(indexPath, function (err, stats) {
    if (stats) {
      res.status(200).sendFile(indexPath);
    } else {
      res.send("Miso One.");
    }
  });
});

router.get("/eps-apy", async function (req, res) {
  let apy = [];
  try {
    apy = await sequelize.query(
      "select apy_eps, datetime from ellipsis_staking order by datetime::bigint asc;"
    );
  } catch (e) {
    console.error("Cannot get EPS staking APY:", e.message);
    return res.json({ error: true });
  }
  apy = apy[0].map((item) => [parseInt(item.datetime, 10), item.apy_eps]);
  res.json({ success: true, apy_eps: apy });
});

router.get("/eps-stats", async function (req, res) {
  let data = {};
  const month = 30 * 24 * 3600 * 1000;
  try {
    data.month = parseInt(
      (
        await sequelize.query(
          `select avg(apy_eps) from ellipsis_staking where datetime >= ${
            Date.now() - month
          }`
        )
      )[0][0]["avg"],
      10
    );
    data.twoMonths = parseInt(
      (
        await sequelize.query(
          `select avg(apy_eps) from ellipsis_staking where datetime >= ${
            Date.now() - 2 * month
          }`
        )
      )[0][0]["avg"],
      10
    );
    data.threeMonths = parseInt(
      (
        await sequelize.query(
          `select avg(apy_eps) from ellipsis_staking where datetime >= ${
            Date.now() - 3 * month
          }`
        )
      )[0][0]["avg"],
      10
    );
  } catch (e) {
    console.error("Cannot get average EPS stats:", e.message);
    return res.json({ error: true });
  }
  res.json({ success: true, stats: data });
});

module.exports = router;
