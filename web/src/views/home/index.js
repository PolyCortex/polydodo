import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import Hero from './hero/hero';

const Feature = ({ iconClassColor, iconClass, title, description, link }) => (
  <Row>
    <div className={`icon icon-lg icon-shape ${iconClassColor} shadow rounded-circle mb-5 mr-4`}>
      <i className={`ni ${iconClass}`} />
    </div>
    <Col>
      <h3 className="display-5 mb-0">{title}</h3>
      <div>{description}</div>
      {link}
    </Col>
  </Row>
);

const Home = () => {
  return (
    <div>
      <Hero />
      <Container className="mt-5 mb-5 text-justify">
        <div className="mt-6">
          <p className="lead">
            Polydodo improves the quality of the automatic analyzes of sleep usually done by sleep apps. To do so, we
            are using your EEG data which is an essential part of a reasonable sleep analysis. And the best part of it
            is that it's completly <strong>free!</strong>
          </p>
          <h2 className="mt-6">How it works</h2>
          <div className="mt-4">
            <Col>
              <Feature
                iconClassColor="icon-shape-success"
                iconClass="ni-sound-wave"
                title="Create your own sleep lab"
                description="Check out how to record your eeg while sleeping using an OpenBCI board (Cyton or Ganglion)."
                link={<Link>Learn more</Link>}
              />
              <Feature
                iconClassColor="icon-shape-danger"
                iconClass="ni-cloud-upload-96"
                title="Upload you eeg recording"
                description="Upload your eeg recording on a local server and let it score your sleep eeg for you."
              />
              <Feature
                iconClassColor="icon-shape-warning"
                iconClass="ni-chart-bar-32"
                title="Visualize how you slept"
                description="See your data and understand what it means."
              />
              <Feature
                iconClassColor="icon-shape-default"
                iconClass="ni-curved-next"
                title="Save your hypnogram"
                description="Download your results as a raw json"
              />
            </Col>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
