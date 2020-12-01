import React from 'react';
import { Container } from 'reactstrap';

import BadgeBulletPoint from 'components/badge_bullet_point';

const JournalSection = () => (
  <section className="section section-md">
    <Container className="text-justify">
      <h3 className="display-3">
        <i className="fas fa-pencil-alt mr-2" /> Write a journal
      </h3>
      <p className="lead">
        During the night, you must keep a journal, accurate to the minute, and write down a few information to help us
        track and analyze your sleep:
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
            <span className="lead">When you get out of bed</span>
          </BadgeBulletPoint>
        </li>
      </ul>
      <p className="lead">This information must be given when filling out the upload form for your EEG data file.</p>
      <h4 className="mt-5">
        <i className="fas fa-moon mr-2" />
        Good night!
      </h4>
    </Container>
  </section>
);

export default JournalSection;
