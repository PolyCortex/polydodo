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

const EvolvingChartScrollyTelling = ({ epochs, report, metadata }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const { bedTime, wakeUpTime, totalBedTime } = metadata;
  const {
    efficientSleepTime,
    sleepOnset,
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

  const Metric = ({ children }) => (
    <span className="text-primary">
      <strong>{children}</strong>
    </span>
  );

  const getTimeString = (numberSecondsUTC) => <Metric>{new Date(numberSecondsUTC * 1000).toLocaleTimeString()}</Metric>;
  const getDurationString = (numberSeconds) => {
    const nbHours = Math.floor(numberSeconds / 3600);
    const nbMinutes = Math.floor((numberSeconds % 3600) / 60);

    return <Metric>{nbHours > 0 ? `${nbHours} hours and ${nbMinutes} minutes` : `${nbMinutes} minutes`}</Metric>;
  };

  return (
    <Container className="text-justify">
      <div style={{ position: 'sticky', top: '10%' }}>
        <D3ComponentScrollyTelling
          callback={createEvolvingChart}
          data={epochs}
          isInitialized={isInitialized}
          setIsInitialized={setIsInitialized}
        />
      </div>
      <div style={{ marginBottom: '50%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              We can see that each colored block represents a part of your night. This timeline starts at your bed time,
              so {getTimeString(bedTime)}, and ends at the time you got out of bed, whereas {getTimeString(wakeUpTime)}.
              Of this total time, you spent {getDurationString(efficientSleepTime)} actually sleeping. You first fell
              asleep at {getTimeString(sleepOnset)}, to which we will refer to as sleep onset. You woke up at{' '}
              {getTimeString(sleepOffset)}, which can also be referred to as sleep offset. During that night's sleep,
              you went through {numberStagesTraversed} different stages. Let's take a look at them.
            </p>
          </CardBody>
        </Card>
      </Row>
      {isInitialized && (
        <WaypointDirection onDown={instanceChartCallbacks.fromTimeline} onUp={timelineChartCallbacks.fromInstance} />
      )}
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              You spent {getDurationString(report.WTime)} awake through your night. This duration is, in a sleep report,
              usually decomposed as three different components.
            </p>
            <p>
              First, <strong>sleep latency</strong> corresponds to the time you spend in bed before first falling
              asleep, which here is {getDurationString(sleepLatency)}.
            </p>
            <p>
              Secondly, <strong>wake after sleep onset</strong>, often abbreviated as WASO, is the time spent awake
              after first falling asleep and before waking up. In your case, it corresponds to {getDurationString(WASO)}
              .
            </p>
            <p>
              Thirdly, the time you spend in bed after waking up and getting out of bed, here being{' '}
              {getDurationString(wakeAfterSleepOffset)}, is called <strong>wake after sleep offset</strong>.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '125%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <strong>REM stage</strong>, which is short for <i>rapid eyes movement</i>, is the moment of the night
              where you experience dreams. During this stage, your muscles should be completely immobilized, and on the
              opposite, the activity of your brain should be very active, which illustrates why this stage is also
              called paradoxical sleep.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '100%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <strong>N1 stage</strong> is associated with that drowsy feeling before falling asleep. Most people
              wouldn’t say they fell asleep if they’ve been woken up from N1 sleep.
            </p>
            <p>
              <strong>N2 stage</strong> still corresponds to a light sleep, but where the muscle activity decreases
              more, and the eyes have stopped moving. It is called, along with N1, <strong>light sleep</strong>.
            </p>
          </CardBody>
        </Card>
      </Row>
      <div style={{ marginBottom: '100%' }} />
      <Row>
        <Card className="shadow col-lg-6 mx-auto">
          <CardBody>
            <p>
              <strong>N3 stage</strong> is when you are deeply asleep, hence it’s also called{' '}
              <strong>deep sleep</strong>, or sometimes <strong>slow wave sleep</strong>, and is the most difficult to
              wake up from. It is during those stages that your cells get repaired, and that tissue grows.
            </p>
            <p>
              N1, N2 and N3 are called, in opposition to REM, the <strong>NREM sleep stages</strong>.
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
              We are currently looking at your in bed sleep stage proportions. Wake time may be overrepresented, because
              it includes your sleep latency ({getDurationString(sleepLatency)}) and the time you spent in bed after
              waking up ({getDurationString(wakeAfterSleepOffset)}).
            </p>
            <p>
              We can see that your most prominent sleep stage is <Metric>{mostProminentStage}</Metric>, which in your
              case corresponds to&nbsp;{getDurationString(sleepStageTimes[mostProminentStage])}. Usually, the most
              prominent sleep stage is&nbsp;{mostProminentStage === 'N2' && ', as it is in your case, '}N2.
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
              {getDurationString(sleepEfficiency * totalBedTime)}.
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
              As a rule of thumb, adults approximately stay 5% of their total sleep time in N1, 50% in N2 and 20% in N3.
              The remaining 25% is spent in the REM stage sleep.
            </p>
          </CardBody>
        </Card>
      </Row>
      <Row>
        <div style={{ marginBottom: '70%' }} />
      </Row>
    </Container>
  );
};

EvolvingChartScrollyTelling.propTypes = {
  epochs: PropTypes.object.isRequired,
};

export default EvolvingChartScrollyTelling;
