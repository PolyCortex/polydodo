import React from 'react';
import { Container } from 'reactstrap';

import BadgeBulletPoint from 'components/badge_bullet_point';

const JournalSection = () => (
  <section className="section section-md">
    <Container className="text-justify">
      <h3 className="display-3">
        <i class="fas fa-pencil-alt" /> Write a journal
      </h3>
      <p className="lead">
        You must keep a journal (accurate to the minute) and write down a few information to help us track and analyze
        your sleep:
      </p>
      <ul className="list-unstyled mt-4 ml-3">
        <li className="py-2">
          <BadgeBulletPoint badgeColor="warning" iconClass="far fa-clock">
            <span className="lead">When you start the stream</span>
          </BadgeBulletPoint>
        </li>
        <li className="py-2">
          <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-bed">
            <span className="lead">When you go to bed</span>
          </BadgeBulletPoint>
        </li>
        <li className="py-2">
          <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-sun">
            <span className="lead">When you wake up</span>
          </BadgeBulletPoint>
        </li>
      </ul>
      <p className="lead">You will need to provide this information in order to score your EEG recording.</p>
    </Container>
  </section>
);

export default JournalSection;
