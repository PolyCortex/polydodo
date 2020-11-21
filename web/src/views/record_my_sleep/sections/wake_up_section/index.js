import React from 'react';
import { Container } from 'reactstrap';

const WakeUpSection = () => (
  <section className="section section-sm bg-gradient-warning">
    <Container className="text-justify text-white">
      <h3 className="display-3 text-white">
        <i className="fas fa-coffee mr-2" /> Wake up!
      </h3>
      <div>
        <h4 className="display-4 text-white mt-4">Remove & clean your electrodes</h4>
        <p className="lead">
          In order to take the electrodes off your scalp, you can use warm water for the EC2 to come off easily. The
          Hypafix, used for electrodes over the skin, should be taken off with warm water and/or rubbing alcohol. Prefer
          taking them off slowly, since they can hurt sensible skin if removed too quickly. Don’t forget to clean your
          electrodes. To do this, you can fill a sink with hot water and soap, then use cotton swabs to remove the paste
          from the electrodes. Do not leave the electrodes in hot water for too long, as this may damage them. Dry them.
        </p>
      </div>
      <div>
        <h4 className="display-4 text-white mt-4">Retrieve your recording</h4>
        <p className="lead">
          If you used a microSD card, remove it from the board and insert it in your computer. If you used the session
          file way, after stopping the stream, go to the Recordings directory where should be stored your session file.
        </p>
      </div>
    </Container>
  </section>
);

export default WakeUpSection;
