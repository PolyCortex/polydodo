import React from 'react';
import { Container } from 'reactstrap';

import ElectrodesDisplay from './electrodes_display';

const ElectrodesPlacementPositionsSection = () => (
  <section className="section section-lg">
    <Container className="text-justify pt-lg">
      <h3 className="display-3">Where to place the electrodes</h3>
      <p className="lead">
        You may want to ask a friend for some help. It will be easier to locate the site where to place your electrodes
        and to place them with the help of someone else.
      </p>
      <p className="lead">
        First, you need to know where to place the electrodes. Our channels are Fpz-Cz and Pz-Oz to which we add a
        driven ground electrode placed at A2 (on your right ear lobe).
      </p>
      sadsa
      <ElectrodesDisplay />
    </Container>
  </section>
);

export default ElectrodesPlacementPositionsSection;
