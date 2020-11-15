import React from 'react';
import { CardDeck, Col, Container } from 'reactstrap';

import FloatingCard from 'components/floating_card';

const TipsAndTricksSection = () => (
  <section className="section section-lg pt-lg-0 pb-lg-0 mt--300">
    <Container className="text-justify">
      <CardDeck>
        <Col lg="6" className="mb-6">
          <FloatingCard
            cardClassName="bg-gradient-warning"
            headerText="Ensure good skin contact"
            bodyText={
              <span>
                To confirm that skin contact is good, it is important to measure the impedance between the electrodes.
                You can check the impedance between your active electrode and its reference (e.g.: Fpz and Cz) through
                the OpenBCI GUI. The&nbsp;
                <strong>
                  <a href={`${process.env.PUBLIC_URL}/img/impedance_btn.png`} target="_blank" rel="noreferrer">
                    impedance button
                  </a>
                </strong>
                &nbsp;appears just beside the channel number. As a rule of thumb, low impedance (like 10 KOhms) is good
                and high ones are bad (such as 150 KOhms).
              </span>
            }
          />
        </Col>
        <Col lg="6" className="mb-6">
          <FloatingCard
            cardClassName="bg-gradient-primary"
            headerText="Limit noise"
            bodyText={
              <span>
                To limit electromagnetic interferences, there are various techniques.&nbsp;
                <strong>
                  <a
                    className="text-orange"
                    href="https://en.wikipedia.org/wiki/Twisted_pair"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twisting pairs of electrodes' wires together
                  </a>
                </strong>
                , and placing the board in some sort of Faraday cage (like aluminium foil, but be sure the board is
                isolated from the foil!) can be effective. If you have long hair, tie them all together in order to
                avoid static electricity during the night.
              </span>
            }
          />
        </Col>
      </CardDeck>
    </Container>
  </section>
);

export default TipsAndTricksSection;
