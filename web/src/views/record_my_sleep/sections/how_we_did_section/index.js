import React from 'react';
import { UncontrolledCarousel, Col, Container, Row } from 'reactstrap';
import _ from 'lodash';

import HeaderSeparator from 'components/header_separator';

import carouselImages from './carousel_images.json';

const HowWeDidSection = () => (
  <section className="section section-shaped section-lg">
    <div className="shape shape-style-1 shape-dark">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>

    <Container className="text-justify">
      <Row className="justify-content-between align-items-center">
        <Col xs="5">
          <h3 className="display-3 text-white font-weight-light">How we did it</h3>

          <p className="lead text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </Col>
        <Col className="mb-lg-auto" lg="6">
          <div className="rounded shadow-lg overflow-hidden transform-perspective-left">
            <UncontrolledCarousel
              autoplay
              items={_.map(carouselImages.items, (item) =>
                Object({
                  ...item,
                  src: `${process.env.PUBLIC_URL}/${item.src}`,
                }),
              )}
            />
          </div>
        </Col>
      </Row>
    </Container>
    <HeaderSeparator />
  </section>
);

export default HowWeDidSection;
