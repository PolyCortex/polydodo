import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Header from 'components/header';
import WaitingForServer from './waiting_for_server';
import UploadForm from './upload_form';
import text from './text.json';
import { periodicPingServer } from 'requests/ping-server';
import { PING_PERIOD } from './constants';
import AnalysisInProgress from './analysis_in_progress.js';

const AnalyzeSleep = () => {
  const [serverReady, setServerReady] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState(null);

  useEffect(() => {
    const subscription = periodicPingServer(PING_PERIOD).subscribe(
      (ready) => setServerReady(ready),
      () => null,
    );
    return () => subscription.unsubscribe();
  });

  let child;
  if (!serverReady) {
    child = <WaitingForServer />;
  } else if (!submittedFormData) {
    child = <UploadForm setSubmittedFormData={setSubmittedFormData} />;
  } else {
    child = <AnalysisInProgress submittedFormData={submittedFormData} />;
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
      <Container className="mt-5 text-justify">{child}</Container>
    </div>
  );
};

export default AnalyzeSleep;
