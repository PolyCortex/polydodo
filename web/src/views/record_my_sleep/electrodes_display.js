import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

import Tabs from 'components/tabs';

import './electrodes_display.css';

const ElectrodesDisplay = () => {
  const [selectedElectrode, setSelectedElectrode] = useState('fpz');

  return (
    <Row>
      <Col xs="8">
        <Tabs
          onSelectTab={setSelectedElectrode}
          elements={[
            {
              id: 'fpz',
              title: 'Fpz',
              content: `
                  Fpz is used as one of our active electrodes. To identify the Fpz location, just measure the distance
                  starting from your nasion (the easily identifiable depressed area between your eyes) to your inion
                  using your flexible measuring tape. Fpz is located at 10 % of the distance along the midline between
                  your nasion and your inion.`,
            },
            {
              id: 'cz',
              title: 'Cz',
              content: `
                  We’re measuring a potential difference between Fpz and that point. Cz is located at 50% of the
                  distance along the midline starting from your nasion to your inion.`,
            },
            {
              id: 'pz',
              title: 'Pz',
              content: `
                This is our other active electrode. It is located at 70% of the distance between your nasion and your
                inion.`,
            },
            {
              id: 'oz',
              title: 'Oz',
              content: `
                This is the point at which Pz is referenced. It is located at 90% of the distance between your nasion
                and your inion.`,
            },
            {
              id: 'a2',
              title: 'A2',
              content: `
              This is the electrode that serves as driven ground between your and your OpenBCI board. Simply place it on
              your right earlobe.`,
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
