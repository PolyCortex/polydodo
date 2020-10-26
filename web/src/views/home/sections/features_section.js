import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

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

Feature.propTypes = {
  iconClassColor: PropTypes.string,
  iconClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.element,
};

const FeaturesSection = () => (
  <div className="mt-4">
    <h2 className="mt-6">How it works</h2>
    <Col>
      <Feature
        iconClassColor="icon-shape-success"
        iconClass="ni-sound-wave"
        title="Create your own sleep lab"
        description="Check out how to record your eeg while sleeping using an OpenBCI board (Cyton or Ganglion)."
        link={<Link to="/record-my-sleep">Learn more</Link>}
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
        iconClassColor="icon-shape-primary"
        iconClass="fa fa-save"
        title="Save your hypnogram"
        description="Download your results as a raw json"
      />
    </Col>
  </div>
);

export default FeaturesSection;
