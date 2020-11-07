import React from 'react';

import Hero from './hero/hero';
import TabsSection from './sections/tabs_section';
import ProcessSection from './sections/process_section';
import TechnologySection from './sections/technology_section';
import TeamSection from './sections/team_section';
import HardwareSection from './sections/hardware_section';
import SummarySection from './sections/summary_section';

const Home = () => {
  return (
    <div>
      <Hero />
      <SummarySection />
      <ProcessSection />
      <HardwareSection />
      <TabsSection />
      <TechnologySection />
      <TeamSection />
    </div>
  );
};

export default Home;
