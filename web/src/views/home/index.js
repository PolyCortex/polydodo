import React from 'react';

import Hero from './hero/hero';
import TabsSection from './sections/tabs_section';
import ProcessSection from './sections/process_section';
import TechnologySection from './sections/technology_section';
import TeamSection from './sections/team_section';
import HardwareSection from './sections/hardware_section';
import SummarySection from './sections/summary_section';
import MotivationSection from './sections/motivation_section';
import CallToActionSection from './sections/call_to_action_section';

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
      <MotivationSection />
      <CallToActionSection />
    </div>
  );
};

export default Home;
