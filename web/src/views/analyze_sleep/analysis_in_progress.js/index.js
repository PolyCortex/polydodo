import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { Col, Container, Row, Spinner } from 'reactstrap';

import { analyzeSleep } from 'requests/analyze-sleep';
import useGlobalState from 'hooks/useGlobalState';

const postForm = async (formData, setResponse) => {
  try {
    const response = await analyzeSleep(formData).toPromise();
    setResponse(response);
  } catch (error) {
    console.error(error);
    // TODO: Tell user an error occured
  }
};

const AnalysisInProgress = ({ submittedFormData }) => {
  const [response, setResponse] = useGlobalState('response');
  useEffect(() => {
    postForm(submittedFormData, setResponse);
  }, [setResponse, submittedFormData]);
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
