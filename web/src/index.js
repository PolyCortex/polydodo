import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';

import 'assets/css/argon-design-system-react.min.css';

import Footer from 'components/footer';
import Navbar from 'components/navbar';
import SleepAnalysisResults from 'views/sleep_analysis_results';
import Performance from 'views/performance';
import AnalyzeSleep from 'views/analyze_sleep';
import RecordMySleep from 'views/record_my_sleep';
import ScrollToTop from 'components/scroll_to_top';
import Home from 'views/home';

ReactDOM.render(
  <HashRouter>
    <ScrollToTop>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <Home />} />
        <Route exact path="/record-my-sleep" render={() => <RecordMySleep />} />
        <Route exact path="/analyze-my-sleep" render={() => <AnalyzeSleep />} />
        <Route exact path="/sleep-analysis-results" render={(props) => <SleepAnalysisResults {...props} />} />
        <Route exact path="/performance" render={() => <Performance />} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </ScrollToTop>
  </HashRouter>,
  document.getElementById('root'),
);
