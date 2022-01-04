import React from 'react';
import { Container } from 'reactstrap';

const SummarySection = () => (
  <section className="section section-sm">
    <Container className="my-5 text-justify">
      <div>
        <h3>An Automatic Sleep Stage Classification Tool</h3>
        <p className="lead">
          Polydodo is an automatic sleep stage scoring tool that offers quality sleep analyzes. It differs from other
          free sleep apps in that it uses your brainwaves data which are an essential part of a robust and reliable sleep analysis. And
          the best part is that this project is completly <strong>free and open source</strong>.
        </p>
      </div>
    </Container>
  </section>
);

export default SummarySection;
