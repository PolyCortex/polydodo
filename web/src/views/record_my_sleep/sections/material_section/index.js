import React from 'react';
import { Container } from 'reactstrap';

import AlternatingTextImage from 'components/alternating_text_image/alternating_text_image';

import materialNeeded from './material_needed.json';

const MaterialSection = () => (
  <section className="section section-lg bg-secondary">
    <Container className="text-justify pt-md">
      <h3 className="display-3 mb-5">What you will need</h3>
      <p className="lead">
        If you already own an OpenBCI board and some basic EEG equipment, you could have very little to buy except a few
        things from the drugstore. Some of the brands that we mention have their equivalent and can be replaced. We do
        not advertise the mentionned products, but we have used them and found them useful and of good quality.
      </p>
      <AlternatingTextImage elements={materialNeeded.elements} />
    </Container>
  </section>
);

export default MaterialSection;
