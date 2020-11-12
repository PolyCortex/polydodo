import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import Carousel from 'components/carousel';

import carouselImages from './carousel_images.json';

const HowWeDidSection = () => (
  <section className="section section-lg">
    <Container className="text-justify">
      <h3 className="display-3">How we did it</h3>
      <Row>
        <Col xs="8">
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <Button className="btn-icon mb-3 mb-sm-0" color="success" to="/analyze-my-sleep" tag={Link} size="lg">
            <span className="btn-inner--icon mr-1">
              <i className="fas fa-file-medical-alt fa-lg" />
            </span>
            <span className="btn-inner--text">Analyze my sleep</span>
          </Button>
        </Col>
        <Col xs="4">
          <Carousel items={carouselImages.items} />
        </Col>
      </Row>
    </Container>
  </section>
);

export default HowWeDidSection;
