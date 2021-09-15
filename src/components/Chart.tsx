import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const API = "";

function Chart() {
  const [error, setError] = useState<null | { message: string }>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const options = {
    chart: { backgroundColor: null },
    tooltip: {
      backgroundColor: "#e2e2e2",
      borderColor: "#fff",
      style: { color: "#2f2f2f" },
      pointFormat: "Locked EPS APY: <b>{point.y}%</b>",
    },
    title: { text: "" },
    credits: { enabled: false },
    exporting: { enabled: false },
    navigator: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      type: "datetime",
      gridLineWidth: 1,
      gridLineColor: "#fff",
      labels: { style: { color: "#9aa2a9", fill: "#9aa2a9" } },
    },
    yAxis: {
      //type: 'logarithmic',
      title: { text: "" },
      gridLineWidth: 1,
      gridLineColor: "#fff",
      labels: {
        style: { color: "#9aa2a9", fill: "#9aa2a9" },
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject
        ): string {
          return this.value + "%";
        },
      },
    },
    series: [
      {
        name: "EPS staking APY",
        data: items,
        type: "spline",
        color: {
          linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
          stops: [
            [0, "#c762da"],
            [1, "#4c96e2"],
          ],
        },
        lineWidth: 2,
        tooltip: { valueDecimals: 0 },
        marker: { enabled: false },
        states: { hover: { lineWidth: 2 } },
      },
    ],
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(`https://${API}/eps/eps-apy`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.apy_eps);
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

  if (error) {
    return <div className="info-label">Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="info-label">Loading...</div>;
  } else {
    return (
      <div className="chart-wrapper">
        <h2>
          Locked EPS <span>APY chart</span>
        </h2>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export default Chart;
