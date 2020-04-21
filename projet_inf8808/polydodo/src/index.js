import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import SleepAnalysis from "views/SleepAnalysis/sleep_analysis";
import Emoji from "components/emoji";

const UnderConstruction = <h1 className="">Under Construction... <Emoji symbol="🏗️"/></h1>

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={props => <SleepAnalysis/>} />
      <Route exact path="/record-my-sleep" render={props => UnderConstruction } />
      <Route exact path="/analyze-my-sleep" render={props => <SleepAnalysis/> } />
      <Route exact path="/performance" render={props => UnderConstruction } />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
