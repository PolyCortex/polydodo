import React from 'react';
import { Container } from 'reactstrap';

const MotivationSection = () => (
  <section className="section mt-4">
    <Container>
      <h2 className="mt-3">Why Would I Analyze My Sleep?</h2>
      <p className="lead text-justify">
        Although we spend a major part of our day sleeping, we cannot truly understand what happens during this time, as
        sleep is inherently an altered state of consciousness. With Polydodo we offer an accessible way to answer the
        question "How was my sleep?".
      </p>
      <p className="text-justify">
        We do so by offering you a picture of your sleep based on the five standard sleep stages defined by the American
        Academy of Sleep Medicine's (AASM) Manual for the Scoring of Sleep and Associated Events. These sleep stages are
        Wake, Rapid-Eye Movement (REM), and the three non-REM stages, which goes from the lightest, N1, to the deepest,
        N3. Polydodo scores every 30 seconds of your night into these five stages.
      </p>
      <p className="text-justify">
        By studying your own sleep, you may discover how your daily habits affect your sleep architecture. At the end of
        each night, Polydodo will generate a sleep report that includes metrics such as:
      </p>
      <ul>
        <li>
          <h6>Time spent in each sleep stage</h6>
        </li>
        <li>
          <h6>Time spent awake after sleep onset (WASO)</h6>
        </li>
        <li>
          <h6>Sleep latency (time it took to fall asleep)</h6>
        </li>
        <li>
          <h6>Sleep efficiency</h6>
        </li>
        <li>
          <h6>And much more!</h6>
        </li>
      </ul>
      <p className="text-justify">
        If you think you suffer from a sleep disorder or you have a hard time falling asleep, you may consider seeking
        the advice of a professional. Polydodo <strong>is not</strong> an autodiagnostic tool.
      </p>
    </Container>
  </section>
);

export default MotivationSection;
