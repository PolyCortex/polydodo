import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" render={props => <>Hello World!</>} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
