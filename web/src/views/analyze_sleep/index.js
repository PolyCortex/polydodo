import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Header from 'components/header';
import WaitingForServer from './waiting_for_server';
import UploadForm from './upload_form';
import text from './text.json';
import { periodicPingServer } from 'requests/ping-server';
import { PING_PERIOD } from './constants';
import AnalysisInProgress from './analysis_in_progress.js';
import useGlobalState from 'hooks/useGlobalState';

const AnalyzeSleep = () => {
  const [serverReady, setServerReady] = useState(false);
  const [isFormSubmitted] = useGlobalState('isFormSubmitted');

  useEffect(() => {
    const subscription = periodicPingServer(PING_PERIOD).subscribe(
      (ready) => setServerReady(ready),
      () => null,
    );
    return () => subscription.unsubscribe();
  });

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
