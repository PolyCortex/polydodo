import React, { useState } from 'react';
import { Container, Card, CardBody } from 'reactstrap';

import createSpectrogram, { spectrogramCallbacks } from '../../d3/spectrogram/spectrogram';
import D3ComponentScrollyTelling from '../../components/d3component_scrollytelling';
import WaypointDirection from '../../components/waypoint_direction';

const SpectrogramScrollyTelling = ({ spectrograms, epochs }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <Container>
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
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            Here is represented spectrograms of both your EEG channels. Spectrograms can be viewed as if we took all of
            your nights signal, we’ve separated it in contiguous 30 seconds chunks, stacked then horizontally and to
            which we’ve applied the fast fourier transform. We then have, for each 30 seconds epoch, the corresponding
            amplitudes for each frequency that makes up the signal, hence the spectra.
          </p>
          <p>
            We then converted the scale to logarithmic, to better see the differences in the spectrums. We then speak of
            signal power instead of signal amplitude, because we look at the spectrums in a logarithmic scale.
          </p>
          <h5>How to read it?</h5>
          <p>
            Red therefore means that in that 30 seconds time frame, that particular frequency had a big amplitude. Green
            means that you had that frequency with a lower amplitude. Dark blue means that you didn’t have that
            frequency in the signal.
          </p>
          <p>
            To get a better understanding at how spectrograms work, you can{' '}
            <a href="https://musiclab.chromeexperiments.com/Spectrogram/" rel="noopener noreferrer" target="_blank">
              check out this example
            </a>{' '}
            that decomposes sound frequency from your microphone.
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            Generally, when talking about brain waves, we group certain frequencies together into bands. There are
            overall five frequency bands, where each has a general associated behaviour, or state of mind. We will cover
            those when looking at time frames corresponding to each sleep stage.
          </p>
        </CardBody>
      </Card>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['W']} onUp={spectrogramCallbacks[null]} />}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            We can associate wake stages with low-amplitude activity in the 15 to 60 Hz frequency range, called the beta
            band. [6]
          </p>
        </CardBody>
      </Card>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N1']} onUp={spectrogramCallbacks['W']} />}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            By slowly falling asleep, the signal frequencies tend to decrease into the 4 to 8 Hz range, or the theta
            band, and to have larger amplitudes. These characteristics are associated with N1.
          </p>
        </CardBody>
      </Card>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N2']} onUp={spectrogramCallbacks['N1']} />}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            N2 stage has the same characteristics as N1, and also includes sleep spindles. They last only a few seconds
            and are a large oscillation in the 10 to 15 hz band. Because they do not occur during all of the 30 seconds
            period, they cannot be seen here. [6]
          </p>
        </CardBody>
      </Card>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N3']} onUp={spectrogramCallbacks['N2']} />}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            Stage N3, also called slow wave sleep, is characterized by slower waves between 0.5 and 4 Hz, known as the
            delta range, with large amplitudes. [6]
          </p>
        </CardBody>
      </Card>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['REM']} onUp={spectrogramCallbacks['N3']} />}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            REM stage has the same characteristics as Wake stage, whereas there are low voltage high frequency activity.
            [6]
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      &nbsp;
    </Container>
  );
};

export default SpectrogramScrollyTelling;
