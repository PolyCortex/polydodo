import React from 'react';
import { Container, Row } from 'reactstrap';

import Emoji from 'components/emoji';

const WakeUpSection = () => (
  <section className="section bg-gradient-warning">
    <Container className="mt-5 mb-5 text-justify text-white">
      <h3 className="display-3 text-white">
        <Row>
          <Emoji className="mr-3" symbol="☕" /> Wake up!
        </Row>
      </h3>
      <div>
        <h4 className="display-4 text-white">Remove your electrodes</h4>
        <p className="lead">
          In order to take the electrodes off your scalp, you can use warm water for the EC2 to come off easily. The
          Hypafix, used for electrodes over the skin, should be taken off with warm water and/or rubbing alcohol. Prefer
          taking them off slowly, since they can hurt sensible skin if removed too quickly. Don’t forget to clean your
          electrodes using warm water and soap.
        </p>
      </div>
      <div>
        <h4 className="display-4 text-white">If you used an microSD card:</h4>
        <p className="lead">
          Remove the microSD card from the board and insert it in your computer. Then, open OpenBCI GUI and select{' '}
          <b>PLAYBACK (from file)</b> as your data source. Use the <b>Convert SD for playback option</b> and select your
          sd file. Wait a little bit and you will get the converted csv file. Upload this one to this website in order
          to score your sleep
        </p>
      </div>
      <div>
        <h4 className="display-4 text-white">If you used session file:</h4>
        <p className="lead">
          After stopping the stream, go to the Recordings directory where your session file. Just upload this file in
          order to score your sleep and analyze your data.
        </p>
      </div>
    </Container>
  </section>
);

export default WakeUpSection;
