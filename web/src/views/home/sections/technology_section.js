import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

const TechnologySection = () => (
  <section className="section mt-4">
    <Container>
      <h2 className="mt-6">Technology</h2>
      <p className="lead text-justify">
        Our sleep stage classification algorithm is trained on the Physionet Sleep-EDF Extended dataset which provides
        153 nights of polysomnographic recordings. The used machine learning approach achieves a 87% accuracy when
        comparing our algorithm to the scoring of a professional electrophysiologist on a night we recorded using a
        Cyton board. Meanwhile, we observe that the agreement rate between professional manual scorers is 82,6%
        [Rosenberg and Van Hout, 2013]. On the other hand, we can see that state of the art automatic sleep scoring
        algorithms can achieve an accuracy as high as 93% [Fiorillo et al., 2019]. By using brainwaves data, it allows
        us to reach higher precision and accuracy than actigraphy based solutions, usually found in some sleep apps.
      </p>
      <Link to="/performance">
        <span className="lead">Learn more about the performances</span>
      </Link>
      <div className="mt-4">
        <small className="text-muted text-justify">
          <div className="mt-2">
            [Rosenberg and Van Hout, 2013] Richard S. Rosenberg and Steven Van Hout. The American Academy of Sleep
            Medicine Interscorer Reliability Program: Sleep Stage Scoring. Journal of Clinical Sleep Medicine : JCSM :
            Official Publication of the American Academy of Sleep Medicine, 9(1):81–87, January 2013.
          </div>
          <div className="mt-2">
            [Fiorillo et al., 2019] Luigi Fiorillo, Alessandro Puiatti, Michela Papandrea, Pietro-Luca Ratti, Paolo
            Favaro, Corinne Roth, Panagiotis Bargiotas, Claudio L. Bassetti, and Francesca D. Faraci. Automated sleep
            scoring: A review of the latest approaches. Sleep Medicine Reviews, 48:101204, December 2019.
          </div>
        </small>
      </div>
    </Container>
  </section>
);

export default TechnologySection;
