import React from 'react';
import { Container } from 'reactstrap';

import Hero from './hero/hero';
import TabsSection from './sections/tabs_section';
import FeaturesSection from './sections/features_section';
import TechnologySection from './sections/technology_section';
import TeamSection from './sections/team_section';

const Home = () => {
  return (
    <div>
      <Hero />
      <Container className="mt-5 mb-5 text-justify">
        <div className="mt-6">
          <p className="lead">
            Polydodo improves the quality of the automatic analyzes of sleep usually done by sleep apps. To do so, we
            are using your EEG data which is an essential part of a reasonable sleep analysis. And the best part of it
            is that it's completly <strong>free!</strong>
          </p>
        </div>
      </Container>
      <FeaturesSection />
      <TabsSection />
      <TechnologySection />
      <TeamSection />
    </div>
  );
};

export default Home;
