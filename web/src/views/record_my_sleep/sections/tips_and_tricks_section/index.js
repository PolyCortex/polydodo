import React from 'react';
import { Card, CardBody, CardDeck, Container } from 'reactstrap';

const TipsAndTricksSection = () => (
  <section className="section section-lg pt-lg-0 pb-lg-0 mt--100">
    <Container className="text-justify pt-lg-5">
      <CardDeck>
        <Card className="card-lift--hover shadow border-0">
          <CardBody className="py-5">
            <h6 className="text-warning text-uppercase">Ensure good skin contact</h6>
            <p className="mt-3">
              To ensure that skin contact is good, it is important to measure the impedance between the electrodes.
              Start by measuring the impedance between your active electrode and its reference (e.g.: Fpz and Cz). Also,
              check the impedance between the reference electrodes of each channel (Cz and Oz) and the ground electrode
              (A2). As a rule of thumb, low impedance (10 KOhms) is good and high ones are bad (let’s say 150 KOhms).
            </p>
          </CardBody>
        </Card>
        <Card className="card-lift--hover shadow border-0">
          <CardBody className="py-5">
            <h6 className="text-primary text-uppercase">Limit noise</h6>
            <p className="mt-3">
              Tie the electrodes together with a hair tie, and if you have long hair, tie them all together in order to
              avoid static during the night. To limit electromagnetic interferences you may want to place your board in
              some sort of Faraday cage, for example, a plastic container wrapped up in aluminium foil.
            </p>
          </CardBody>
        </Card>
      </CardDeck>
    </Container>
  </section>
);

export default TipsAndTricksSection;
