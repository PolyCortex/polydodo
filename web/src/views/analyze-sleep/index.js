import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Header from 'components/header';
import WaitingForServerToBeReady from './waiting-for-server-to-be-ready';
import UploadForm from './upload-form';
import text from './text.json';
import { periodicPingServer } from 'requests/ping-server';
import { PING_PERIOD } from './constants';

const AnalyzeSleep = () => {
  const [serverReady, setServerReady] = useState(false);

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
        <span hidden={!serverReady}>
          <UploadForm />
        </span>
        <span hidden={serverReady}>
          <WaitingForServerToBeReady />
        </span>
      </Container>
    </div>
  );
};

export default AnalyzeSleep;
