import PreviewButton from 'components/preview_button';
import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

const CallToActionSection = () => (
  <section className="section section-lg pt-0">
    <Container>
      <Card className="bg-gradient-primary shadow-lg border-0">
        <div className="p-5">
          <Row className="align-items-center">
            <Col lg="8">
              <h3 className="text-white">Nothing is better than an example</h3>
              <p className="lead text-white text-justify mt-3">
                You can use the preview mode. This gives an example of what you might see if you upload a sleep sequence
                that you have acquired.
              </p>
            </Col>
            <Col className="ml-lg-auto" lg="3">
              <PreviewButton block />
            </Col>
          </Row>
        </div>
      </Card>
    </Container>
  </section>
);

export default CallToActionSection;
