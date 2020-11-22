import React from 'react';
import { CardDeck, Col, Container } from 'reactstrap';

import FloatingCard from 'components/floating_card';

import './style.css';

const SleepMechanisms = () => (
  <Container className="text-justify mt-6 mb--100">
    <CardDeck>
      <Col lg="6">
        <FloatingCard
          cardClassName="bg-warning"
          headerText="Circadian Rhythms"
          bodyText="
                This is your biological clock! It is a self-sustained internal proccess responsable for regulating your
                sleep and wake cycles every 24 hours. This is why you feel sleepy at night and awake during the day. Some habits
                or events may have an influence on these rhythms. Sleep cycles then take place in these broader processes.
          "
        />
      </Col>
      <Col lg="6">
        <FloatingCard
          cardClassName="bg-primary"
          headerText="Sleep Homeothesis"
          bodyText="Sleep homeostasis is a biological regulatory process that rules over how much sleep time and intensity you need to get.  It is tightly coupled with the 'sleep debt' concept as the more you are awake, the more and the deeper you'll need to eventually sleep."
        />
      </Col>
    </CardDeck>
  </Container>
);

export default SleepMechanisms;
