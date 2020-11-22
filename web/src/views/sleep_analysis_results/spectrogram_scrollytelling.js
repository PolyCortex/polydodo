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
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              Generally, when talking about brain waves, we group certain frequencies together into bands. There are
              overall five frequency bands, where each has a general associated behaviour, or state of mind. We will
              cover those when looking at time frames corresponding to each sleep stage.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              Let's highlight epochs classified as <span className="scrollytelling_cards__w_text">Wake</span> stages in
              order to better see its characteristics.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['W']} onUp={spectrogramCallbacks[null]} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              We can associate <span className="scrollytelling_cards__w_text">Wake</span> stages with low-amplitude
              activity in the 15 to 60 Hz frequency range, called the beta band [D. Purves et al., 2001]. This means you
              should be able to see, between 15 to 60 Hz, predominantly pink-ish colors. As the beta band is mostly
              located at the front of the scalp, you should better see it in the Fpz-Cz's spectrogram.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              Let's now highlight <span className="scrollytelling_cards__n1_text">N1</span> stages so they stand out
              from the others.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N1']} onUp={spectrogramCallbacks['W']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              By slowly falling asleep, the signal frequencies tend to decrease into the 4 to 8 Hz range, or the theta
              band, and to have larger amplitudes [D. Purves et al., 2001]. You should then see more yellow in the
              specified frequency band range. These characteristics are associated with&nbsp;
              <span className="scrollytelling_cards__n1_text">N1</span>.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              How about <span className="scrollytelling_cards__n2_text">N2</span> sleep stages? Once again, let's
              hightlight epochs tagged as this stage.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N2']} onUp={spectrogramCallbacks['N1']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__n2_text">N2</span> stage has the same characteristics as&nbsp;
              <span className="scrollytelling_cards__n1_text">N1</span>, and also includes sleep spindles. They last
              only a few seconds and are composed of large oscillations in the 10 to 15 hz band. Because they do not
              occur during all of the 30 seconds period, they cannot be seen here [D. Purves et al., 2001].
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              We'll now look at how the epochs tagged as{' '}
              <span className="scrollytelling_cards__n3_text">slow wave sleep</span>
              &nbsp;look like.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['N3']} onUp={spectrogramCallbacks['N2']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              As expected, stage <span className="scrollytelling_cards__n3_text">N3</span> is characterized by slower
              waves between 0.5 and 4 Hz, known as the delta range, with large amplitudes [D. Purves et al., 2001].
              There should then be bright yellow at the lower freqency range. Once again, as the delta band is also
              mostly located at the front of the scalp, you should better see it in the Fpz-Cz's spectrogram.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              The last epochs to look at are the ones tagged as{' '}
              <span className="scrollytelling_cards__rem_text">rapid eye movement</span>. Let's see how can they be
              described.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && <WaypointDirection onDown={spectrogramCallbacks['REM']} onUp={spectrogramCallbacks['N3']} />}
      <div style={{ marginBottom: '125%' }} />
      <Row className="mx-auto col-md-6">
        <Card className="shadow">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__rem_text">REM</span> stage has the same characteristics as&nbsp;
              <span className="scrollytelling_cards__w_text">Wake</span> stage, whereas there are low voltage high
              frequency activity [D. Purves et al., 2001]. This means you should once again be able to see, between 15
              to 60 Hz, pink-ish colors.
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
