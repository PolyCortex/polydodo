import React from 'react';
import { Col, Container, Row, Table } from 'reactstrap';

const ElectrodesPlacementStepsSection = () => (
  <section className="section bg-secondary">
    <Container className="text-justify pt-lg">
      <h3 className="display-3 mb-4">How to place the electrodes</h3>

      <div>
        <h4 className="display-4">Apply Abrasive paste</h4>
        <p className="lead">
          Now that you marked all these locations, you can clean the areas with abrasive paste. Exfoliate the skin with
          a cotton swab until it begins to turn pink, and then wash the skin using some rubbing alcohol and a cotton
          pad.
        </p>
      </div>

      <div>
        <h4 className="display-4">Place your electrodes</h4>
        <p className="lead">Make sure your electrodes are clean.</p>
        <p className="lead">
          <b>For Cz, Pz and Oz</b> (electrodes placed over your scalp): Squeeze some EC2 over a gauze pad, take an
          electrode and apply a good amount of Ten20 paste into the cup, and then set the electrode down on the EC2.
          Finally, take the gauze pad with the electrode and place it on the marked area.
        </p>
        <p className="lead">
          <b>For Fpz and A2</b> (electrodes directly placed over skin): Apply a good amount of Ten20 paste into the cup,
          place it on the marked area and fix it with a small cutoff of Hypafix. If you do not have Ten20 paste, just
          use EC2 paste as above.
        </p>
        <p className="lead">
          Please note: A good amount of Ten20 paste means filling the cup until it slightly overflows with paste.
        </p>
        <Row xs="3" className="text-center">
          <Col>
            <img src={`${process.env.PUBLIC_URL}/illustrations/electrodes_ten20.png`} alt="Electrodes in Ten20" />
          </Col>
          <Col>
            <img src={`${process.env.PUBLIC_URL}/illustrations/gauze_ec2.png`} alt="EC2 on gauze" />
          </Col>
          <Col>
            <img src={`${process.env.PUBLIC_URL}/illustrations/gauze_electrodes.png`} alt="Electrodes on gauze" />
          </Col>
        </Row>
      </div>

      <div className="mt-5">
        <h4 className="display-4">Wire the electrodes to the OpenBCI device</h4>
        <p className="lead">Here’s is how you need to wire your electrodes to the OpenBCI board you are using:</p>
        <Table
          headers={['Location', 'Pin on Cyton', 'Pin on Ganglion']}
          elementsRows={[
            ['Fpz', 'P1', '+1'],
            ['Cz', 'N1', '-1'],
            ['Pz', 'P2', '+2'],
            ['Oz', 'N2', '-2'],
            ['A2', 'BIAS (Any pin)', 'D_G (Any pin)'],
          ]}
        />
      </div>
    </Container>
  </section>
);
export default ElectrodesPlacementStepsSection;
