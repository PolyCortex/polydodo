import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import OpenBCIBoards from 'assets/img/items/boards.png';
import BadgeBulletPoint from 'components/badge_bullet_point';

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
              <li className="py-2">
                <BadgeBulletPoint badgeColor="success" iconClass="fas fa-check">
                  <h6 className="mb-0">Reliable</h6>
                </BadgeBulletPoint>
              </li>
              <li className="py-2">
                <BadgeBulletPoint badgeColor="success" iconClass="fas fa-dollar-sign">
                  <h6 className="mb-0">Cheap and accessible</h6>
                </BadgeBulletPoint>
              </li>

              <li className="py-2">
                <BadgeBulletPoint badgeColor="success" iconClass="fas fa-unlock">
                  <h6 className="mb-0">Open source hardware</h6>
                </BadgeBulletPoint>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default HardwareSection;
