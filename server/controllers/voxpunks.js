const fs = require("fs");
const path = require("path");
const axios = require("axios");
const vox = require("../config/voxpunks-rarity.json");
const ranks = require("../config/voxpunks-ranks.json");
let PUNKS = [];
module.exports = async function updatePrices(skip = 0, limit = 500) {
  const { data } = await axios.get(
    `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=%7B%22%24match%22%3A%7B%22collectionSymbol%22%3A%22voxpunksclub%22%7D%2C%22%24sort%22%3A%7B%22takerAmount%22%3A1%2C%22createdAt%22%3A-1%7D%2C%22%24skip%22%3A${skip}%2C%22%24limit%22%3A${limit}%7D`
  );
  for (let item of data.results) {
    const attributes = getParsedAttributes(item.attributes);
    const punk = {
      title: item.title,
      price: item.price,
      mintAddress: item.mintAddress,
      attributes: attributes,
      vaccinated: isVaccinated(item.attributes),
      rarity: getLowestRarity(attributes),
      rank: ranks[item.mintAddress]["rank"],
    };
    PUNKS.push(punk);
  }
  if (data.results.length) {
    updatePrices(limit, limit + 500);
  } else {
    console.log(new Date(), "Updated all prices.");
    fs.writeFile(
      path.resolve(__dirname, "../listings/vox-punks.json"),
      JSON.stringify(PUNKS),
      (err) => {
        if (err) {
          console.error(
            "Cannot write file with vox punks to disk:",
            err.message
          );
        }
        PUNKS = [];
      }
    );
  }
};
const getParsedAttributes = (attributes) => {
  return attributes.map((trait) => {
    return {
      trait_type: trait.trait_type,
      value: trait.value,
      rarity: getRarity(trait.trait_type, trait.value),
    };
  });
};
const getRarity = (type, value) => {
  value = value.toLowerCase().replace(/ /g, "-");
  if (!vox[type][value]) {
    console.log(`Not found: ${type} = ${value}`);
  }
  return vox[type][value] ? vox[type][value]["rarity"] : "0";
};
const isVaccinated = (attributes) => {
  let vaccinated = false;
  attributes.map((item) => {
    if (item.value === "Covid Mask") {
      vaccinated = true;
    }
  });
  return vaccinated;
};
const getLowestRarity = (attributes) => {
  let rarity = 100;
  attributes.map((item) => {
    rarity =
      parseFloat(item.rarity) < rarity ? parseFloat(item.rarity) : rarity;
  });
  return rarity;
};
