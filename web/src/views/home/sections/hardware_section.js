import React from 'react';
import { Badge, Col, Container, Row } from 'reactstrap';

import OpenBCIBoards from 'assets/img/items/boards.png';

const PerkItem = ({ iconClass, children }) => (
  <li className="py-2">
    <div className="d-flex align-items-center">
      <div>
        <Badge className="badge-circle mr-3" color="success">
          <i className={`fa ${iconClass}`} />
        </Badge>
      </div>
      <div>
        <h6 className="mb-0">{children}</h6>
      </div>
    </div>
  </li>
);

const HardwareSection = () => (
  <section className="section section-lg">
    <Container>
      <Row className="row-grid align-items-center">
        <Col className="order-md-1" md="4">
          <Row className="align-items-center justify-content-center">
            <img alt="Cyton and Ganglion" className="img-fluid pr-5" src={OpenBCIBoards} />
          </Row>
        </Col>
        <Col className="order-md-2" md="8">
          <div className="pr-md-5">
            <h2>Acquisition System</h2>
            <p className="lead text-justify">
              Polydodo is compatible with OpenBCI biosignals acquisition hardware. It supports both Cyton and Ganglion
              boards. They rock!
            </p>
            <a target="_blank" rel="noopener noreferrer" href="https://shop.openbci.com/collections/frontpage">
              Buy an OpenBCI board
            </a>
            <ul className="list-unstyled mt-4">
              <PerkItem iconClass="fa-check">Reliable</PerkItem>
              <PerkItem iconClass="fa-usd">Cheap and Accessible</PerkItem>
              <PerkItem iconClass="fa-unlock">Open source hardware</PerkItem>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default HardwareSection;
