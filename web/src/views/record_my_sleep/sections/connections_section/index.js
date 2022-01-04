import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import Table from 'components/table';

import './style.css';

const ConnectionsSection = () => (
  <section className="section section-md">
    <Container className="text-justify">
      <div className="mt-5">
        <h3 className="display-3">Connect the electrodes</h3>
        <p className="lead">Here is how you need to connect your electrodes to the OpenBCI board you are using:</p>
        <Row>
          <Col md="6">
            <img
              className="connections_section__connections_img w-100"
              src={`${process.env.PUBLIC_URL}/img/cyton_connections.png`}
              alt=""
            />
          </Col>
          <Col md="6">
            <img
              className="connections_section__connections_img w-100"
              src={`${process.env.PUBLIC_URL}/img/ganglion_connections.png`}
              alt=""
            />
          </Col>
        </Row>
        <h4 className="display-4 my-3">Connections table for each electrode</h4>
        <Table
          headers={['Location', 'Pin on Cyton', 'Pin on Ganglion']}
          elementsrows={[
            ['Fpz', 'P1', '+1'],
            ['Cz', 'N1', '-1'],
            ['Pz', 'P2', '+2'],
            ['Oz', 'N2', '-2'],
            ['A2', 'BIAS (Any pin)', 'D_G (Any pin)'],
          ]}
        />
        <p className="lead mt-5">
          The header pins of the electrodes can be disconnected rather easily. Make sure that no pressure is exerted on
          the wires at any time. For our part, we decided to tape the wire to the container, in order to avoid such a
          scenario. It is now time to power your OpenBCI device. We recommend fully charged batteries, since the device
          will be powered on for several hours.
        </p>
      </div>
    </Container>
  </section>
);

export default ConnectionsSection;
