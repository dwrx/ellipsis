import React from "react";
import { render } from "react-dom";

import Chart from "./components/Chart";
import Stats from "./components/Stats";
import "./index.css";

const App = () => {
  return (
    <div>
      <Stats />
      <Chart />
    </div>
  );
};

render(<App />, document.getElementById("root"));
