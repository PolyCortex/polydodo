import * as d3 from 'd3';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { preprocessData } from './preproc';
import { createLegend } from './legend';
import {
  createTimelineChartCallbacks,
  createInstanceChartCallbacks,
  createBarChartCallbacks,
  createStackedBarChartCallbacks,
} from './chart_states';
import { MARGIN, CANVAS_DIMENSION, BAR_HEIGHT, DIMENSION } from './constants';
import { STAGES_ORDERED, STAGE_TO_COLOR } from '../constants';
import { initializeTooltips } from './mouse_over';

export let instanceChartCallbacks = {};
export let timelineChartCallbacks = {};
export let barChartCallbacks = {};
export let stackedBarChartCallbacks = {};

const initializeScales = () => {
  const { WIDTH, HEIGHT } = DIMENSION;
  const xTime = d3.scaleTime([0, WIDTH]);
  const xLinear = d3.scaleLinear([0, WIDTH]);
  const y = d3.scaleOrdinal(_.range(0, HEIGHT + 1, BAR_HEIGHT));
  const colors = d3.scaleOrdinal(STAGES_ORDERED.map((x) => STAGE_TO_COLOR[x]));

  return { xTime, xLinear, y, colors };
};

const setDomainOnScales = (xTime, xLinear, y, colors, epochs) => {
  const start = _.first(epochs).timestamp;
  const end = _.last(epochs).timestamp;
  const nightDuration = DateTime.fromJSDate(end).diff(DateTime.fromJSDate(start), ['hours']);

  xTime.domain([start, end]);
  xLinear.domain([0, nightDuration.hours]);
  y.domain(STAGES_ORDERED);
  colors.domain(STAGES_ORDERED);
};

const initializeAxes = (xTime, xLinear, y) => {
  const xTimeAxis = d3.axisBottom(xTime).tickFormat((d) => `${d.getHours()}h`);
  const xLinearAxis = d3.axisBottom(xLinear).tickFormat((d) => `${d}h`);
  const yAxis = d3.axisLeft(y).tickSize(-DIMENSION.WIDTH); //will create the lines in second visualisation

  return { xTimeAxis, xLinearAxis, yAxis };
};

const createDrawingGroup = (svg) => svg.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

const bindAnnotationsToRects = (g, annotations) =>
  g.selectAll('.rect').data(annotations).enter().append('rect').attr('class', 'rect-stacked');

const createEvolvingChart = (containerNode, data) => {
  const svg = d3
    .select(containerNode)
    .append('svg')
    .attr('viewBox', `0, 0, ${CANVAS_DIMENSION.WIDTH}, ${CANVAS_DIMENSION.HEIGHT}`);
  const { xTime, xLinear, y, colors } = initializeScales();
  const { xTimeAxis, xLinearAxis, yAxis } = initializeAxes(xTime, xLinear, y);
  const g = createDrawingGroup(svg);
  createLegend(svg, colors);

  data = preprocessData(data);

  setDomainOnScales(xTime, xLinear, y, colors, data.epochs);
  const { barToolTip, stackedToolTip } = initializeTooltips(containerNode, data);
  bindAnnotationsToRects(g, data.annotations);

  timelineChartCallbacks = createTimelineChartCallbacks(g, xTime, xTimeAxis, colors, barToolTip);

  instanceChartCallbacks = createInstanceChartCallbacks(g, data, xTime, xTimeAxis, yAxis, colors, barToolTip);

  barChartCallbacks = createBarChartCallbacks(g, data, xLinearAxis, yAxis, colors, stackedToolTip);

  stackedBarChartCallbacks = createStackedBarChartCallbacks(g, data, stackedToolTip);

  timelineChartCallbacks.fromInitial();
};

export default createEvolvingChart;
