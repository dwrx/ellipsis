import React, { useState, useEffect } from "react";
//import Link from "next/link";
import Loader from "react-loader-spinner";
import InputNumber from "react-input-number";

import "../voxpunks.css";
import faceMask from "../face-mask.png";
//import soMuchVaccinated from "./so-wow.png";

function Voxpunks() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [maxRarity, setMaxRarity] = useState(100);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState("price");

  const fetchAdventureCards = () => {
    setIsLoaded(false);
    fetch(`http://localhost:8200/api/v1/get-listings/magiceden`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.punks);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const getRarityColor = (score) => {
    score = parseFloat(score);
    if (score < 1) {
      return "mythic";
    }
    if (score < 2) {
      return "legendary";
    }
    if (score < 5) {
      return "rare";
    }
    return "common";
  };

  const sortByKey = (a, b) => {
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  };

  const getTableRow = (item) => {
    if (item.price > maxPrice && maxPrice !== 0) return;
    return (
      <tr key={item.mintAddress}>
        <td>
          <p className="hint">{item.title}</p>
          <p className="hint">
            Rank: <b>{item.rank}</b>
          </p>
          {item.price ? <b>{item.price.toFixed(2)} SOL</b> : "Not listed"}
        </td>
        <td className="mobile-hidden">
          {item.vaccinated ? (
            <label className="special">
              <center>
                <p>COVID protection</p>
                <img src={faceMask} alt="face mask"></img>
                <p>much wow</p>
              </center>
            </label>
          ) : (
            ""
          )}
        </td>
        <td>
          {item.attributes.map((attr) => (
            <label key={Math.random()}>
              {attr.trait_type}: <b>{attr.value}</b>{" "}
              <b className={`color-` + getRarityColor(attr.rarity)}>
                {attr.rarity}%
              </b>
            </label>
          ))}
        </td>
        <td className="text-center">
          <a
            href={"https://magiceden.io/item-details/" + item.mintAddress}
            target="_blank"
            rel="noopener noreferrer"
          >
            Magic Eden
          </a>
        </td>
      </tr>
    );
  };

  useEffect(() => {
    fetchAdventureCards();
    document.body.className = "voxpunks";
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {error ? <p>{error.message}</p> : ""}
        <div className="navigation-row">
          <center>
            {/* <h1>Vox Punks Markets</h1>
            <h3>🧹🧹🧹 Find paper hands with rare punks 🧹🧹🧹</h3> */}
            {/* <img src={soMuchVaccinated} alt=""></img> */}
          </center>

          <div>
            <label>Max rarity, %</label>
            <InputNumber
              min={0.1}
              max={100}
              step={0.1}
              value={maxRarity}
              onChange={setMaxRarity}
            />
          </div>
          <div>
            <label>Max price, SOL</label>
            <input
              className="price"
              type="number"
              placeholder="0 SOL"
              onChange={(event) => {
                setMaxPrice(event.target.value);
              }}
            ></input>
          </div>
          <div>
            <label>Sort By</label>

            <select
              onChange={(event) => {
                setSortBy(event.target.value);
              }}
            >
              <option value="price">Price</option>
              <option value="rank">Rank</option>
            </select>
          </div>
          <div>
            <a href="/voxpunks-rarity" className="color-pink">
              Go to Rarity
            </a>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Price ⬇</th>
              <th className="mobile-hidden">Specials</th>
              <th>Traits</th>
              <th>Market</th>
            </tr>
          </thead>
          <tbody>
            {items
              .sort(sortByKey)
              .map((item) =>
                item.rarity <= maxRarity ? getTableRow(item) : undefined
              )}
          </tbody>
        </table>
        {!isLoaded ? (
          <center>
            {<Loader type="Oval" color="#007aff" height={50} width={50} />}
          </center>
        ) : (
          ""
        )}
      </header>
    </div>
  );
}

export default Voxpunks;
