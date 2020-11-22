import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Card, CardBody, Row } from 'reactstrap';
import _ from 'lodash';

import D3ComponentScrollyTelling from 'components/d3component_scrollytelling';
import WaypointDirection from 'components/waypoint_direction';

import createEvolvingChart, {
  instanceChartCallbacks,
  timelineChartCallbacks,
  barChartCallbacks,
  stackedBarChartCallbacks,
} from 'd3/evolving_chart/evolving_chart';
import { STAGES_ORDERED } from 'd3/constants';
import Metric from './metric';

import './style.css';

const EvolvingChartScrollyTelling = ({ epochs, report, metadata, subject }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const { bedTime, wakeUpTime, totalBedTime } = metadata;
  const {
    efficientSleepTime,
    sleepTime,
    sleepOnset,
    stageShifts,
    awakenings,
    sleepOffset,
    sleepLatency,
    WASO,
    sleepEfficiency,
    wakeAfterSleepOffset,
  } = report;
  const sleepStageTimes = STAGES_ORDERED.reduce(
    (obj, stage) => Object({ ...obj, [stage]: report[`${stage}Time`] }),
    {},
  );
  const numberStagesTraversed = _.filter(sleepStageTimes, (time) => time > 0).length;
  const mostProminentStage = _.maxBy(_.keys(sleepStageTimes), (stage) => sleepStageTimes[stage]);
  const recommendedSleepStage =
    parseInt(subject.age) > 18
      ? 'an adult should sleep more than 7 hours per night to promote optimal health [Watson and al., 2015]'
      : 'teenagers, from 13 to 18 years of age, should sleep 8 to 10 hours on a regular basis to promote optimal health [Paruthi and al., 2016]';
  return (
    <Container className="text-justify">
      <div style={{ position: 'sticky', top: '10%' }}>
        <D3ComponentScrollyTelling
          callback={createEvolvingChart}
          data={epochs}
          isInitialized={isInitialized}
          setIsInitialized={setIsInitialized}
          useDiv
        />
      </div>
      <div style={{ marginBottom: '50%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              This is your sleep time line. Each color represents one of the 5 sleep stages which are&nbsp;
              <span className="scrollytelling_cards__w_text">Wake</span>
              ,&nbsp;
              <span className="scrollytelling_cards__rem_text">REM</span>
              ,&nbsp;
              <span className="scrollytelling_cards__n1_text">N1</span>,&nbsp;
              <span className="scrollytelling_cards__n2_text">N2</span>
              &nbsp;and&nbsp;
              <span className="scrollytelling_cards__n3_text">N3</span>. Each of the colored blocks reprensent a part of
              your night that was associated to one of these five stages. You may want to hover them as it shows more
              details about that part of your night.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              The time you spent out of bed is not taken into account in this analysis. Thus, our timeline starts at the
              bedtime, so <Metric isTime>{bedTime}</Metric> in your case, and ends at the time you got out of bed,
              whereas&nbsp;
              <Metric isTime>{wakeUpTime}</Metric>. Out of this <Metric isDuration>{sleepTime}</Metric>, you spent&nbsp;
              <Metric isDuration>{efficientSleepTime}</Metric> actually sleeping. According to the American Academy of
              Sleep Medicine, <Metric>{recommendedSleepStage}</Metric>.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              In total, there were <Metric>{stageShifts}</Metric> sleep stage shifts and <Metric>{awakenings}</Metric>
              &nbsp;noctural awakenings. "High levels of sleep fragmentation, as defined by recurrent awakenings and/or
              stage shifts may result in complaints of non-restorative sleep even when an apparently normal total sleep
              time is present." [Shrivastava and al., 2014]
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              You first fell asleep at <Metric isTime>{sleepOnset}</Metric>, to which we will refer to as sleep onset.
              You woke up at <Metric isTime>{sleepOffset}</Metric>, which can also be referred to as sleep offset.
              During that night's sleep, you went through <Metric>{numberStagesTraversed}</Metric> different stages.
              Let's take a look at them.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && (
        <WaypointDirection onDown={instanceChartCallbacks.fromTimeline} onUp={timelineChartCallbacks.fromInstance} />
      )}
      <div style={{ marginBottom: '175%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              Let's first look at your <span className="scrollytelling_cards__w_text">Wake</span> stage. This stage
              corresponds to when you are fully conscious and active.
            </p>
            <p>
              You spent <Metric isDuration>{report.WTime}</Metric> awake through your night. This duration is, in a
              sleep report, usually decomposed as three different components.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              First, <strong>sleep latency</strong> corresponds to the time you spend awake in bed before first falling
              asleep, which here is <Metric isDuration>{sleepLatency}</Metric>.
            </p>
            <p>
              Secondly, <strong>wake after sleep onset</strong>, often abbreviated as WASO, is the time spent awake
              between sleep onset and sleep offset. In your case, it corresponds to&nbsp;
              <Metric isDuration>{WASO}</Metric>.
            </p>
            <p>
              Thirdly, the time you spend in bed after waking up and getting out of bed, here being&nbsp;
              <Metric isDuration>{wakeAfterSleepOffset}</Metric>, is called <strong>wake after sleep offset</strong>.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__rem_text">REM</span> stage, which is short for&nbsp;
              <i>rapid eyes movement</i>, is a stage characterized by, like its name implies it, rapid eyes movements.
              During this stage, your muscles are completely immobilized, but on the opposite, your brain and your heart
              should be very active, which illustrates why this stage is also called paradoxical sleep. This sleep stage
              therefore closely resembles wake and it is hard to tell the difference using EEG signals. We are dreaming
              in all sleep stages but it is in the&nbsp;
              <span className="scrollytelling_cards__rem_text">REM</span> stage that dreams are best remembered and seem
              the most vivid.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '100%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__n1_text">N1</span> stage is associated with that drowsy feeling
              before falling asleep. It is a transition stage between wake and sleep. This stage is characterized by
              reduced alertness, muscle tone and heart rate. Most people wouldn’t say they fell asleep if they’ve been
              woken up from <span className="scrollytelling_cards__n1_text">N1</span> sleep.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '100%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__n2_text">N2</span>&nbsp; stage corresponds to light sleep. The
              muscle activity decreases more, and the eyes have stopped moving. In this stage, the sensitivity to
              external stimuli is still noticeable. On the EEG, this stage can be identified by the presence of&nbsp;
              <a href="https://en.wikipedia.org/wiki/K-complex" target="_blank" rel="noreferrer">
                K complexes
              </a>
              &nbsp;and&nbsp;
              <a href="https://en.wikipedia.org/wiki/Sleep_spindle" target="_blank" rel="noreferrer">
                sleep spindles
              </a>
              .
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '100%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__n3_text">N3</span> stage is when you are deeply asleep, hence it’s
              also called&nbsp;
              <strong>deep sleep</strong>, or sometimes <strong>slow wave sleep</strong>, and is the most difficult to
              wake up from. During this stage, virtually no muscle activity can be detected. It is during those stages
              that your cells get repaired, and that tissue grows. This is considered the most restful phase of sleep.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '100%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__n1_text">N1</span>,&nbsp;
              <span className="scrollytelling_cards__n2_text">N2</span> and&nbsp;
              <span className="scrollytelling_cards__n3_text">N3</span> are called, in opposition to{' '}
              <span className="scrollytelling_cards__rem_text">REM</span>, the&nbsp;
              <strong>NREM sleep stages</strong>.
            </p>
            <p>
              We've looked at the different functions of each sleep stages. But how much time did you actually spend in
              each during the night?
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && (
        <WaypointDirection onDown={barChartCallbacks.fromInstance} onUp={instanceChartCallbacks.fromBarChart} />
      )}
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 ml-auto">
          <CardBody>
            <p>
              This view relativizes the total time spent in each sleep stage according to the other stages. Take your
              time to compare the time spent in each stage. Note that the horizontal axis now represents the time spent
              in hours since bedtime.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 ml-auto">
          <CardBody>
            <p>
              <span className="scrollytelling_cards__w_text">Wake</span> time may be overrepresented, because it
              includes your sleep latency (<Metric isDuration>{sleepLatency}</Metric>) and the time you spent in bed
              after sleep offset (<Metric isDuration>{wakeAfterSleepOffset}</Metric>).
            </p>
            <p>
              We can see that your most prominent sleep stage is <Metric>{mostProminentStage}</Metric>, which in your
              case corresponds to&nbsp;<Metric isDuration>{sleepStageTimes[mostProminentStage]}</Metric>. Usually, the
              most prominent sleep stage is <span className="scrollytelling_cards__n2_text">N2</span>
              <Metric>{mostProminentStage === 'N2' ? ', as it is in your case. ' : '.'}</Metric>
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 ml-auto">
          <CardBody>
            <p>
              From here, we can also look at your sleep efficiency, which is the proportion of time spent asleep over
              the overall time spent in bed. In your case, it corresponds to&nbsp;
              <Metric>{(sleepEfficiency * 100).toFixed()}%</Metric>, or&nbsp;
              <Metric isDuration>{sleepEfficiency * totalBedTime}</Metric>.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && (
        <WaypointDirection
          onDown={stackedBarChartCallbacks.fromBarChart}
          onUp={barChartCallbacks.fromStackedBarChart}
        />
      )}
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              As a rule of thumb, adults approximately stay 5% of their total sleep time in N1, 50% in&nbsp;
              <span className="scrollytelling_cards__n2_text">N2</span> and 20% in&nbsp;
              <span className="scrollytelling_cards__n3_text">N3</span>. The remaining 25% is spent in the&nbsp;
              <span className="scrollytelling_cards__rem_text">REM</span> stage sleep. A higher proportion of&nbsp;
              <span className="scrollytelling_cards__n3_text">N3</span> should corresponds to an overall more intense
              sleep.
            </p>
          </CardBody>
        </Card>
      </Row>
      <Row>
        <div style={{ marginBottom: '100%' }} />
      </Row>
    </Container>
  );
};

EvolvingChartScrollyTelling.propTypes = {
  epochs: PropTypes.object.isRequired,
};

export default EvolvingChartScrollyTelling;
