import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

const Feature = ({ iconClassColor, iconClass, titlePrefix, title, description, link }) => (
  <Col className="my-4" xl="3" md="6">
    <Row className="align-items-center justify-content-center">
      <h3 className="display-5 mb-4">
        <span className="text-muted mr-1">{titlePrefix}</span>
        {title}
      </h3>
    </Row>
    <Row className="align-items-center justify-content-center">
      <div className={`icon feature__icon_badge icon-shape ${iconClassColor} shadow rounded-circle mb-5`}>
        <i className={`fa ${iconClass} feature__icon`} />
      </div>
    </Row>
    <Row className="align-items-center justify-content-center">
      <Col className="text-justify">
        <span className="mr-1">{description}</span>
      </Col>
    </Row>
    {link}
  </Col>
);

Feature.propTypes = {
  iconClassColor: PropTypes.string,
  iconClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.element,
};

const ProcessSection = () => (
  <section className="section section-sm">
    <Container>
      <h2 className="pb-3">How It Works?</h2>
      <p className="lead">
        We accompany you through every steps of the process; from gathering the things you'll need, to exporting your
        very own sleep results.
      </p>
      <Row>
        <Feature
          iconClassColor="icon-shape-success"
          iconClass="fa-flask"
          titlePrefix="01|"
          title="Record"
          description="Create your own sleep lab and record your EEG while sleeping using an OpenBCI."
          link={<Link to="/record-my-sleep">Learn more</Link>}
        />
        <Feature
          iconClassColor="icon-shape-danger"
          iconClass="fa-cloud-upload"
          titlePrefix="02|"
          title="Upload"
          description="Upload your recording to the local server and let it score your sleep for you."
        />
        <Feature
          iconClassColor="icon-shape-warning"
          iconClass="fa-bar-chart"
          titlePrefix="03|"
          title="Visualize"
          description="Check out your results and see how you slept through our personalized infographics."
          link={<Link to={{ pathname: '/sleep-analysis-results', state: { isPreviewMode: true } }}>Have a look</Link>}
        />
        <Feature
          iconClassColor="icon-shape-primary"
          iconClass="fa-save"
          titlePrefix="04|"
          title="Export"
          description="Save your results to your local file system as a json."
        />
      </Row>
    </Container>
  </section>
);

export default ProcessSection;
