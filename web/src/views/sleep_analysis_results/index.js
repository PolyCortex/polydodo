import React from 'react';
import { Container, Row, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import Header from 'components/header';
import D3Component from 'components/d3component';
import WIPWarning from 'components/wip_warning';

import { createSingleHypnogram } from 'd3/hypnogram/hypnogram';

import text from './text.json';
import StackedBarChartScrollyTelling from './stacked_bar_chart_scrollytelling';
import SpectrogramScrollyTelling from './spectrogram_scrollytelling';
import { useCSVData } from 'hooks/api_hooks';

import hypnogramDataSleepEDFPath from 'assets/data/hypnogram-openbci-predicted.csv';

const SleepAnalysisResults = ({ location }) => {
  console.log('data:', location);
  const csvDataSleepEDF = useCSVData(hypnogramDataSleepEDFPath);

  return (
    <div>
      <Header
        sizeClass={'pb-150'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      <Container className="mt-5 mb-5 text-justify">
        <Row className="mb-5 justify-content-center">
          <WIPWarning />
        </Row>
        <p>
          Of course, we are analyzing only one night of sleep so it is therefore tricky to draw general conclusions
          about your sleep. It is however fascinating to see how your night was.
        </p>
        <p>Without further ado, this is what was your night of sleep:</p>
        <StackedBarChartScrollyTelling />
        <p>
          We have seen that sleep can be decomposed in mainly two stages, whereas REM and NREM, and that we can observe
          different stage proportions across age, gender and different sleep disorders. We’ve also defined other
          measures of your sleep architecture, such as your sleep latency, efficiency and total sleep time. In order to
          improve your sleep hygiene, many elements can be considered:
        </p>
        <ul>
          <li>
            Alimentation: having a balanced diet and avoiding sources of caffeine can have a positive impact on one’s
            sleep. Chocolate, soft drink, tea and decaffeinated coffee are unexpected sources of caffeine.
          </li>
          <li>Routine: going to sleep about at the same time, in a darkened and quiet environment.</li>
          <li>Routine: going to sleep about at the same time, in a darkened and quiet environment.</li>
          <li>Routine: going to sleep about at the same time, in a darkened and quiet environment.</li>
        </ul>
        <p>
          Although we’ve looked at many aspects of your night’s sleep, we haven’t properly looked at your sleep
          dynamics, whereas how your sleep evolves overnight.
        </p>
        <h4>Hypnogram</h4>
        <p>
          A hypnogram allows you to visually inspect the evolution of your night, through time. The vertical axis
          represents how hard it is to wake up, namely the sleep deepness. We see that REM is one of the lightest sleep
          stages (along with N1), because we unknowingly wake up from that stage. Those short periods of arousal often
          last no longer than 15 seconds, are followed by a lighter sleep stage, and cannot be remembered the next
          morning. If they are too frequent, they can affect your sleep quality. [5] We can see that, throughout the
          night, stages follow about the same pattern, whereas we go from NREM (either N1, N2 and N3) and then to REM,
          and so on. We call those sleep cycles, and those typically range from four to six, each one lasting from 90 to
          110 minutes. Another commonly looked at measurement is the time between sleep onset and the first REM epoch,
          namely REM latency, which corresponds to 20 minutes.
        </p>
        <D3Component callback={createSingleHypnogram} data={csvDataSleepEDF ? [csvDataSleepEDF] : null} />
        <p>
          Sleep cycles take place in a broader process, named the circadian rhythm. It is the one that regulates our
          wake and sleep cycles over a 24 hours period.
        </p>
        <p>
          You’ve been able to visualize and inspect your night of sleep, which we’ve classified only based on your EEG
          recordings. In a sleep lab, electrophysiology technicians generally look at your EEG, EOG and submental EMG,
          and then manually classify each epoch of 30 seconds that compose your night. By looking at your EEG
          recordings, we can see some patterns that can help electrophysiology technicians, and our classifier,
          discriminate sleep stages throughout the night.
        </p>
        <h4 className="mt-5">Spectrogram</h4>
        <p>
          Above, we can see the same chart from the first visualization, which represents your sleep stages through the
          night. Below it, there are spectrograms of both your EEG channels. Spectrograms can be viewed as if we took
          all of your nights signal, we’ve separated it in contiguous 30 seconds chunks, stacked then horizontally and
          to which we’ve applied the fast fourier transform. We then have, for each 30 seconds epoch, the corresponding
          amplitudes for each frequency that makes up the signal, hence the spectra. We then converted the scale to
          logarithmic, to better see the differences in the spectrums. We then speak of signal power instead of signal
          amplitude, because we look at the spectrums in a logarithmic scale.
        </p>
        <p>
          <strong>How to read it?</strong>
        </p>
        <p>
          Red therefore means that in that 30 seconds time frame, that particular frequency had a big amplitude. Green
          means that you had that frequency with a lower amplitude. Dark blue means that you didn’t have that frequency
          in the signal.
        </p>
        <p>
          To get a better understanding at how spectrograms work, you can check out
          <a href="https://musiclab.chromeexperiments.com/Spectrogram/" target="_blank" rel="noopener noreferrer">
            {' '}
            this visualization{' '}
          </a>
          that decomposes sound frequency from your microphone.
        </p>
        <SpectrogramScrollyTelling />
        <p className="mt-5">
          Generally, when talking about brain waves, we group certain frequencies together into bands. There are overall
          five frequency bands, where each has a general associated behaviour, or state of mind. We will cover those
          when looking at time frames corresponding to each sleep stage.
        </p>
        <p>
          We can associate wake stages with low-amplitude activity in the 15 to 60 Hz frequency range, called the beta
          band. By slowly falling asleep, the signal frequencies tend to decrease into the 4 to 8 Hz range, or the theta
          band, and to have larger amplitudes. These characteristics are associated with N1. N2 stage has the same
          characteristics, and also includes sleep spindles. They last only a few seconds and are a large oscillation in
          the 10 to 15 hz band. Because they do not occur during all of the 30 seconds period, they cannot be seen here.
          Stage N3, also called slow wave sleep, is characterized by slower waves between 0.5 and 4 Hz, known as the
          delta range, with large amplitudes. REM stage has the same characteristics as Wake stage, whereas there are
          low voltage high frequency activity.
        </p>
        <p>Wanna know how accurate this data is?</p>
        <Button color="default" to="/performance" tag={Link}>
          Check out the performances
        </Button>
      </Container>
    </div>
  );
};

export default SleepAnalysisResults;
