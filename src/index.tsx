import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import Chart from "./components/Chart";
import Stats from "./components/Stats";
import IndexPage from "./components/IndexPage";

const App = () => {
  return (
    <Router>
      {/* <div>
      <nav>
        <ul>
          <li>
            <NavLink activeClassName="active" to="/voxpunks">Marketplaces</NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to="/voxpunks-rarity">Ranks by address</NavLink>
          </li>
        </ul>
      </nav> */}

      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/eps">
          <Stats />
          <Chart />
        </Route>
        <Route exact path="/">
          <IndexPage />
        </Route>
        {/* <Route path="/">
          <IndexPage />
        </Route> */}
      </Switch>
      {/* </div> */}
    </Router>
    // <div>
    //   <Stats />
    //   <Chart />
    // </div>
  );
};

render(<App />, document.getElementById("root"));
