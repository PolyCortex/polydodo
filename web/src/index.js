import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'argon-design-system-react/src/assets/vendor/nucleo/css/nucleo.css';
import 'argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.min.css';
import 'argon-design-system-react/src/assets/scss/argon-design-system-react.scss';
import 'assets/css/visualisation.css';

import SleepAnalysis from 'views/sleep_analysis/sleep_analysis';
import Performance from 'views/performance/performance';
import ScrollToTop from 'components/scroll_to_top';
import Emoji from 'components/emoji';

// --------------

var messages = require('./helloworld_pb');
var services = require('./helloworld_grpc_pb');

var grpc = require('grpc');

var client = new services.GreeterClient('localhost:50051', grpc.credentials.createInsecure());
var request = new messages.HelloRequest();
var user;
if (process.argv.length >= 3) {
  user = process.argv[2];
} else {
  user = 'world';
}
request.setName(user);
client.sayHello(request, function (err, response) {
  console.log('Greeting:', response.getMessage());
});

// --------------

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <ScrollToTop>
      <Switch>
        <Route exact path="/" render={() => <SleepAnalysis />} />
        <Route
          exact
          path="/record-my-sleep"
          render={() => (
            <h1 className="">
              Under Construction... <Emoji symbol="🏗️" />
            </h1>
          )}
        />
        <Route exact path="/analyze-my-sleep" render={() => <SleepAnalysis />} />
        <Route exact path="/performance" render={() => <Performance />} />
        <Redirect to="/" />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>,
  document.getElementById('root'),
);
