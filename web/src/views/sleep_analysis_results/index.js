import React from 'react';
import { Container, Row, Button, UncontrolledTooltip, Badge } from 'reactstrap';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

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
import Metric from './metric';

const SleepAnalysisResults = () => {
  const [response] = useGlobalState('response');
  const [searchParams] = useSearchParams();
  const isPreviewMode = searchParams.get('preview') === 'true' ? true : false;

  if (!isPreviewMode && !response) {
    return <Navigate to="/analyze-my-sleep" replace />;
  }
  const data = isPreviewMode ? previewSequence : response.data;
  const { epochs, report, metadata, subject } = data;
  const encodedJsonEpochs = encodeURIComponent(JSON.stringify(data.epochs));

  const sleepAnalysisIntro = (
    <Container className="mt-5 mb-8 text-justify">
      {isPreviewMode && (
        <Row className="mb-5 justify-content-center">
          <PreviewModeWarning />
        </Row>
      )}
      <p className="lead my-5">
        That's it! We have created your personalized sleep data visualizations. Through the following visualizations,
        you will discover the time you spent in each sleep stage, how they are defined and what are their respective
        functions. Then, an interactive hypnogram allows you to see the transitions between the sleep stages. Finally,
        your spectrogram will be presented in detail and some explanations will try to give you a sense of how we were
        able to find your sleep stages from your EEG data.
      </p>

      <p className="lead my-5">
        Throughout these visualizations, your personalized sleep metrics will be presented to you. These were calculated
        from the stages of sleep that we found. They will appear, here and there, <Metric>in blue</Metric>, in order to
        stand out from the rest of the text.
      </p>

      <p className="lead mt-5">Without further ado, let's get started:</p>
    </Container>
  );
  const evolvingChartOutro = (
    <>
      <Container className="text-justify">
        <p className="lead">
          You should now have a pretty good picture of how you spent your night. Also, we have seen that sleep can be
          decomposed into two groups: REM and NREM. We’ve also defined other measures of your sleep architecture, such
          as your sleep latency, efficiency and total sleep time. All of these metrics are very interesting. However, it
          would be interesting to understand a little bit more about sleep in order to make sense of this.
        </p>
        <h4 className="mt-5">This is about your hormones</h4>
        <p className="lead">
          Hormones such as melatonin and cortisol play a decisive role in sleep. In fact, it is their variation that
          partly explains the circadian cycle.
        </p>
        <p className="lead">
          During the day, a neurotransmitter called serotonin gradually accumulates in the pineal gland. When it gets
          dark, the pineal gland synthesizes melatonin which is a hormone that is synthesized from this serotonin.
          Melatonin helps induce the sleepiness that prevails in the evening. Exposure to light including that of
          screens, street lighting, etc. inhibits the secretion of melatonin and impairs sleep. On the other hand, in
          the morning, the adrenal gland secretes the hormone cortisol from cholesterol. Its effect is to promote light
          sleep and possibly awake. Any imbalance in these hormones or their secretion can have an inhibiting effect on
          sleep.
        </p>
        <p className="lead">
          Adenosine is not a hormone, but it also plays its role into sleep mechanisms. When you are awake, the level of
          adenosine continuously increases in your brain. In contrast, when you sleep it is the opposite: it
          continuously falls. This is why coffee makes us feel more energized, as caffeine acts as an adenosine-receptor
          antagonist [O. Björklund et al., 2008].
        </p>
      </Container>
      <SleepMechanisms />
      <section className="section bg-secondary pt-150">
        <Container className="text-justify">
          <TipsToImproveSleep />
          <p className="lead">
            Although we’ve looked at many aspects of your night’s sleep, we haven’t properly looked at your sleep
            dynamics, whereas how your sleep evolves overnight.
          </p>
        </Container>
      </section>
    </>
  );

  const hypnogramIntro = (
    <Container className="text-justify mt-5">
      <h3>Hypnogram</h3>
      <p className="mt-3 lead">
        A hypnogram allows you to visually inspect the evolution of your night, through time. The vertical axis
        represents how hard it is to wake up, namely the sleep depth. We see that REM is one of the lightest sleep
        stages (along with N1), because we unknowingly wake up from that stage. Those short periods of arousal often
        last no longer than 15 seconds, are followed by a lighter sleep stage, and cannot be remembered the next
        morning. If they are too frequent, they can affect your sleep quality. Considering that we only have a 30
        seconds resolution, as we scored the night for each 30 seconds epochs, we can see that you have woken up&nbsp;
        <Metric>{report.awakenings}</Metric> times.
      </p>
      <p className="my-5 lead">
        We can also see that, throughout the night, stages follow about the same pattern, whereas we go from NREM
        (either N1, N2 and N3) and then to REM, and so on. We call those sleep cycles, and those typically range from
        four to six, each one lasting from 1 hour and a half to almost 2 hours. Another commonly looked at measurement
        is the time between sleep onset and the first REM epoch, namely REM latency, which corresponds to&nbsp;
        <Metric isDuration>{report.remLatency}</Metric>. It can be interesting as paradoxical sleep&nbsp;
        <q>is very sensitive to the effects of medication, sleep deprivation, and circadian rhythm disorders</q>&nbsp;
        [Shrivastava and al., 2014].
      </p>
    </Container>
  );
  const hypnogramOutro = (
    <Container className="text-justify">
      <p className="lead">
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
      <h3 className="mt-5">Spectrogram</h3>
      <p className="lead">
        Below are represented spectrograms of the EEG signals recorded for each channel. The spectrogram is a special
        visualization of a signal in the frequency and time domain. Indeed, it represents the spectrum of a signal as it
        changes over time. Concretely, spectrograms can be viewed as if we took your signal, separated it into 30
        seconds blocks, stacked them horizontally and then applied the Fast Fourier Transform. We then have, for each 30
        seconds epoch, the corresponding amplitudes for each frequency that makes up the signal hence the spectra.
      </p>
      <p className="my-5 lead">
        We then converted the scale to logarithmic, to better see the differences in the spectrums. We then speak of
        signal power instead of signal amplitude, because we look at the spectrums in a logarithmic scale.
      </p>
      <h4>Why are spectrograms useful to observe EEG?</h4>
      <p className="my-5 lead">
        Electroencephalography signals allow us to observe brainwaves which have been traditionally split into defined
        frequency bands, as they appear and disappear under specific conditions with specific voltage [M. Corsi-Cabrera
        and al., 2000]. Thus, observing the spectrum of a signal is great as we can see the voltage amplitude for each
        band and then try to predict under which physiological condition was the subject in. But as we've mentionned,
        the EEG signals' spectrum do change over time, as EEG is not a stationnary signal. So we need to split the
        signal into much smaller chunks, and then observe the spectrum of these chunks, and their evolution over time.
      </p>
      <p className="my-5 lead">
        Furthermore, brainwaves frequency bands are widely used and their associated states are defined as below. Please
        note that the ranges defined often varies, but we've settled on the definitions proposed by D.Purves in the
        "Stages of Sleep" manual [D. Purves et al., 2001]. Also, brain waves are inherently associated with different
        region through the brain. As our EEG montage is composed of electrodes placed on the midline axis, not all
        frequency band ranges will be easily visible through our spectrograms. It can also explain why the expected
        voltage intensity will be sometimes more explicit on the Fpz-Cz spectrogram vs the Pz-Oz spectrogram.
      </p>
      <ul className="list-unstyled my-4">
        <li className="py-2">
          <div className="d-flex mb-0">
            <Badge className="badge-circle flex-shrink-0 mr-3" color="primary">
              &beta;
            </Badge>
            <div>
              The <strong>beta frequency band range</strong> is defined as between 14 and 60 Hz. It is mostly seen at
              the front side of the scalp.
            </div>
          </div>
        </li>
        <li className="py-2">
          <div className="d-flex mb-0">
            <Badge className="badge-circle flex-shrink-0 mr-3" color="primary">
              &alpha;
            </Badge>
            <div>
              The <strong>alpha frequency band range</strong> is between 8 and 13 Hz. We mostly find these amplitudes on
              the posterior regions of the head, and on both sides.
            </div>
          </div>
        </li>
        <li className="py-2">
          <div className="d-flex mb-0">
            <Badge className="badge-circle flex-shrink-0 mr-3" color="primary">
              &theta;
            </Badge>
            <div>
              The <strong>theta frequency band range</strong> is characterized by frequencies between 4 and 7 Hz. These
              frequencies are not tied to any specific location of the brain.
            </div>
          </div>
        </li>
        <li className="py-2">
          <div className="d-flex mb-0">
            <Badge className="badge-circle flex-shrink-0 mr-3" color="primary">
              &delta;
            </Badge>
            <div>
              The <strong>delta frequency band range</strong> is described as the lowest range, whereas below 4 Hz. This
              EEG band is located frontally for adults, and posteriorly for children.
            </div>
          </div>
        </li>
      </ul>
      <h4>How to read it?</h4>
      <p className="my-5 lead">
        Yellow therefore means that in that 30 seconds time frame, that particular frequency had a big amplitude. Pink
        means that you had that frequency with a lower amplitude. Purple means that you didn’t have that frequency in
        the signal.
      </p>
      <p className="my-5 lead">
        To get a better understanding at how spectrograms work, you can&nbsp;
        <a href="https://musiclab.chromeexperiments.com/Spectrogram/" rel="noopener noreferrer" target="_blank">
          check out this example
        </a>
        &nbsp;that decomposes sound frequency from your microphone.
      </p>
    </Container>
  );
  const callToAction = (
    <Container className="text-justify">
      <Row className="scrollytelling-container__buttons">
        <p className="mt-5 lead">
          If you found our visualizations helpful in better understanding how sleep works, and especially how you slept
          on your recorded night, you can come say hi at our &nbsp;
          <a href="https://www.facebook.com/PolyCortex/" target="_blank" rel="noopener noreferrer">
            Facebook page
          </a>
          . On another hand, if there have been problems or unexpected results while recording and analyzing your sleep,
          you can always open an issue in our &nbsp;
          <a href="https://github.com/PolyCortex/polydodo" target="_blank" rel="noopener noreferrer">
            Github repository
          </a>
          .
        </p>

        <p className="mt-5 lead">
          If you are curious about the performances of our classifier, we've written a short post about our methodology
          and our results. Check it out! Otherwise, you can also download the predicted sleep stages.
        </p>
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

  const references = (
    <Container className="my-6">
      <small className="text-muted text-justify">
        <div className="mt-2">
          [Paruthi and al., 2016] S. Paruthi, L. J. Brooks, C. Dambrosio, W. A. Hall, S. Kotagal, R. M. Lloyd, B. A.
          Malow, K. Maski, C. Nichols, S. F. Quan, C. L. Rosen, M. M. Troester, and M. S. Wise, “Recommended Amount of
          Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine,” Journal of
          Clinical Sleep Medicine, vol. 12, no. 06, pp. 785–786, 2016.
        </div>
        <div className="mt-2">
          [Watson and al., 2015] N. F. Watson, M. S. Badr, G. Belenky, D. L. Bliwise, O. M. Buxton, D. Buysse, D. F.
          Dinges, J. Gangwisch, M. A. Grandner, C. Kushida, R. K. Malhotra, J. L. Martin, S. R. Patel, S. F. Quan, and
          E. Tasali, “Recommended Amount of Sleep for a Healthy Adult: A Joint Consensus Statement of the American
          Academy of Sleep Medicine and Sleep Research Society,” Journal of Clinical Sleep Medicine, vol. 11, no. 06,
          pp. 591–592, 2015.
        </div>
        <div className="mt-2">
          [Shrivastava and al., 2014] D. Shrivastava, S. Jung, M. Saadat, R. Sirohi, and K. Crewson, “How to interpret
          the results of a sleep study,” Journal of Community Hospital Internal Medicine Perspectives, vol. 4, no. 5, p.
          24983, 2014.
        </div>
        <div className="mt-2">
          [D. Purves and al., 2001] D. Purves et al., “Stages of Sleep,” Neuroscience. 2nd edition, 2001, Accessed: Nov.
          22, 2020. [Online]. Available: https://www.ncbi.nlm.nih.gov/books/NBK10996/.
        </div>
        <div className="mt-2">
          [O. Björklund and al., 2008] Björklund O, Kahlström J, Salmi P, Fredholm BB "Perinatal Caffeine, Acting on
          Maternal Adenosine A1 Receptors, Causes Long-Lasting Behavioral Changes in Mouse Offspring". vol. 3, no. 12:
          e3977, 2008. https://doi.org/10.1371/journal.pone.0003977
        </div>
        <div className="mt-2">
          [M. Corsi-Cabrera, and al., 2000] M. Corsi-Cabrera, M. A. Guevara, Y. Del Río-Portilla, C. Arce, and Y.
          Villanueva-Hernández, “EEG Bands During Wakefulness, Slow-Wave and Paradoxical Sleep as a Result Of Principal
          Component Analysis in Man,” Sleep, vol. 23, no. 6, pp. 1–7, Sep. 2000, doi: 10.1093/sleep/23.6.1a.
        </div>
      </small>
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
      <EvolvingChartScrollyTelling epochs={epochs} report={report} metadata={metadata} subject={subject} />
      {evolvingChartOutro}
      {hypnogramIntro}
      <Container>
        <D3Component callback={createSingleHypnogram} data={data.epochs ? [data.epochs] : null} />
      </Container>
      {hypnogramOutro}
      {spectrogramIntro}
      <SpectrogramScrollyTelling spectrograms={data.spectrograms} epochs={data.epochs} />
      {callToAction}
      {references}
    </>
  );
};

export default SleepAnalysisResults;
