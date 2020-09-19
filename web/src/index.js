import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import 'argon-design-system-react/src/assets/vendor/nucleo/css/nucleo.css';
import 'argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.min.css';
import 'argon-design-system-react/src/assets/scss/argon-design-system-react.scss';
import 'assets/css/visualisation.css';

import Header from 'components/header';
import Footer from 'components/footer';
import Navbar from 'components/navbar';
import SleepAnalysis from 'views/sleep-analysis';
import Performance from 'views/performance';
import ScrollToTop from 'components/scroll_to_top';
import Emoji from 'components/emoji';

const underConstruction = () => {
  const text = {
    header_title: 'Under',
    header_subtitle: 'construction',
    header_description: 'Please come back later',
  };

  return (
    <div>
      <Header
        sizeClass={'pb-100'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      <Container className="mt-5 text-justify">
        <h1 className="">
          Under Construction... <Emoji symbol="🏗️" />
        </h1>
      </Container>
    </div>
  );
};

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <ScrollToTop>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <SleepAnalysis />} />
        <Route exact path="/record-my-sleep" render={underConstruction} />
        <Route exact path="/analyze-my-sleep" render={underConstruction} />
        <Route exact path="/performance" render={() => <Performance />} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </ScrollToTop>
  </BrowserRouter>,
  document.getElementById('root'),
);
