import React from "react";
import { render } from "react-dom";

import Chart from "./components/Chart";
import "./index.css";

const App = () => {
  return (
    <div>
      <Chart />
    </div>
  );
};

render(<App />, document.getElementById("root"));
