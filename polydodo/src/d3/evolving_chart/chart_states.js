import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';

import { BAR_HEIGHT, DIMENSION } from './constants';
import { EPOCH_DURATION_MS, TRANSITION_TIME_MS, STAGES_ORDERED } from '../constants';

export const createTimelineChartCallbacks = (g, xTime, xTimeAxis, color, tooltip) =>
  Object({
    fromInitial: () => {
      const annotationRects = g.selectAll('.rect-stacked').interrupt();

      setAttrOnAnnotationRects(annotationRects, xTime, 0, color, tooltip);

      g.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${BAR_HEIGHT})`).call(xTimeAxis);
    },
    fromInstance: () => {
      const annotationRects = g.selectAll('.rect-stacked').interrupt();

      g.selectAll('.y.axis').remove();

      setAttrOnAnnotationRects(annotationRects, xTime, 0, color, tooltip);

      transitionHorizontalAxis(g, BAR_HEIGHT);
    },
  });

export const createInstanceChartCallbacks = (g, data, xTime, xTimeAxis, yAxis, color, tooltip) =>
  Object({
    fromTimeline: () => {
      const annotationRects = g.selectAll('.rect-stacked').interrupt();

      createVerticalAxis(g, yAxis, color);
      transitionHorizontalAxis(g, STAGES_ORDERED.length * BAR_HEIGHT);
      setAttrOnAnnotationRects(annotationRects, xTime, getVerticalPositionCallback, color, tooltip);
    },
    fromBarChart: () => {
      const annotationRects = g.selectAll('.rect-stacked').interrupt();
      const xProportionCallback = getOffsetSleepStageProportionCallback(data);
      annotationRects.attr('x', xProportionCallback).attr('width', ({ end, start }) => xTime(end) - xTime(start));

      g.selectAll('text.proportion').remove();

      g.select('.x.axis').interrupt().transition().call(xTimeAxis);
      transitionHorizontalAxis(g, STAGES_ORDERED.length * BAR_HEIGHT);

      setAttrOnAnnotationRects(annotationRects, xTime, getVerticalPositionCallback, color, tooltip);
    },
  });

export const createBarChartCallbacks = (g, data, xAxisLinear, yAxis, color, tip) =>
  Object({
    fromInstance: () => {
      const { firstStageIndexes, stageTimeProportions } = data;
      const annotationRects = g.selectAll('.rect-stacked').interrupt();
      const xProportionCallback = getOffsetSleepStageProportionCallback(data);

      g.select('.x.axis').transition().call(xAxisLinear);
      transitionHorizontalAxis(g, STAGES_ORDERED.length * BAR_HEIGHT);

      setTooltip(annotationRects, tip)
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr('y', getVerticalPositionCallback)
        .attr('x', xProportionCallback)
        .on('end', () => {
          // Only keep the first rectangle of each stage to be visible
          g.selectAll('.rect-stacked').attr('x', 0).attr('width', getFirstRectangleProportionWidthCallback(firstStageIndexes, stageTimeProportions));
          createProportionLabels(g, data);
        });
    },
    fromStackedBarChart: () => {
      const annotationRects = g.selectAll('.rect-stacked').interrupt();

      g.selectAll('text.label-sleepType').remove();
      g.selectAll('text.proportion').remove();

      createVerticalAxis(g, yAxis, color);
      transitionHorizontalAxis(g, STAGES_ORDERED.length * BAR_HEIGHT);

      annotationRects
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr('y', (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage))
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr('x', 0)
        .on('end', () => createProportionLabels(g, data));
    },
  });

export const createStackedBarChartCallbacks = (g, data) =>
  Object({
    fromBarChart: () => {
      const { annotations, firstStageIndexes, stageTimeProportions, epochs } = data;
      const firstAnnotationsByStage = _.filter(annotations, ({ stage }, index) => firstStageIndexes[stage] === index);
      const getHorizontalPositionSleepStage = ({ stage }) =>
        (getCumulativeProportionOfNightAtStart(stage, stageTimeProportions) + stageTimeProportions[stage] / 2) * DIMENSION.WIDTH;
      const annotationRects = g.selectAll('.rect-stacked').interrupt();

      g.selectAll('.y.axis').remove();
      g.selectAll('text.proportion').remove();

      transitionHorizontalAxis(g, BAR_HEIGHT);

      annotationRects
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr('x', ({ stage }) => getCumulativeProportionOfNightAtStart(stage, stageTimeProportions) * DIMENSION.WIDTH)
        .attr('width', getFirstRectangleProportionWidthCallback(firstStageIndexes, stageTimeProportions))
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr('y', 0);

      g.selectAll('.text')
        .data(firstAnnotationsByStage)
        .enter()
        .append('text')
        .attr('class', 'proportion')
        .style('text-anchor', 'middle')
        .append('tspan')
        .text(({ stage }) => moment.utc(stageTimeProportions[stage] * epochs.length * EPOCH_DURATION_MS).format('HH:mm'))
        .attr('x', getHorizontalPositionSleepStage)
        .attr('y', 40)
        .append('tspan')
        .text(({ stage }) => `${_.round(stageTimeProportions[stage] * 100, 2)}%`)
        .attr('x', getHorizontalPositionSleepStage)
        .attr('y', 60);
    },
  });

const setAttrOnAnnotationRects = (annotationRects, x, yPosition, color, tooltip) =>
  setTooltip(annotationRects, tooltip)
    .attr('height', BAR_HEIGHT)
    .transition()
    .duration(TRANSITION_TIME_MS)
    .attr('x', ({ start }) => x(start))
    .attr('y', yPosition)
    .attr('width', ({ end, start }) => x(end) - x(start))
    .attr('fill', ({ stage }) => color(stage));

const setTooltip = (element, tooltip) =>
  element
    .on('mouseover', function (d) {
      tooltip.show(d, this);
      d3.select(this).style('opacity', 0.8);
    })
    .on('mouseout', function () {
      tooltip.hide();
      d3.select(this).style('opacity', 1);
    });

const getVerticalPositionCallback = (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage);

const getFirstRectangleProportionWidthCallback = (firstStageIndexes, stageTimeProportions) => ({ stage }, i) =>
  i === firstStageIndexes[stage] ? stageTimeProportions[stage] * DIMENSION.WIDTH : 0;

const createVerticalAxis = (g, yAxis, color) =>
  g
    .append('g')
    .attr('class', 'y axis')
    .style('font-size', '1.5rem')
    .transition()
    .duration(TRANSITION_TIME_MS)
    .call(yAxis)
    .selectAll('text')
    .attr('class', 'y-label')
    .attr('y', BAR_HEIGHT / 2)
    .attr('x', -10)
    .style('fill', (d) => color(d))
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle');

const transitionHorizontalAxis = (g, yPosition) =>
  g.select('.x.axis').transition().duration(TRANSITION_TIME_MS).attr('transform', `translate(0, ${yPosition})`);

const createProportionLabels = (g, data) =>
  g
    .selectAll('text.proportion')
    .data(data.annotations)
    .enter()
    .append('text')
    .attr('class', 'proportion')
    .text(({ stage }, i) => (i === data.firstStageIndexes[stage] ? `${_.round(data.stageTimeProportions[stage] * 100, 2)}%` : ''))
    .attr('x', DIMENSION.WIDTH / 20)
    .attr('y', ({ stage }) => BAR_HEIGHT * STAGES_ORDERED.indexOf(stage) + BAR_HEIGHT / 2)
    .style('fill', 'black');

const getCumulativeProportionOfNightAtStart = (stage, totalStageProportions) =>
  _.sum(
    _.slice(
      STAGES_ORDERED.map((stage_ordered) => totalStageProportions[stage_ordered]),
      0,
      _.indexOf(STAGES_ORDERED, stage),
    ),
  );

const getOffsetSleepStageProportionCallback = (data) => {
  const { annotations, stageTimeProportions } = data;
  const cumulSumProportions = cumulSum(
    _.mapValues(stageTimeProportions, (proportion, stage) =>
      _.filter(annotations, (d) => d.stage === stage).map((annotation) => annotation.proportion / proportion),
    ),
  );
  const annotationIndexSleepStage = annotations.map((annotation) => {
    return _.indexOf(
      _.filter(annotations, (d) => d.stage === annotation.stage),
      annotation,
    );
  });

  return (d, index) => DIMENSION.WIDTH * stageTimeProportions[d.stage] * cumulSumProportions[d.stage][annotationIndexSleepStage[index]];
};

const cumulSum = (annotationsProportionByStage) =>
  _.mapValues(annotationsProportionByStage, (annotationsProportion) => {
    const currentCumulSum = [0];
    annotationsProportion.forEach((proportion, index) => {
      if (index !== annotationsProportion.length - 1) {
        currentCumulSum.push(proportion + currentCumulSum[index]);
      }
    });
    return currentCumulSum;
  });
