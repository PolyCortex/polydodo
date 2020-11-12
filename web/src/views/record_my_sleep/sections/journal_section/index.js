import React from 'react';
import { Badge, Container } from 'reactstrap';

const JournalSection = () => (
  <section className="section bg-secondary">
    <Container className="text-justify pt-lg">
      <h3 className="display-3">Write a journal</h3>
      <p className="lead">
        You must keep a journal (accurate to the minute) and write down a few information to help us track and analyze
        your sleep:
      </p>
      <p className="lead">
        <Badge className="badge-circle mr-3" color="success">
          <i className="far fa-clock" />
        </Badge>
        When you start the stream
      </p>
      <p className="lead">
        <Badge className="badge-circle mr-3" color="success">
          <i className="fas fa-bed" />
        </Badge>
        When you go to bed
      </p>
      <p className="lead">
        <Badge className="badge-circle mr-3" color="success">
          <i className="fas fa-sun" />
        </Badge>
        When you wake up
      </p>
      <p className="lead">You will need to provide this information in order to score your EEG recording.</p>
    </Container>
  </section>
);

export default JournalSection;
