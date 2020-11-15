import React from 'react';
import { UncontrolledCarousel, Col, Container, Row } from 'reactstrap';
import _ from 'lodash';

import HeaderSeparator from 'components/header_separator';

import carouselImages from './carousel_images.json';

const HowWeDidSection = () => (
  <section className="section section-shaped my-md section-lg">
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
        <Col lg="6" className="mb-md">
          <h3 className="display-3 text-white font-weight-light">How we did it</h3>

          <p className="lead text-white">
            On these photos, we can clearly see the application of the electrodes. Please ignore the electrodes placed
            at chin and eye level (they were used for manual data scoring purposes). For this recording, we used the
            Cyton board and a microSD card. We put the board in a disposable plastic container that we covered with
            aluminum foil, to limit EMIs. Then, we put the container in a camera bag worn with a shoulder strap to be
            able to carry the board on us.
          </p>
        </Col>
        <Col className="mb-lg-auto" lg="5">
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
