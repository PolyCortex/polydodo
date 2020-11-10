import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

import { RecordMyOwnSleepButton, PreviewButton } from 'components/buttons';

import './style.css';

const CallToActionCard = ({ cardClassName, headerText, bodyText, button }) => (
  <Card className={`${cardClassName} shadow-lg border-0 h-100 card-lift--hover`}>
    <div className="p-5 h-100">
      <Row className="align-items-center h-100">
        <Col className="h-100 d-flex flex-column">
          <h3 className="text-white">{headerText}</h3>
          <p className="lead text-white text-justify mt-3">{bodyText}</p>
          <Row className="justify-content-center mt-auto">{button}</Row>
        </Col>
      </Row>
    </div>
  </Card>
);

const CallToActionSection = () => (
  <section className="section section-lg pt-0">
    <Container>
      <Row>
        <Col lg="6" className="mb-6">
          <CallToActionCard
            cardClassName="bg-gradient-warning"
            headerText="Record my sleep"
            bodyText="Use our comprehensive guide to get your own results. It shows a list of the necessary equipment, the EEG montage, the hardware setup, and also gives some tips and tricks!"
            button={<RecordMyOwnSleepButton className="btn-white mt-4" />}
          />
        </Col>
        <Col lg="6" className="mb-6">
          <CallToActionCard
            cardClassName="bg-gradient-primary"
            headerText="Nothing is better than an example"
            bodyText="You can use the preview mode. This gives an example of what you might see if you upload a sleep sequence that you have acquired."
            button={<PreviewButton className="btn-white mt-4 w-50 " />}
          />
        </Col>
      </Row>
    </Container>
  </section>
);

export default CallToActionSection;
