
'use strict'

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, HashRouter } from "react-router-dom";
import indexRoutes from "./routes/index.jsx";



const hist = createBrowserHistory();

ReactDOM.render(
  <HashRouter>
  {/* <Router history={hist}> */}
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  {/* </Router>, */}
  </HashRouter>,
  document.getElementById("app")
);
