import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

import { PreviewButton } from 'components/buttons';

import './style.css';

const IntroductionSection = () => (
  <section className="section section-lg ">
    <Container className="text-justify">
      <p className="lead">
        Here is a comprehensive guide that explains how to record your own EEG data with an OpenBCI board. The proposed
        method ensures that the recorded data will be compatible with Polydodo. This guide presents the list of needed
        materials, the positioning of the electrodes, their placement, as well as their connection. After, it will focus
        on configuring the OpenBCI boards and on what to do overnight. Be sure to follow our tips and tricks on how to
        maintain a good signal to noise ratio. Note that the supplies and the application methods are meant to follow
        best practices and to provide good quality data.
      </p>
      <Col xs="9" className="mx-auto mt-7">
        <Card className="bg-primary shadow-lg border-0">
          <div className="introduction_section__preview_card">
            <Row className="align-items-center">
              <Col lg="8">
                <h4 className="text-white">Not sure yet?</h4>
                <p className="text-white text-justify mt-3">
                  If you'd first like to see what the sleep analysis looks like, check out the preview.
                </p>
              </Col>
              <Col className="ml-lg-auto" lg="4">
                <PreviewButton block />
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Container>
  </section>
);

export default IntroductionSection;
