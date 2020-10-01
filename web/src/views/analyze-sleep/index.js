import React from 'react';
import { Container } from 'reactstrap';

import Header from 'components/header';
import WaitingForServerToBeReady from './waiting-for-server-to-be-ready';
import UploadForm from './upload-form';

import text from './text.json';

const isServerReady = true;

const AnalyzeSleep = () => {
  return (
    <div>
      <Header
        sizeClass={'pb-100'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      <Container className="mt-5 text-justify">{isServerReady ? <UploadForm /> : <WaitingForServerToBeReady />}</Container>
    </div>
  );
};

export default AnalyzeSleep;
