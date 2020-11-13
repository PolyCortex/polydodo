import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

import Tabs from 'components/tabs';

import './style.css';

const ElectrodesDisplay = ({ className }) => {
  const [selectedElectrode, setSelectedElectrode] = useState('fpz');

  return (
    <Row className={className}>
      <Col xs="8">
        <Tabs
          onSelectTab={setSelectedElectrode}
          elements={[
            {
              id: 'fpz',
              title: 'Fpz',
              content:
                'Fpz is used as the active electrode of the Fpz-Cz channel. Fpz is located at 10% of the distance between your nasion and your inion along the midline.',
            },
            {
              id: 'cz',
              title: 'Cz',
              content:
                'Cz is used as the reference electrode in the Fpz-Cz channel (we’re measuring a potential difference between Fpz and that point). It is located at 50% of the distance between your nasion and your inion along the midline.',
            },
            {
              id: 'pz',
              title: 'Pz',
              content:
                'Pz is used as the active electrode of the Pz-Oz channel. Pz is located at 70% of the distance between your nasion and your inion along the midline.',
            },
            {
              id: 'oz',
              title: 'Oz',
              content:
                'Oz is used as the reference electrode in the Pz-Oz channel. This is the point at which Pz is referenced. It is located at 90% of the distance between your nasion and your inion along the midline.',
            },
            {
              id: 'a2',
              title: 'A2',
              content:
                'This is the electrode that serves as driven ground between you and your OpenBCI board. It prevents noise sources to interfer with the EEG signal. Simply place it on your right earlobe.',
            },
          ]}
        />
      </Col>
      <Col xs="4">
        <div className="imgs-container">
          <div className="img-container">
            <img src={`${process.env.PUBLIC_URL}/illustrations/top.png`} alt="top" />
            <span className={`top dot dot-select dot-${selectedElectrode}`}></span>
          </div>
          <div className="img-container">
            <img src={`${process.env.PUBLIC_URL}/illustrations/side.png`} alt="side" />
            <span className={`side dot dot-select dot-${selectedElectrode}`}></span>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ElectrodesDisplay;
