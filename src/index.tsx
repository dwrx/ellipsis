import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Chart from "./components/Chart";
import Stats from "./components/Stats";
import IndexPage from "./components/IndexPage";
import Voxpunks from "./components/Voxpunks";
import VoxpunksRarity from "./components/VoxpunksRarity";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/eps">
          <Stats />
          <Chart />
        </Route>
        <Route path="/voxpunks">
          <Voxpunks />
        </Route>
        <Route path="/voxpunks-rarity">
          <VoxpunksRarity />
        </Route>
        <Route exact path="/">
          <IndexPage />
        </Route>
      </Switch>
    </Router>
  );
};

render(<App />, document.getElementById("root"));
