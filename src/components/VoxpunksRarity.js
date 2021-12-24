import React, { useState, useEffect } from "react";
import axios from "axios";

import "../voxpunks.css";

export default function VoxpunksRarity() {
  const [error, setError] = useState(null);
  const [punks, setPunks] = useState([]);

  useEffect(() => {
    document.body.className = "voxpunks";
    return () => {
      document.body.className = "";
    };
  }, []);

  const loadTokensByAddress = async (address) => {
    if (!address) {
      return;
    }
    axios
      .get("https://miso.one/api/v1/get-tokens-by-address?address=" + address)
      .then(function (response) {
        setError(null);
        if (response.data && response.data.punks) {
          let sortedPunks = response.data.punks.sort((a, b) => {
            if (a.rank < b.rank) {
              return -1;
            }
            if (a.rank > b.rank) {
              return 1;
            }
            return 0;
          });
          setPunks(sortedPunks);
        }
        //console.log(response);
      })
      .catch(function (error) {
        setError("Solana public RPC is not reachable: " + error.message);
        console.log(error);
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className="navigation-row text-center search-page">
          <label>Find ranks of all your punks by wallet address</label>
          <input
            type="text"
            placeholder="Solana address"
            onChange={(event) => {
              loadTokensByAddress(event.target.value);
            }}
          ></input>
          <p className="error">{error || ""}</p>
          <div className="search-punks">
            {punks.map((punk) => {
              let url =
                "https://voxpunksclub.com/images/small/" + punk.id + ".jpg";
              return (
                <div className="punk-row" key={punk.address}>
                  <img src={url} alt=""></img>
                  <p className="hint">{punk.name}</p>
                  <p>
                    Rank: <b>{punk.rank}</b>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </header>
    </div>
  );
}
