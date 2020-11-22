import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Card, CardBody, Row } from 'reactstrap';

import createSpectrogram, { spectrogramCallbacks } from '../../d3/spectrogram/spectrogram';
import D3ComponentScrollyTelling from '../../components/d3component_scrollytelling';
import WaypointDirection from '../../components/waypoint_direction';

const SpectrogramScrollyTelling = ({ spectrograms, epochs }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <Container className="text-justify">
      <div style={{ position: 'sticky', top: '10%' }}>
        <D3ComponentScrollyTelling
          callback={createSpectrogram}
          data={{ ...spectrograms, epochs }}
          isInitialized={isInitialized}
          setIsInitialized={setIsInitialized}
          useDiv
        />
      </div>
      <div style={{ marginBottom: '50%' }} />
      <Row className="shadow mx-auto col-md-6">
        <Card>
          <CardBody>
            <p>
              Generally, when talking about brain waves, we group certain frequencies together into bands. There are
              overall five frequency bands, where each has a general associated behaviour, or state of mind. We will
              cover those when looking at time frames corresponding to each sleep stage.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['W']} onUp={spectrogramCallbacks[null]} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="shadow mx-auto col-md-6">
        <Card>
          <CardBody>
            <p>
              We can associate wake stages with low-amplitude activity in the 15 to 60 Hz frequency range, called the
              beta band. [6]
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N1']} onUp={spectrogramCallbacks['W']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="shadow mx-auto col-md-6">
        <Card>
          <CardBody>
            <p>
              By slowly falling asleep, the signal frequencies tend to decrease into the 4 to 8 Hz range, or the theta
              band, and to have larger amplitudes. These characteristics are associated with N1.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N2']} onUp={spectrogramCallbacks['N1']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="shadow mx-auto col-md-6">
        <Card>
          <CardBody>
            <p>
              N2 stage has the same characteristics as N1, and also includes sleep spindles. They last only a few
              seconds and are a large oscillation in the 10 to 15 hz band. Because they do not occur during all of the
              30 seconds period, they cannot be seen here. [6]
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N3']} onUp={spectrogramCallbacks['N2']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="shadow mx-auto col-md-6">
        <Card>
          <CardBody>
            <p>
              Stage N3, also called slow wave sleep, is characterized by slower waves between 0.5 and 4 Hz, known as the
              delta range, with large amplitudes. [6]
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['REM']} onUp={spectrogramCallbacks['N3']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="shadow mx-auto col-md-6">
        <Card>
          <CardBody>
            <p>
              REM stage has the same characteristics as Wake stage, whereas there are low voltage high frequency
              activity. [6]
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '70%' }} />
      &nbsp;
    </Container>
  );
};

SpectrogramScrollyTelling.propTypes = {
  spectrograms: PropTypes.object.isRequired,
  epochs: PropTypes.object.isRequired,
};

export default SpectrogramScrollyTelling;
