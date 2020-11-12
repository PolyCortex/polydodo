import React from 'react';

import Header from 'components/header';
import IntroductionSection from './sections/introduction_section';
import MaterialSection from './sections/material_section';
import ElectrodesPlacementPositionsSection from './sections/electrodes_placement_positions_section';
import ElectrodesPlacementStepsSection from './sections/electrodes_placement_steps_section';
import TipsAndTricksSection from './sections/tips_and_tricks_section';
import GUIConfigurationSection from './sections/gui_configuration_section';
import JournalSection from './sections/journal_section';
import WakeUpSection from './sections/wake_up_section';
import HowWeDidSection from './sections/how_we_did_section';

import text from './text.json';

const RecordMySleep = () => {
  return (
    <>
      <Header
        sizeClass={'pb-150'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />

      <IntroductionSection />
      <MaterialSection />
      <ElectrodesPlacementPositionsSection />
      <ElectrodesPlacementStepsSection />
      <TipsAndTricksSection />
      <GUIConfigurationSection />
      <JournalSection />
      <WakeUpSection />
      <HowWeDidSection />
    </>
  );
};
export default RecordMySleep;
