import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Card, CardBody } from 'reactstrap';
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

const StackedBarChartScrollyTelling = ({ epochs, report, metadata }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  console.log(report, metadata);

  const getTimeString = (numberSecondsUTC) => new Date(numberSecondsUTC * 1000).toLocaleTimeString();
  const getDurationString = (numberSeconds) => {
    const nbHours = Math.floor(numberSeconds / 3600);
    const nbMinutes = Math.floor((numberSeconds % 3600) / 60);
    return nbHours > 0 ? `${nbHours} hours and ${nbMinutes} minutes` : `${nbMinutes} minutes`;
  };

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

  return (
    <Container>
      <div style={{ position: 'sticky', top: '10%' }}>
        <D3ComponentScrollyTelling
          callback={createEvolvingChart}
          data={epochs}
          isInitialized={isInitialized}
          setIsInitialized={setIsInitialized}
        />
      </div>
      <div style={{ marginBottom: '50%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            We can see that each colored block represents a part of your night. They are ordered from bed time to out of
            bed timestamps you’ve written in your journal. Each color is associated with a specific sleep stage. You
            went to bed at {getTimeString(bedTime)} and you got out of bed at {getTimeString(wakeUpTime)}, which adds up
            to {getDurationString(totalBedTime)} of time spent in bed. Of this total time, you spent{' '}
            {getDurationString(efficientSleepTime)} actually sleeping. You first fell asleep at{' '}
            {getTimeString(sleepOnset)}, to which we will refer to as sleep onset. The last non wake block ended at{' '}
            {getTimeString(sleepOffset)}, which can also be referred to as sleep offset. During that night's sleep, you
            went through {numberStagesTraversed} sleep stages. Let's try to see a little better what happened about each
            of them.
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      {isInitialized && (
        <WaypointDirection onDown={instanceChartCallbacks.fromTimeline} onUp={timelineChartCallbacks.fromInstance} />
      )}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>Wake stage is of course the stage we want to minimize when in bed. It can be decomposed into two parts:</p>
          <ul>
            <li>
              Sleep latency : Time spent before falling asleep, which corresponds to {getDurationString(sleepLatency)}
              &nbsp;minutes in your case.
            </li>
            <li>
              Wake after sleep onset (WASO): Time spent awake after first falling asleep and before waking up, which
              corresponds to {getDurationString(WASO)}.
            </li>
          </ul>
          <p>
            For healthy adults, it is normal to experience small awakenings during the night. Unprovoked awakenings are
            mostly during or after REM stages.
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            <strong>REM stage</strong> stands for “Rapid Eyes Movements” and is also known as “paradoxical sleep”. It is
            associated with dreaming and, as the National Sleep Foundation says,{' '}
            <strong>“the brain is awake and body paralyzed.”</strong>
          </p>
          <p>
            <strong>N1 stage</strong> is associated with that drowsy feeling before falling asleep. Most people wouldn’t
            say they fell asleep if they’ve been woken up from N1 sleep.
          </p>
          <p>
            <strong>N2 stage</strong> still corresponds to a light sleep, but where the muscle activity decreases more,
            and the eyes have stopped moving. It is called, along with N1, <strong>light sleep</strong>.
          </p>
          <p>
            <strong>N3 stage</strong> is when you are deeply asleep, hence it’s also called <strong>deep sleep</strong>,
            or sometimes <strong>slow wave</strong> sleep, and is the most difficult to wake up from. It is during those
            stages that your cells get repaired, and that tissue grows. But how much time did you spend in each stage
            during the whole night?
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      {isInitialized && (
        <WaypointDirection onDown={barChartCallbacks.fromInstance} onUp={instanceChartCallbacks.fromBarChart} />
      )}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            From here, we can look at your sleep efficiency, which is the proportion of time spent asleep over the
            overall time spent in bed. In your case, it corresponds to {(sleepEfficiency * 100).toFixed()}%, or&nbsp;
            {getDurationString(sleepEfficiency * totalBedTime)}.
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            We are currently looking at your in bed sleep stage proportions. Wake time may be overrepresented, because
            it includes your sleep latency ({getDurationString(sleepLatency)}) and the time you spent in bed after
            waking up ({getDurationString(wakeAfterSleepOffset)}).
          </p>
          <p>
            We can see that your most prominent sleep stage is {mostProminentStage}, which in your case corresponds
            to&nbsp;{getDurationString(sleepStageTimes[mostProminentStage])}. Usually, the most prominent sleep stage
            is&nbsp;{mostProminentStage === 'N2' && ', as it is in your case, '}N2.
          </p>
        </CardBody>
      </Card>
      {isInitialized && (
        <WaypointDirection
          onDown={stackedBarChartCallbacks.fromBarChart}
          onUp={barChartCallbacks.fromStackedBarChart}
        />
      )}
      <div style={{ marginBottom: '125%' }} />
      <Card className="shadow" style={{ position: 'relative' }}>
        <CardBody>
          <p>
            As a rule of thumb, adults approximately stay 5% of their total sleep time in N1; 50% in N2; and 20% is in
            N3. The remaining 25% is REM stage sleep.
          </p>
        </CardBody>
      </Card>
      <div style={{ marginBottom: '125%' }} />
      &nbsp;
    </Container>
  );
};

StackedBarChartScrollyTelling.propTypes = {
  epochs: PropTypes.object.isRequired,
};

export default StackedBarChartScrollyTelling;
