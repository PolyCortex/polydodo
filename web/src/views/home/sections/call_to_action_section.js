import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { RecordMyOwnSleepButton, PreviewButton } from 'components/buttons';
import FloatingCard from 'components/floating_card';

const CallToActionSection = () => (
  <section className="section section-lg pt-0">
    <Container>
      <Row>
        <Col lg="6" className="mb-6">
          <FloatingCard
            cardClassName="bg-gradient-warning"
            headerText="Record my sleep"
            bodyText="Use our comprehensive guide to get your own results. It shows a list of the necessary equipment, the EEG montage, the hardware setup, and also gives some tips and tricks to get the most accurate results!"
            button={<RecordMyOwnSleepButton className="btn-white mt-4" />}
          />
        </Col>
        <Col lg="6" className="mb-6">
          <FloatingCard
            cardClassName="bg-gradient-primary"
            headerText="Take a look"
            bodyText="You can use the preview mode. This gives an example of what you might see if you upload a sleep sequence that you have acquired."
            button={<PreviewButton className="btn-white btn-lg mt-4 w-50" />}
          />
        </Col>
      </Row>
    </Container>
  </section>
);

export default CallToActionSection;
