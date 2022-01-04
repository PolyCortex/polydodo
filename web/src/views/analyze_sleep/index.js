import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { Navigate } from 'react-router-dom';

import Header from 'components/header';
import useGlobalState from 'hooks/useGlobalState';
import { periodicPingServer } from 'requests/ping_server';
import WaitingForServer from './waiting_for_server';
import UploadForm from './upload_form';
import { PING_PERIOD } from './constants';
import AnalysisInProgress from './analysis_in_progress';

import text from './text.json';

const AnalyzeSleep = () => {
  const [serverReady, setServerReady] = useState(false);
  const [isFormSubmitted] = useGlobalState('isFormSubmitted');
  const [response] = useGlobalState('response');

  useEffect(() => {
    const subscription = periodicPingServer(PING_PERIOD).subscribe(
      (ready) => setServerReady(ready),
      () => null,
    );
    return () => subscription.unsubscribe();
  });

  if (response) {
    return <Navigate to="/sleep-analysis-results" replace />;
  }

  return (
    <div>
      <Header
        sizeClass={'pb-100'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      <Container className="mt-5 text-justify">
        <span hidden={serverReady}>
          <WaitingForServer />
        </span>
        <span hidden={!serverReady || isFormSubmitted}>
          <UploadForm />
        </span>
        <span hidden={!serverReady || !isFormSubmitted}>
          <AnalysisInProgress />
        </span>
      </Container>
    </div>
  );
};

export default AnalyzeSleep;
