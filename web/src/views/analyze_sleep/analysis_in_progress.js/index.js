import React from 'react';
import { Redirect } from 'react-router';
import { Col, Container, Row, Spinner } from 'reactstrap';

import useGlobalState from 'hooks/useGlobalState';

const AnalysisInProgress = () => {
  const [response] = useGlobalState('response');

  if (!response) {
    return (
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
  }

  return (
    <Redirect
      to={{
        pathname: '/sleep-analysis-results',
      }}
    />
  );
};

export default AnalysisInProgress;
