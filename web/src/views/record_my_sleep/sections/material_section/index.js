import React from 'react';
import { Container } from 'reactstrap';

import AlternatingTextImage from 'components/alternating_text_image/alternating_text_image';

import materialNeeded from './material_needed.json';

const MaterialSection = () => (
  <section className="section bg-secondary">
    <Container className="text-justify pt-md">
      <h3 className="display-3 mb-5">What you will need</h3>
      <p className="lead">If you already own an OpenBCI board, you could have very little (see nothing) to buy.</p>
      <AlternatingTextImage elements={materialNeeded.elements} />
    </Container>
  </section>
);

export default MaterialSection;
