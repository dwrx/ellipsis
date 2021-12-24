const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const router = express.Router();

const updatePrices = require("../controllers/voxpunks");
const ranks = require("../config/voxpunks-ranks.json");
setInterval(async () => {
  try {
    await updatePrices();
  } catch (err) {
    console.error("Cannot update prices on MagicEden");
  }
}, 30000);

router.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  return next();
});

const indexPath = path.resolve("./build/index.html");

router.get(["/voxpunks", "/voxpunks-rarity"], function (req, res) {
  fs.stat(indexPath, function (err, stats) {
    if (stats) {
      res.status(200).sendFile(indexPath);
    } else {
      res.send("Miso One.");
    }
  });
});

router.get("/api/v1/get-listings/magiceden", async (req, res) => {
  console.log(new Date(), "[API] Get magiceden listings");
  fs.readFile(
    path.resolve(__dirname, "../listings/vox-punks.json"),
    (err, data) => {
      if (err) {
        console.error("[API] Cannot get magiceden listings", err.message);
      }
      let punks = [];
      try {
        punks = JSON.parse(data.toString());
      } catch (e) {
        console.error("[API] Cannot parse json with magiceden listings");
      }
      return res.json({ success: true, punks: punks });
    }
  );
});
router.get("/api/v1/get-tokens-by-address", async (req, res) => {
  console.log(new Date(), "[API] Get tokens by address");
  const address = req.query.address;
  if (!address) {
    return res.status(500).json({ success: true, punks: [] });
  }
  let response;
  let punks = [];
  try {
    response = await getProgramAccounts(address.toString());
    if (response.data && response.data.result) {
      punks = response.data.result
        .map((item) => {
          let info = item.account.data.parsed.info;
          let mint = info.mint;
          if (ranks[mint] && Number(info.tokenAmount.amount) === 1) {
            return {
              address: mint,
              id: ranks[mint]["id"],
              name: ranks[mint]["name"],
              rank: ranks[mint]["rank"],
            };
          }
        })
        .filter((item) => item);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: true,
      message: "Solana public RPC is not reachable",
      punks: [],
    });
  }
  res.status(200).json({ succeess: true, punks: punks });
});
const getProgramAccounts = async (address) => {
  return axios({
    method: "POST",
    url: "https://api.mainnet-beta.solana.com",
    headers: { "Content-Type": "application/json" },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "getProgramAccounts",
      params: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          encoding: "jsonParsed",
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: address,
              },
            },
          ],
        },
      ],
    },
  });
};

module.exports = router;
