import React from 'react';
import { Container } from 'reactstrap';

const MotivationSection = () => (
  <section className="section mt-4">
    <Container>
      <h2 className="mt-3">Why Would I Analyze My Sleep?</h2>
      <p className="lead text-justify">
        Although we spend a major part of our time sleeping, we cannot truly understand what happens during this time,
        as sleep is inherently an altered state of consciousness. With Polydodo, we are able to offer an accessible way
        to answer, for each moment of the night, how was my sleep.
      </p>
      <p className="lead text-justify">
        We do so by offering you a picture of your sleep based on the five standard sleep stages defined by the American
        Academy of Sleep Medicine (AASM) Manual for the Scoring of Sleep and Associated Events. These sleep stages are
        Wake, Rapid-Eye Movement (REM), and the three non-REM stages, which goes from the lightest, N1, to the deepest,
        N3. Polydodo scores every 30 seconds epochs of your night into these five stages.
      </p>
      <p className="lead text-justify">
        By studying your own sleep, you may be able to discover how your daily habits may affect your sleep
        architecture. For each night that you will use Polydodo, it will generate a sleep report that will tell you
        metrics such as:
      </p>
      <ul>
        <li className="py-1">
          <h5>time spent in each sleep stage;</h5>
        </li>
        <li className="py-1">
          <h5>time spent awake after sleep onset (WASO);</h5>
        </li>
        <li className="py-1">
          <h5>sleep latency (time it took to fall asleep);</h5>
        </li>
        <li className="py-1">
          <h5>sleep efficiency;</h5>
        </li>
        <li className="py-1">
          <h5>and much more!</h5>
        </li>
      </ul>
      <p className="lead text-justify">
        If you think you may suffer of a sleep disorder or you have hard times falling asleep, you may consider to seek
        to advice of a physician. Polydodo <strong>is not</strong> an autodiagnostic tool.
      </p>
    </Container>
  </section>
);

export default MotivationSection;
