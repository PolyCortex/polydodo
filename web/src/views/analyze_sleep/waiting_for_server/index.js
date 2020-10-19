import React from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';

const WaitingForServer = () => (
  <Container>
    <h3 className="mb-4">Waiting for local server to be running...</h3>
    <Row>
      <Col className="text-center mb-4">
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      </Col>
    </Row>
  </Container>
);

export default WaitingForServer;
