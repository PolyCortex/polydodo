import React from 'react';
import { Redirect } from 'react-router';
import { Col, Container, Row, Spinner } from 'reactstrap';

import useGlobalState from 'hooks/useGlobalState';

const AnalysisInProgress = () => (
  <Container>
    <h3 className="mb-4">Analyzing your sleep...</h3>
    <p>Your sleep is currently being analyzed</p>
    <Row>
      <Col className="text-center mb-4">
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      </Col>
    </Row>
  </Container>
);

export default AnalysisInProgress;
