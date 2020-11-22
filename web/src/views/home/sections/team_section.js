import HeaderSeparator from 'components/header_separator';
import React from 'react';
import { Button, Col, Container, Row, UncontrolledCarousel } from 'reactstrap';

import TEAM_PHOTO from 'assets/img/team.jpg';
import TEAM_2_PHOTO from 'assets/img/team_2.jpg';
import TEAM_3_PHOTO from 'assets/img/team_3.jpg';

const ITEMS = [
  {
    src: TEAM_PHOTO,
    altText: '',
    caption: '',
    header: '',
  },
  {
    src: TEAM_2_PHOTO,
    altText: '',
    caption: '',
    header: '',
  },
  {
    src: TEAM_3_PHOTO,
    altText: '',
    caption: '',
    header: '',
  },
];

const TeamSection = () => (
  <section className="section section-shaped">
    <div className="shape shape-style-1 shape-dark">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <Container className="py-3">
      <Row className="justify-content-between align-items-center">
        <Col className="mb-lg-auto" lg="6">
          <div className="rounded shadow-lg overflow-hidden transform-perspective-right">
            <UncontrolledCarousel autoplay items={ITEMS} />
          </div>
        </Col>
        <Col className="mb-5 mb-lg-0" lg="5">
          <h1 className="text-white font-weight-light">Who are we?</h1>
          <p className="lead text-white mt-4">
            We are PolyCortex, a student club from Polytechnique Montréal that brings together neuroengineering
            enthusiasts. We are part of the international NeuroTechX community.
          </p>
          <p className="text-white">
            This website represents our submission to the Open Challenge of the NTX 2020 Student Clubs Competition
            initiative.
          </p>
          <Button
            className="btn-icon mt-4 mb-3 mb-sm-0"
            color="secondary"
            href="http://polycortex.polymtl.ca/"
            size="md"
            target="_blank"
          >
            <span className="btn-inner--icon mr-1 text-primary">
              <i className="fas fa-globe" />
            </span>
            <span className="btn-inner--text text-primary">Learn more</span>
          </Button>
        </Col>
      </Row>
    </Container>
    <HeaderSeparator />
  </section>
);

export default TeamSection;
