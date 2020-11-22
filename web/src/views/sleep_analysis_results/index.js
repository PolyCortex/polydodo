import React from 'react';
import { Container, Row, Button, UncontrolledTooltip } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';

import Header from 'components/header';
import D3Component from 'components/d3component';
import PreviewModeWarning from './preview_mode_warning';

import { createSingleHypnogram } from 'd3/hypnogram/hypnogram';

import useGlobalState from 'hooks/useGlobalState';
import text from './text.json';
import EvolvingChartScrollyTelling from './evolving_chart_scrollytelling';
import SpectrogramScrollyTelling from './spectrogram_scrollytelling';

import previewSequence from 'assets/data/predicted_william_cyton';

import './style.css';
import SleepMechanisms from './sleep_mechanisms';
import TipsToImproveSleep from './improve_sleep_tips';

const SleepAnalysisResults = ({ location }) => {
  const [response] = useGlobalState('response');
  // const isPreviewMode = location.state?.isPreviewMode;
  const isPreviewMode = true;
  if (!isPreviewMode && !response) {
    return (
      <Redirect
        to={{
          pathname: '/analyze-my-sleep',
        }}
      />
    );
  }
  const data = isPreviewMode ? previewSequence : response.data;
  const { epochs, report, metadata } = data;
  const encodedJsonEpochs = encodeURIComponent(JSON.stringify(data.epochs));

  const sleepAnalysisIntro = (
    <Container className="mt-5 mb-5 text-justify">
      {isPreviewMode && (
        <Row className="mb-5 justify-content-center">
          <PreviewModeWarning />
        </Row>
      )}
      <p className="lead mb-5">
        Through the following visualizations, you will be able to discover the time you spent in which sleep stages, how
        they are defined and their functions. There are also, here and there, commonly seen sleep analysis metrics,
        which have been calculated on your night. Then, an interactive hypnogram allows you to see the transitions
        between the sleep stages. Finally, a visualization illustrates how we've been able to classify the recorded EEG
        data into sleep stages.
      </p>
    </Container>
  );
  const evolvingChartOutro = (
    <>
      <Container className="text-justify">
        <p>
          We have seen that sleep can be decomposed into two stages, whereas REM and NREM. We’ve also defined other
          measures of your sleep architecture, such as your sleep latency, efficiency and total sleep time.
        </p>
      </Container>
      <SleepMechanisms />
      <section className="section bg-secondary pt-150">
        <Container className="text-justify">
          <TipsToImproveSleep />
          <p>
            Although we’ve looked at many aspects of your night’s sleep, we haven’t properly looked at your sleep
            dynamics, whereas how your sleep evolves overnight.
          </p>
        </Container>
      </section>
    </>
  );

  const hypnogramIntro = (
    <Container className="text-justify mt-5">
      <h4>Hypnogram</h4>
      <p>
        A hypnogram allows you to visually inspect the evolution of your night, through time. The vertical axis
        represents how hard it is to wake up, namely the sleep deepness. We see that REM is one of the lightest sleep
        stages (along with N1), because we unknowingly wake up from that stage. Those short periods of arousal often
        last no longer than 15 seconds, are followed by a lighter sleep stage, and cannot be remembered the next
        morning. If they are too frequent, they can affect your sleep quality. [5] We can see that, throughout the
        night, stages follow about the same pattern, whereas we go from NREM (either N1, N2 and N3) and then to REM, and
        so on. We call those sleep cycles, and those typically range from four to six, each one lasting from 90 to 110
        minutes. Another commonly looked at measurement is the time between sleep onset and the first REM epoch, namely
        REM latency, which corresponds to 20 minutes.
      </p>
    </Container>
  );
  const hypnogramOutro = (
    <Container className="text-justify">
      <p>
        You’ve been able to visualize and inspect your night of sleep, which we’ve classified only based on your EEG
        recordings. In a sleep lab, electrophysiology technologists generally look at your EEG, EOG and submental EMG,
        and then manually classify each epoch of 30 seconds that compose your night. By looking at your EEG recordings,
        we can see some patterns that can help electrophysiology technologists, and our classifier, discriminate sleep
        stages throughout the night.
      </p>
    </Container>
  );

  const spectrogramIntro = (
    <Container className="text-justify">
      <h4 className="mt-5">Spectrogram</h4>
      <p>
        Below are represented spectrograms of both your EEG channels. Spectrograms can be viewed as if we took all of
        your signals, we’ve separated it in contiguous 30 seconds chunks, stacked then horizontally and to which we’ve
        applied the fast fourier transform. We then have, for each 30 seconds epoch, the corresponding amplitudes for
        each frequency that makes up the signal, hence the spectra.
      </p>
      <p>
        We then converted the scale to logarithmic, to better see the differences in the spectrums. We then speak of
        signal power instead of signal amplitude, because we look at the spectrums in a logarithmic scale.
      </p>
      <h5>How to read it?</h5>
      <p>
        Yellow therefore means that in that 30 seconds time frame, that particular frequency had a big amplitude. Pink
        means that you had that frequency with a lower amplitude. Purple means that you didn’t have that frequency in
        the signal.
      </p>
      <p>
        To get a better understanding at how spectrograms work, you can{' '}
        <a href="https://musiclab.chromeexperiments.com/Spectrogram/" rel="noopener noreferrer" target="_blank">
          check out this example
        </a>
        &nbsp;that decomposes sound frequency from your microphone.
      </p>
    </Container>
  );
  const spectrogramOutro = (
    <Container className="text-justify">
      <p className="mt-5">BLABLABLA</p>
    </Container>
  );
  const callToAction = (
    <Container className="text-justify">
      <p>Wanna know how accurate this data is?</p>
      <Row className="scrollytelling-container__buttons">
        <Link to="/performance">
          <Button className="mt-4" color="default">
            Check out the performances
          </Button>
        </Link>
        <div className="mt-4" id="sleep_analysis_results__download_button">
          <Button
            color="secondary"
            href={`data:text/json;charset=utf-8,${encodedJsonEpochs}`}
            download="myresults.json"
            disabled={isPreviewMode}
          >
            Download my results
          </Button>
        </div>
        {isPreviewMode && (
          <UncontrolledTooltip delay={0} placement="top" target="sleep_analysis_results__download_button">
            You need to upload your own sleep sequence in order to download your data
          </UncontrolledTooltip>
        )}
      </Row>
    </Container>
  );

  return (
    <>
      <Header
        sizeClass={'pb-150'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      {sleepAnalysisIntro}
      <EvolvingChartScrollyTelling epochs={epochs} report={report} metadata={metadata} />
      {evolvingChartOutro}
      {hypnogramIntro}
      <Container>
        <D3Component callback={createSingleHypnogram} data={data.epochs ? [data.epochs] : null} />
      </Container>
      {hypnogramOutro}
      {spectrogramIntro}
      <SpectrogramScrollyTelling spectrograms={data.spectrograms} epochs={data.epochs} />
      {spectrogramOutro}
      {callToAction}
    </>
  );
};

export default SleepAnalysisResults;
