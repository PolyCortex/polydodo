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
              <p className="lead text-white mt-3">
                I will be the leader of a company that ends up being worth billions of dollars, because I got the
                answers. I understand culture.
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
