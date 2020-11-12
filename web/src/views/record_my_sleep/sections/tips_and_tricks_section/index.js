import React from 'react';
import { CardDeck, Col, Container } from 'reactstrap';

import FloatingCard from 'components/floating_card';

const TipsAndTricksSection = () => (
  <section className="section section-lg pt-lg-0 pb-lg-0 mt--150">
    <Container className="text-justify">
      <CardDeck>
        <Col lg="6" className="mb-6">
          <FloatingCard
            cardClassName="bg-gradient-warning"
            headerText="Ensure good skin contact"
            bodyText="To ensure that skin contact is good, it is important to measure the impedance between the electrodes.
                Start by measuring the impedance between your active electrode and its reference (e.g.: Fpz and Cz).
                Also, check the impedance between the reference electrodes of each channel (Cz and Oz) and the ground
                electrode (A2). As a rule of thumb, low impedance (10 KOhms) is good and high ones are bad (let’s say
                150 KOhms)."
          />
        </Col>
        <Col lg="6" className="mb-6">
          <FloatingCard
            cardClassName="bg-gradient-primary"
            headerText="Limit noise"
            bodyText="Tie the electrodes together with a hair tie, and if you have long hair, tie them all together in order
            to avoid static during the night. To limit electromagnetic interferences you may want to place your
            board in some sort of Faraday cage, for example, a plastic container wrapped up in aluminium foil."
          />
        </Col>
      </CardDeck>
    </Container>
  </section>
);

export default TipsAndTricksSection;
