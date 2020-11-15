import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const CallToAction = () => (
  <section className="section section-lg">
    <Container className="text-justify">
      <h3 className="display-3">Analyze my sleep</h3>
      <p className="lead">
        Now that you have your recorded sleep data file, you will need to install and run the sleep analysis server.
        Then, you will be able to submit your recorded data to the Polydodo sleep analysis algorithm. When you are ready
        to proceed, perhaps after a sip of coffee, it's right there:
      </p>
      <Button className="btn-icon my-5 mb-sm-0" color="primary" to="/analyze-my-sleep" tag={Link} size="lg">
        <span className="btn-inner--icon mr-1">
          <i className="fas fa-file-medical-alt fa-lg" />
        </span>
        <span className="btn-inner--text">Analyze my sleep</span>
      </Button>
    </Container>
  </section>
);

export default CallToAction;
