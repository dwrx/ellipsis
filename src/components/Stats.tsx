import React, { useState, useEffect } from "react";
interface IEpsStats {
  month: number;
  twoMonths: number;
  threeMonths: number;
}

const API = "miso.one";

function Stats() {
  const [error, setError] = useState<null | { message: string }>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({} as IEpsStats);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(`https://${API}/eps/eps-stats`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setStats(result.stats);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (isLoaded && stats && !error) {
    return (
      <div className="row">
        <div className="block">
          <h4>
            Monthly average
            <br /> EPS lock yield
          </h4>
          <hr />
          <p>{(stats.month / 12).toFixed(2)}%</p>
        </div>
        <div className="block">
          <h4>
            30 days average
            <br /> EPS APY
          </h4>
          <hr />
          <p>{stats.month}%</p>
        </div>
        <div className="block">
          <h4>
            90 days average
            <br /> EPS APY
          </h4>
          <hr />
          <p>{stats.threeMonths}%</p>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Stats;
